"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EditarPeriodo,
  FiltrarPeriodos,
  PieInformeRespuesta,
  SolicitarFondo,
} from "../validacion/periodo.validacion";
import type { CrearAsiento } from "../validacion/asiento.validacion";
import {
  abrirPeriodo,
  cerrarPeriodo,
  editarPeriodo,
  guardarPieInforme,
  listarPeriodos,
  obtenerPeriodo,
  solicitarFondo,
} from "../servicios/periodo.service";
import {
  actualizarAsiento,
  crearAsiento,
  eliminarAsiento,
  listarAsientos,
  reintentarConsulta,
} from "../servicios/asiento.service";

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
    mutationFn: ({
      datos,
      idempotencyKey,
    }: {
      datos: CrearAsiento;
      idempotencyKey: string;
    }) => crearAsiento(periodoId, fondoId, datos, idempotencyKey),
    retry: reintentarConsulta,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: asientosQueryKey(periodoId, fondoId),
      }),
  });
}

export function useActualizarAsiento(periodoId: number, fondoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      asientoId,
      datos,
    }: {
      asientoId: number;
      datos: CrearAsiento;
    }) => actualizarAsiento(periodoId, fondoId, asientoId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: asientosQueryKey(periodoId, fondoId),
      }),
  });
}

export function useEliminarAsiento(periodoId: number, fondoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (asientoId: number) =>
      eliminarAsiento(periodoId, fondoId, asientoId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: asientosQueryKey(periodoId, fondoId),
      }),
  });
}

export function useGuardarPieInforme(periodoId: number, fondoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: PieInformeRespuesta) =>
      guardarPieInforme(periodoId, fondoId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: asientosQueryKey(periodoId, fondoId),
      }),
  });
}
