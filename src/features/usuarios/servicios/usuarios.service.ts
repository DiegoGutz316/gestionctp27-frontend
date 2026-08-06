import { api, ApiError } from "@/lib/api";
import type {
  CrearUsuario,
  EditarUsuario,
  FiltrarUsuarios,
  UsuarioRespuesta,
} from "../models/usuario.model";

export function listarUsuarios(filtros: FiltrarUsuarios = {}) {
  return api.get<UsuarioRespuesta[]>("/usuarios", {
    busqueda: filtros.busqueda,
    rol: filtros.rol,
    activo: filtros.activo,
  });
}

export function crearUsuario(datos: CrearUsuario) {
  return api.post<UsuarioRespuesta>("/usuarios", datos);
}

export function obtenerUsuario(id: string) {
  return api.get<UsuarioRespuesta>(`/usuarios/${id}`);
}

export function editarUsuario(id: string, datos: EditarUsuario) {
  return api.patch<UsuarioRespuesta>(`/usuarios/${id}`, datos);
}

/**
 * Extrae un mensaje legible de los errores de la API.
 *
 * ApiError.message contiene el body de texto que devolvió NestJS:
 * - 400 de class-validator: {statusCode, message: string[] | string, error}
 * - 404/409 de Nest:   {statusCode, message, error}
 */
export function getMensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as {
        message?: string | string[];
        errors?: Array<{ message?: string }>;
      };
      if (Array.isArray(body.errors) && body.errors[0]?.message) {
        return body.errors[0].message;
      }
      if (Array.isArray(body.message) && body.message[0]) {
        return body.message[0];
      }
      if (
        typeof body.message === "string" &&
        body.message !== "Validation failed"
      ) {
        return body.message;
      }
    } catch {
      // El body no era JSON; se usa el mensaje genérico.
    }
    return "No se pudo completar la operación. Intente de nuevo.";
  }
  return "Error de conexión con el servidor.";
}
