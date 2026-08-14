import { api, ApiError } from "@/lib/api";
import type {
  LoginDatos,
  RespuestaLogin,
  UsuarioSesion,
} from "../models/auth.model";
import type { RespuestaPermisos } from "../models/permisos.model";

export function iniciarSesion(datos: LoginDatos) {
  return api.post<RespuestaLogin>("/auth/login", datos);
}

export function cerrarSesion() {
  return api.post<{ ok: boolean }>("/auth/logout");
}

export function obtenerPerfil() {
  return api.get<UsuarioSesion>("/auth/perfil");
}

/** Backlog 1.6: matriz de permisos del rol de la sesión actual. */
export function obtenerPermisos() {
  return api.get<RespuestaPermisos>("/auth/permisos");
}

export function getMensajeDeErrorAuth(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as {
        message?: string | string[];
      };
      if (Array.isArray(body.message) && body.message[0]) {
        return body.message[0];
      }
      if (typeof body.message === "string") {
        return body.message;
      }
    } catch {
      // El body no era JSON.
    }
    if (error.status === 401) {
      return "El correo o la contraseña no son correctos.";
    }
    if (error.status === 403) {
      return "Esta cuenta está desactivada. Comuníquese con el administrador.";
    }
    return "No se pudo iniciar sesión. Intente de nuevo.";
  }
  return "Error de conexión con el servidor.";
}
