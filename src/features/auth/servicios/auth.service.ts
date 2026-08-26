import { ApiError, api, getMensajeDeError } from "@/lib/api";
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

/**
 * Segundos que faltan para poder reintentar cuando el backend bloqueó el correo
 * por intentos fallidos, o `null` si el error es cualquier otro.
 *
 * El dato se lee del campo `segundosRestantes` de la respuesta y no del texto
 * del mensaje: interpretar la frase se rompería al reescribirla o traducirla.
 *
 * Solo sirve para la cuenta regresiva de la interfaz. El bloqueo real lo impone
 * el backend, que rechaza la petición aunque aquí no se muestre nada.
 */
export function segundosDeBloqueo(error: unknown): number | null {
  if (!(error instanceof ApiError) || error.status !== 429) return null;

  try {
    const cuerpo = JSON.parse(error.message) as { segundosRestantes?: unknown };
    const segundos = Number(cuerpo.segundosRestantes);
    return Number.isFinite(segundos) && segundos > 0 ? Math.ceil(segundos) : null;
  } catch {
    // Un 429 sin cuerpo interpretable es el del límite por IP del backend
    // (ThrottlerGuard), que no informa cuánto falta.
    return null;
  }
}
