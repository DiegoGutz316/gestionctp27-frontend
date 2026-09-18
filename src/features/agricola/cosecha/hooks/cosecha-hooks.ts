"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ConsultarCosechas } from "../models/cosecha.model";
import {
  consultarCosechas,
  registrarCosecha,
} from "../servicios/cosecha.service";

export const cosechasQueryKey = ["agricola", "cosechas"] as const;

/**
 * Backlog 3.7. Sin `placeholderData` a proposito: conservar el resultado
 * anterior haria que, al cambiar de filtro, se mostraran cosechas que no
 * corresponden a lo consultado. Mejor mostrar la carga.
 */
export function useCosechas(filtros: ConsultarCosechas = {}) {
  return useQuery({
    queryKey: [...cosechasQueryKey, filtros],
    queryFn: () => consultarCosechas(filtros),
  });
}

export function useRegistrarCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarCosecha,

    // La clave queda lista para el backlog 3.7, que agrega la consulta.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cosechasQueryKey }),
  });
}
