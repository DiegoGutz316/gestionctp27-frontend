"use client";

import { useQuery } from "@tanstack/react-query";

import {
  consultarReporteProduccionAgricola,
  consultarReporteProduccionPecuaria,
} from "../servicios/reportes.service";

import type {
  FiltrosReporteProduccionAgricola,
  FiltrosReporteProduccionPecuaria,
} from "../validacion/reportes.validacion";

export const reportesQueryKey = ["reportes"] as const;

/**
 * Backlog 5.1. `habilitada` es falsa hasta que el usuario presiona «Generar
 * reporte»; los filtros que llegan aquí ya pasaron la validación del formulario.
 * Sin `placeholderData`: al cambiar de filtros no debe verse el reporte anterior
 * como si fuera el nuevo.
 */
export function useReporteProduccionPecuaria(
  filtros: FiltrosReporteProduccionPecuaria,
  habilitada: boolean,
) {
  return useQuery({
    queryKey: [...reportesQueryKey, "produccion-pecuaria", filtros],
    queryFn: () => consultarReporteProduccionPecuaria(filtros),
    enabled: habilitada && filtros.animalId > 0,
  });
}

/** Backlog 5.2. Mismo criterio que `useReporteProduccionPecuaria`. */
export function useReporteProduccionAgricola(
  filtros: FiltrosReporteProduccionAgricola,
  habilitada: boolean,
) {
  return useQuery({
    queryKey: [...reportesQueryKey, "produccion-agricola", filtros],
    queryFn: () => consultarReporteProduccionAgricola(filtros),
    enabled:
      habilitada && filtros.fechaInicio !== "" && filtros.fechaFin !== "",
  });
}
