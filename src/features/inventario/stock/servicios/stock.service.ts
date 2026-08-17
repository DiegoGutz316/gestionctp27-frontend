import { api, ApiError } from "@/lib/api";
import type {
  CrearEntrada,
  CrearInventario,
  CrearSalida,
  EditarInventario,
  FiltrarMovimientos,
  MovimientoCreadoRespuesta,
  ResultadoPaginadoMovimientos,
  StockRespuesta,
} from "../validacion/stock.validacion";

export function crearStock(datos: CrearInventario) {
  return api.post<StockRespuesta>("/inventario/stock", datos);
}

export function obtenerStock(id: number) {
  return api.get<StockRespuesta>(`/inventario/stock/${id}`);
}

export function editarStock(id: number, datos: EditarInventario) {
  return api.patch<StockRespuesta>(`/inventario/stock/${id}`, datos);
}

export function registrarEntrada(inventarioId: number, datos: CrearEntrada) {
  return api.post<MovimientoCreadoRespuesta>(
    `/inventario/stock/${inventarioId}/entradas`,
    datos,
  );
}

export function registrarSalida(inventarioId: number, datos: CrearSalida) {
  return api.post<MovimientoCreadoRespuesta>(
    `/inventario/stock/${inventarioId}/salidas`,
    datos,
  );
}

export function listarMovimientos(filtros: FiltrarMovimientos = {}) {
  return api.get<ResultadoPaginadoMovimientos>("/inventario/stock/movimientos", {
    pagina: filtros.pagina,
    limite: filtros.limite,
    inventarioId: filtros.inventarioId,
    desde: filtros.desde,
    hasta: filtros.hasta,
  });
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
