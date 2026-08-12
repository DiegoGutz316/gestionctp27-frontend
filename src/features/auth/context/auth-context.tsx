"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cerrarSesion,
  iniciarSesion,
  obtenerPerfil,
  obtenerPermisos,
} from "../servicios/auth.service";
import type { LoginDatos, UsuarioSesion } from "../models/auth.model";
import {
  cubre,
  matrizVacia,
  type MatrizPermisos,
  type ModuloSistema,
  type NivelPermiso,
} from "../models/permisos.model";

type AuthContextValue = {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  /**
   * Backlog 1.6: matriz de permisos del rol actual. Mientras carga (o si la
   * consulta falla) queda en NINGUNO, para no mostrar opciones que el backend
   * va a rechazar.
   */
  permisos: MatrizPermisos;
  /** true si el rol actual alcanza el nivel requerido en ese módulo. */
  puede: (modulo: ModuloSistema, nivel?: NivelPermiso) => boolean;
  login: (datos: LoginDatos) => Promise<UsuarioSesion>;
  logout: () => Promise<void>;
  refrescar: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [permisos, setPermisos] = useState<MatrizPermisos>(matrizVacia);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const [perfil, respuestaPermisos] = await Promise.all([
        obtenerPerfil(),
        obtenerPermisos(),
      ]);
      setUsuario(perfil);
      setPermisos(respuestaPermisos.permisos);
    } catch {
      setUsuario(null);
      setPermisos(matrizVacia());
    }
  }, []);

  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        const [perfil, respuestaPermisos] = await Promise.all([
          obtenerPerfil(),
          obtenerPermisos(),
        ]);
        if (activo) {
          setUsuario(perfil);
          setPermisos(respuestaPermisos.permisos);
        }
      } catch {
        if (activo) {
          setUsuario(null);
          setPermisos(matrizVacia());
        }
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  const login = useCallback(async (datos: LoginDatos) => {
    const respuesta = await iniciarSesion(datos);
    setUsuario(respuesta.usuario);

    // Los permisos se piden después del login porque dependen de la cookie que
    // acaba de emitir el backend.
    try {
      const respuestaPermisos = await obtenerPermisos();
      setPermisos(respuestaPermisos.permisos);
    } catch {
      setPermisos(matrizVacia());
    }

    return respuesta.usuario;
  }, []);

  const logout = useCallback(async () => {
    try {
      await cerrarSesion();
    } finally {
      setUsuario(null);
      setPermisos(matrizVacia());
    }
  }, []);

  const puede = useCallback(
    (modulo: ModuloSistema, nivel: NivelPermiso = "LECTURA") =>
      cubre(permisos[modulo], nivel),
    [permisos],
  );

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      permisos,
      puede,
      login,
      logout,
      refrescar,
    }),
    [usuario, cargando, permisos, puede, login, logout, refrescar],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
