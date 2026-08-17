import { api, ApiError } from "@/lib/api";
import type {
  CrearProducto,
  EditarProducto,
  FiltrarProductos,
  ProductoRespuesta,
} from "../validacion/producto.validacion";

export function listarProductos(filtros: FiltrarProductos = {}) {
  return api.get<ProductoRespuesta[]>("/inventario/productos", {
    nombre: filtros.nombre,
    tipoProducto: filtros.tipoProducto,
    departamento: filtros.departamento,
    ubicacion: filtros.ubicacion,
  });
}

export function crearProducto(datos: CrearProducto) {
  return api.post<ProductoRespuesta>("/inventario/productos", datos);
}

export function obtenerProducto(id: number) {
  return api.get<ProductoRespuesta>(`/inventario/productos/${id}`);
}

export function editarProducto(id: number, datos: EditarProducto) {
  return api.patch<ProductoRespuesta>(`/inventario/productos/${id}`, datos);
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
