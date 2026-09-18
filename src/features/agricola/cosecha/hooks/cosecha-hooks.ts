"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registrarCosecha } from "../servicios/cosecha.service";

export const cosechasQueryKey = ["agricola", "cosechas"] as const;

export function useRegistrarCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarCosecha,

    // La clave queda lista para el backlog 3.7, que agrega la consulta.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cosechasQueryKey }),
  });
}
