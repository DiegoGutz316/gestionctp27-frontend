import { api, ApiError } from "@/lib/api";
import type {
  CategoriaInsumoRespuesta,
  CrearCategoriaInsumo,
  CrearInsumo,
  EditarInsumo,
  FiltrarInsumos,
  InsumoRespuesta,
} from "@/schemas";

export function obtenerCategorias() {
  return api.get<CategoriaInsumoRespuesta[]>("/inventario/categorias");
}

export function crearCategoria(datos: CrearCategoriaInsumo) {
  return api.post<CategoriaInsumoRespuesta>("/inventario/categorias", datos);
}

export function obtenerInsumos(filtros: FiltrarInsumos = {}) {
  return api.get<InsumoRespuesta[]>("/inventario/insumos", {
    params: {
      nombre: filtros.nombre || undefined,
      categoriaId: filtros.categoriaId || undefined,
    },
  });
}

export function crearInsumo(datos: CrearInsumo) {
  return api.post<InsumoRespuesta>("/inventario/insumos", datos);
}

export function obtenerInsumo(id: number) {
  return api.get<InsumoRespuesta>(`/inventario/insumos/${id}`);
}

export function editarInsumo(id: number, datos: EditarInsumo) {
  return api.patch<InsumoRespuesta>(`/inventario/insumos/${id}`, datos);
}

/**
 * Extrae un mensaje legible de los errores de la API.
 *
 * ApiError.data es el body que devolvió NestJS:
 * - 400 de nestjs-zod: {statusCode, message: "Validation failed", errors: [{path, message}]}
 * - 404/409 de Nest:   {statusCode, message, error}
 */
export function getMensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    const body = (typeof error.data === "object" && error.data !== null
      ? error.data
      : null) as {
      message?: string;
      errors?: Array<{ message?: string }>;
    } | null;

    if (body) {
      if (Array.isArray(body.errors) && body.errors[0]?.message) {
        return body.errors[0].message;
      }
      if (
        typeof body.message === "string" &&
        body.message !== "Validation failed"
      ) {
        return body.message;
      }
    }

    if (error.status === 0) {
      return error.message || "Error de conexión con el servidor.";
    }

    return "No se pudo completar la operación. Intente de nuevo.";
  }
  return "Error de conexión con el servidor.";
}
