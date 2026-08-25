"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EditarPeriodo,
  FiltrarPeriodos,
  SolicitarFondo,
} from "../validacion/periodo.validacion";
import type { CrearAsiento } from "../validacion/asiento.validacion";
import {
  abrirPeriodo,
  cerrarPeriodo,
  editarPeriodo,
  listarPeriodos,
  obtenerPeriodo,
  solicitarFondo,
} from "../servicios/periodo.service";
import { crearAsiento, listarAsientos } from "../servicios/asiento.service";

export const periodosQueryKey = ["libro-caja", "periodos"] as const;

export function asientosQueryKey(periodoId: number, fondoId: number) {
  return [
    ...periodosQueryKey,
    periodoId,
    "fondos",
    fondoId,
    "asientos",
  ] as const;
}

export function usePeriodos(
  filtros: FiltrarPeriodos = {},
  opciones: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...periodosQueryKey, filtros],
    queryFn: () => listarPeriodos(filtros),
    enabled: opciones.enabled ?? true,
  });
}

export function usePeriodo(id: number) {
  return useQuery({
    queryKey: [...periodosQueryKey, id],
    queryFn: () => obtenerPeriodo(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useAbrirPeriodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: abrirPeriodo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodosQueryKey }),
  });
}

export function useEditarPeriodo(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarPeriodo) => editarPeriodo(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodosQueryKey }),
  });
}

export function useCerrarPeriodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cerrarPeriodo(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodosQueryKey }),
  });
}

export function useSolicitarFondo(periodoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fondoId,
      datos,
    }: {
      fondoId: number;
      datos: SolicitarFondo;
    }) => solicitarFondo(periodoId, fondoId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodosQueryKey }),
  });
}

export function useAsientos(periodoId: number, fondoId: number) {
  return useQuery({
    queryKey: asientosQueryKey(periodoId, fondoId),
    queryFn: () => listarAsientos(periodoId, fondoId),
    enabled:
      Number.isInteger(periodoId) &&
      periodoId > 0 &&
      Number.isInteger(fondoId) &&
      fondoId > 0,
  });
}

export function useCrearAsiento(periodoId: number, fondoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearAsiento) =>
      crearAsiento(periodoId, fondoId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: asientosQueryKey(periodoId, fondoId),
      }),
  });
}
