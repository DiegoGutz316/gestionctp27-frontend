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
import { ApiError } from "@/lib/api";
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

/**
 * Por qué no hay usuario.
 *
 * `sin-sesion` es un 401: la cookie no vale y hay que volver a entrar.
 * `sin-servidor` es cualquier otra cosa —el backend caído, un 500, un corte de
 * red—, donde la sesión puede estar perfecta y mandar al login no arregla nada.
 */
export type MotivoSinUsuario = "sin-sesion" | "sin-servidor";

type AuthContextValue = {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  /** Solo tiene valor cuando no hay usuario. */
  motivoSinUsuario: MotivoSinUsuario | null;
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
  const [motivoSinUsuario, setMotivoSinUsuario] =
    useState<MotivoSinUsuario | null>(null);

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
      const fallo: unknown = resultadoPerfil.reason;
      // Solo un 401 significa "no hay sesión". Un backend caído o un 500
      // llegan igual acá, y decirle al usuario que su sesión expiró lo manda a
      // un login que tampoco va a funcionar.
      const motivo: MotivoSinUsuario =
        fallo instanceof ApiError && fallo.status === 401
          ? "sin-sesion"
          : "sin-servidor";

      return { usuario: null, permisos: matrizVacia(), motivo };
    }

    return {
      motivo: null,
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
    setCargando(true);
    const sesion = await cargarSesion();
    setUsuario(sesion.usuario);
    setPermisos(sesion.permisos);
    setMotivoSinUsuario(sesion.motivo);
    setCargando(false);
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
      setMotivoSinUsuario(sesion.motivo);
      setCargando(false);
    })();

    return () => {
      activo = false;
    };
  }, [necesitaSesion, cargarSesion]);

  const login = useCallback(async (datos: LoginDatos) => {
    const respuesta = await iniciarSesion(datos);
    setUsuario(respuesta.usuario);
    setMotivoSinUsuario(null);

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
      setMotivoSinUsuario("sin-sesion");
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
      motivoSinUsuario,
      permisos,
      puede,
      login,
      logout,
      refrescar,
    }),
    [
      usuario,
      cargando,
      motivoSinUsuario,
      permisos,
      puede,
      login,
      logout,
      refrescar,
    ],
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
