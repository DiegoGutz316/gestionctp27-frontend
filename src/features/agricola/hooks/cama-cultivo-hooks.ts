"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  crearCamaCultivo,
  editarCamaCultivo,
  listarCamasCultivo,
  obtenerCamaCultivo,
} from "../servicios/cama-cultivo.service";

import type {
  CrearCamaCultivo,
  FiltrarCamasCultivo,
} from "../validacion/cama-cultivo.validacion";

export const camasCultivoQueryKey = ["agricola", "camas"] as const;

export function useCamasCultivo(
  filtros: FiltrarCamasCultivo = {},
) {
  return useQuery({
    queryKey: [...camasCultivoQueryKey, filtros],
    queryFn: () => listarCamasCultivo(filtros),
    // Al cambiar de filtro se conservan los datos previos, para que la tabla
    // no parpadee entre consultas.
    placeholderData: (anterior) => anterior,
  });
}

export function useCamaCultivo(id: number) {
  return useQuery({
    queryKey: [...camasCultivoQueryKey, id],
    queryFn: () => obtenerCamaCultivo(id),
    enabled: id > 0,
  });
}

export function useCrearCamaCultivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearCamaCultivo,

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: camasCultivoQueryKey,
      }),
  });
}

export function useEditarCamaCultivo(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearCamaCultivo) =>
      editarCamaCultivo(id, datos),

    onSuccess: (cama) => {
      queryClient.setQueryData(
        [...camasCultivoQueryKey, id],
        cama,
      );

      return queryClient.invalidateQueries({
        queryKey: camasCultivoQueryKey,
      });
    },
  });
}
