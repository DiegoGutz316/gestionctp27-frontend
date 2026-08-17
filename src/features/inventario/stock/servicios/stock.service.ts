import { api } from "@/lib/api";
import type {
  ConfiguracionStockRespuesta,
  CrearEntrada,
  CrearConfiguracionStock,
  CrearSalida,
  EditarConfiguracionStock,
  FiltrarMovimientos,
  MovimientoCreadoRespuesta,
  ResultadoPaginadoMovimientos,
  InventarioRespuesta,
} from "../validacion/stock.validacion";

export function crearConfiguracionStock(datos: CrearConfiguracionStock) {
  return api.post<ConfiguracionStockRespuesta>(
    "/inventario/configuracion-stock",
    datos,
  );
}

export function obtenerConfiguracionStock(configuracionId: number) {
  return api.get<ConfiguracionStockRespuesta>(
    `/inventario/configuracion-stock/${configuracionId}`,
  );
}

export function editarConfiguracionStock(
  configuracionId: number,
  datos: EditarConfiguracionStock,
) {
  return api.patch<ConfiguracionStockRespuesta>(
    `/inventario/configuracion-stock/${configuracionId}`,
    datos,
  );
}

export function obtenerExistencias(inventarioId: number) {
  return api.get<InventarioRespuesta>(
    `/inventario/existencias/${inventarioId}`,
  );
}

export function registrarEntrada(
  inventarioId: number,
  datos: CrearEntrada,
  idempotencyKey: string,
) {
  return api.post<MovimientoCreadoRespuesta>(
    `/inventario/existencias/${inventarioId}/entradas`,
    datos,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
}

export function registrarSalida(
  inventarioId: number,
  datos: CrearSalida,
  idempotencyKey: string,
) {
  return api.post<MovimientoCreadoRespuesta>(
    `/inventario/existencias/${inventarioId}/salidas`,
    datos,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
}

export function listarMovimientos(filtros: FiltrarMovimientos = {}) {
  return api.get<ResultadoPaginadoMovimientos>(
    "/inventario/existencias/movimientos",
    {
      pagina: filtros.pagina,
      limite: filtros.limite,
      inventarioId: filtros.inventarioId,
      desde: filtros.desde,
      hasta: filtros.hasta,
    },
  );
}

export { getMensajeDeError } from "@/lib/api";
