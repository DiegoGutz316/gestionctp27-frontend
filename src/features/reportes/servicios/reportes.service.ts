import { api } from "@/lib/api";

import type {
  FiltrosReporteInventario,
  FiltrosReporteProduccionAgricola,
  FiltrosReporteProduccionPecuaria,
  ReporteInventarioRespuesta,
  ReporteProduccionAgricolaRespuesta,
  ReporteProduccionPecuariaRespuesta,
} from "../validacion/reportes.validacion";

export function consultarReporteProduccionPecuaria(
  filtros: FiltrosReporteProduccionPecuaria,
) {
  return api.get<ReporteProduccionPecuariaRespuesta>(
    "/reportes/produccion-pecuaria",
    {
      animalId: filtros.animalId,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    },
  );
}

export function consultarReporteProduccionAgricola(
  filtros: FiltrosReporteProduccionAgricola,
) {
  return api.get<ReporteProduccionAgricolaRespuesta>(
    "/reportes/produccion-agricola",
    {
      cultivo: filtros.cultivo,
      camaId: filtros.camaId,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    },
  );
}

export function consultarReporteInventario(
  filtros: FiltrosReporteInventario,
) {
  return api.get<ReporteInventarioRespuesta>(
    "/reportes/inventario",
    {
      productoId: filtros.productoId,
      tipoProducto: filtros.tipoProducto,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    },
  );
}

export { getMensajeDeError } from "@/lib/api";
