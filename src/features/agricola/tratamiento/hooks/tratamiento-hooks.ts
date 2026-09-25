"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ConsultarTratamientos,
} from "../models/tratamiento.model";

import {
  consultarTratamientos,
  registrarTratamiento,
} from "../servicios/tratamiento.service";

export const tratamientosQueryKey = [
  "agricola",
  "tratamientos",
] as const;

export function useTratamientos(
  filtros: ConsultarTratamientos,
) {
  return useQuery({
    queryKey: [
      ...tratamientosQueryKey,
      filtros,
    ],

    queryFn: () =>
      consultarTratamientos(filtros),

    // Sin marcador de posicion a proposito: al cambiar de cama no deben
    // quedar visibles los tratamientos de la consulta anterior.
  });
}

export function useRegistrarTratamiento() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: registrarTratamiento,

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey:
          tratamientosQueryKey,
      }),
  });
}