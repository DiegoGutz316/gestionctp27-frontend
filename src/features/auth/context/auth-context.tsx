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
} from "../servicios/auth.service";
import type { LoginDatos, UsuarioSesion } from "../models/auth.model";

type AuthContextValue = {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  login: (datos: LoginDatos) => Promise<UsuarioSesion>;
  logout: () => Promise<void>;
  refrescar: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const perfil = await obtenerPerfil();
      setUsuario(perfil);
    } catch {
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        const perfil = await obtenerPerfil();
        if (activo) setUsuario(perfil);
      } catch {
        if (activo) setUsuario(null);
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
    return respuesta.usuario;
  }, []);

  const logout = useCallback(async () => {
    try {
      await cerrarSesion();
    } finally {
      setUsuario(null);
    }
  }, []);

  const value = useMemo(
    () => ({ usuario, cargando, login, logout, refrescar }),
    [usuario, cargando, login, logout, refrescar],
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
