"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  consultarAvisos,
  consultarAvisosPublicos,
  desactivarAviso,
  editarAviso,
  obtenerAviso,
  registrarAviso,
} from "../servicios/aviso.service";
import type {
  CategoriaAviso,
  ConsultarAvisos,
  RegistrarAviso,
} from "../validacion/aviso.validacion";

export const avisosQueryKey = ["comunicacion", "avisos"] as const;

/**
 * Sin `placeholderData`: al cambiar de página conservar el resultado anterior
 * mostraría avisos que no corresponden a lo consultado.
 */
export function useAvisos(
  filtros: ConsultarAvisos = {},
  opciones?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...avisosQueryKey, filtros],
    queryFn: () => consultarAvisos(filtros),
    enabled: opciones?.enabled ?? true,
  });
}

/** Mismo tope que ya usaba la landing sobre el endpoint público. */
const AVISOS_PUBLICOS_LIMITE = 12;

export function useAvisosPublicos(categoria?: CategoriaAviso) {
  return useQuery({
    queryKey: [...avisosQueryKey, "publicos", categoria ?? "TODOS"],
    queryFn: () => consultarAvisosPublicos(AVISOS_PUBLICOS_LIMITE, categoria),
  });
}

export function useRegistrarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarAviso,

    // Deja lista la consulta del 5.6: al publicar, el listado queda obsoleto.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}

export function useAviso(id: number) {
  return useQuery({
    queryKey: [...avisosQueryKey, "detalle", id],
    queryFn: () => obtenerAviso(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useEditarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: RegistrarAviso }) =>
      editarAviso(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}

export function useDesactivarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desactivarAviso,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}
