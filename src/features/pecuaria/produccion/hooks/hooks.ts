"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  consultarProduccion,
  registrarProduccion,
} from "../servicios/produccion.service";

import type { ConsultarProduccion } from "../validacion/produccion.validacion";

export const produccionQueryKey = [
  "pecuaria",
  "produccion",
] as const;

export function useProduccion(filtros: ConsultarProduccion) {
  return useQuery({
    queryKey: [
      ...produccionQueryKey,
      filtros,
    ],
    queryFn: () => consultarProduccion(filtros),
    enabled: filtros.animalId > 0,
  });
}

export function useRegistrarProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarProduccion,

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: produccionQueryKey,
      }),
  });
}
