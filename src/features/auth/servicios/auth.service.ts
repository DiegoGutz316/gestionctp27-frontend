import { api, getMensajeDeError } from "@/lib/api";
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
  return getMensajeDeError(error, {
    401: "El correo o la contraseña no son correctos.",
    403: "Esta cuenta está desactivada. Comuníquese con el administrador.",
  });
}
