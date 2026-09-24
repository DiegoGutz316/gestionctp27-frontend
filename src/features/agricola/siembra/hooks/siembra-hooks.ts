"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { camasCultivoQueryKey } from "@/features/agricola/hooks/cama-cultivo-hooks";

import type { ConsultarSiembras } from "../models/siembra.model";
import {
  consultarSiembras,
  finalizarSiembra,
  registrarSiembra,
} from "../servicios/siembra.service";

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: siembrasQueryKey });
      await queryClient.invalidateQueries({ queryKey: camasCultivoQueryKey });
    },
  });
}

export function useFinalizarSiembra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizarSiembra,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: siembrasQueryKey });
      await queryClient.invalidateQueries({ queryKey: camasCultivoQueryKey });
    },
  });
}
