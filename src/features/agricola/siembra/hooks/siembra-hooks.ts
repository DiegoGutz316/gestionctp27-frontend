"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ConsultarSiembras } from "../models/siembra.model";
import { consultarSiembras, registrarSiembra } from "../servicios/siembra.service";

export const siembrasQueryKey = ["agricola", "siembras"] as const;

export function useSiembras(filtros: ConsultarSiembras = {}) {
  return useQuery({
    queryKey: [...siembrasQueryKey, filtros],
    queryFn: () => consultarSiembras(filtros),
    placeholderData: (anterior) => anterior,
  });
}

export function useRegistrarSiembra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarSiembra,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: siembrasQueryKey }),
  });
}
