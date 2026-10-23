"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  consultarCultivos,
  editarCultivo,
  eliminarCultivo,
  obtenerCultivo,
  registrarCultivo,
} from "../servicios/cultivo.service";
import type {
  ConsultarCultivos,
  EditarCultivo,
} from "../models/cultivo.model";

export const cultivosQueryKey = ["agricola", "cultivos"] as const;

export function useCultivos(filtros: ConsultarCultivos = {}) {
  return useQuery({
    queryKey: [...cultivosQueryKey, filtros],
    queryFn: () => consultarCultivos(filtros),
  });
}

export function useCultivo(id: number) {
  return useQuery({
    queryKey: [...cultivosQueryKey, "detalle", id],
    queryFn: () => obtenerCultivo(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useEditarCultivo(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: EditarCultivo) => editarCultivo(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cultivosQueryKey }),
  });
}

export function useEliminarCultivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarCultivo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cultivosQueryKey }),
  });
}

export function useRegistrarCultivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarCultivo,

    // El selector de siembras lee la misma clave: un cultivo nuevo debe
    // poder usarse sin recargar la página.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cultivosQueryKey }),
  });
}
