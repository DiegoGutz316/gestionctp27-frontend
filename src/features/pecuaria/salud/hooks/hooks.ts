"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  consultarSalud,
  registrarSalud,
} from "../servicios/salud.service";

export const saludQueryKey = ["pecuaria", "salud"] as const;

export function useHistorialSalud(animalId: number) {
  return useQuery({
    queryKey: [...saludQueryKey, animalId],
    queryFn: () => consultarSalud(animalId),
    enabled: animalId > 0,
  });
}

export function useRegistrarSalud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarSalud,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: saludQueryKey,
      }),
  });
}
