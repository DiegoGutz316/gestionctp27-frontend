import { api, ApiError } from "@/lib/api";
import type {
  CategoriaInsumoRespuesta,
  CrearCategoriaInsumo,
  CrearInsumo,
  InsumoRespuesta,
} from "@/schemas";

export function obtenerCategorias() {
  return api.get<CategoriaInsumoRespuesta[]>("/inventario/categorias");
}

export function crearCategoria(datos: CrearCategoriaInsumo) {
  return api.post<CategoriaInsumoRespuesta>("/inventario/categorias", datos);
}

export function crearInsumo(datos: CrearInsumo) {
  return api.post<InsumoRespuesta>("/inventario/insumos", datos);
}

/**
 * Extrae un mensaje legible de los errores de la API.
 *
 * ApiError.message contiene el body de texto que devolvió NestJS:
 * - 400 de nestjs-zod: {statusCode, message: "Validation failed", errors: [{path, message}]}
 * - 404/409 de Nest:   {statusCode, message, error}
 */
export function getMensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as {
        message?: string;
        errors?: Array<{ message?: string }>;
      };
      if (Array.isArray(body.errors) && body.errors[0]?.message) {
        return body.errors[0].message;
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
