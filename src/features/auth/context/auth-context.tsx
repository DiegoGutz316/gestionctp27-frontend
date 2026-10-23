"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
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

/**
 * La landing y la ficha pública de un aviso no usan la sesión. Consultarla
 * ahí responde 401 y el navegador lo muestra como fallo, aunque sea el caso
 * normal de un visitante anónimo.
 */
function rutaSinSesion(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/avisos" ||
    pathname.startsWith("/avisos/")
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const necesitaSesion = !rutaSinSesion(pathname);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [permisos, setPermisos] = useState<MatrizPermisos>(matrizVacia);
  const [cargando, setCargando] = useState(!rutaSinSesion(pathname));

  /**
   * Carga perfil y permisos en paralelo, pero los resuelve por separado.
   *
   * Solo el perfil decide si hay sesión: los permisos son complementarios. Con
   * `Promise.all` un fallo aislado de /auth/permisos (un backend desplegado sin
   * ese endpoint todavía, por ejemplo) tumbaba también al usuario y las
   * pantallas privadas mostraban "sesión expirada" con una cookie válida.
   * `allSettled` mantiene el paralelismo sin acoplar los dos fallos, y deja el
   * mismo criterio que ya usaba `login()`.
   */
  const cargarSesion = useCallback(async () => {
    const [resultadoPerfil, resultadoPermisos] = await Promise.allSettled([
      obtenerPerfil(),
      obtenerPermisos(),
    ]);

    if (resultadoPerfil.status === "rejected") {
      return { usuario: null, permisos: matrizVacia() };
    }

    return {
      usuario: resultadoPerfil.value,
      // Sin permisos se cae a "ninguno": la interfaz oculta las opciones en vez
      // de mostrar acciones que el backend rechazaría igual.
      permisos:
        resultadoPermisos.status === "fulfilled"
          ? resultadoPermisos.value.permisos
          : matrizVacia(),
    };
  }, []);

  const refrescar = useCallback(async () => {
    const sesion = await cargarSesion();
    setUsuario(sesion.usuario);
    setPermisos(sesion.permisos);
  }, [cargarSesion]);

  useEffect(() => {
    if (!necesitaSesion) {
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);

    (async () => {
      const sesion = await cargarSesion();
      if (!activo) return;
      setUsuario(sesion.usuario);
      setPermisos(sesion.permisos);
      setCargando(false);
    })();

    return () => {
      activo = false;
    };
  }, [necesitaSesion, cargarSesion]);

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
