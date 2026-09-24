"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { camasCultivoQueryKey } from "@/features/agricola/hooks/cama-cultivo-hooks";
import { siembrasQueryKey } from "@/features/agricola/siembra/hooks/siembra-hooks";

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
export function useCosechas(
  filtros: ConsultarCosechas = {},
  opciones: { habilitada?: boolean } = {},
) {
  return useQuery({
    queryKey: [...cosechasQueryKey, filtros],
    queryFn: () => consultarCosechas(filtros),

    // Con un rango de fechas al revés no hay nada que consultar: el backend
    // responderia 400 y la pantalla mostraria un error de servidor en vez de
    // decir lo que pasa, que es que los dos extremos estan invertidos.
    enabled: opciones.habilitada ?? true,
  });
}

export function useRegistrarCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarCosecha,

    // Actualiza cualquier consulta del historial tras registrar una cosecha.
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cosechasQueryKey });
      await queryClient.invalidateQueries({ queryKey: siembrasQueryKey });
      await queryClient.invalidateQueries({ queryKey: camasCultivoQueryKey });
    },
  });
}
