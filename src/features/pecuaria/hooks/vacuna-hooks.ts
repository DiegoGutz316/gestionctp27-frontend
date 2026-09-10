"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  crearVacuna,
  listarVacunasDeAnimal,
} from "../servicios/vacuna.service";

// Las queries de vacunas cuelgan de este prefijo, así que la invalidación
// que hace el registro del backlog 2.5 también refresca el historial del 2.6.
export const vacunasQueryKey = ["pecuaria", "vacunas"] as const;

/**
 * Backlog 2.6. La clave cuelga de `vacunasQueryKey`, así que la invalidación
 * que hace el registro del backlog 2.5 también refresca este historial.
 */
export function useVacunasDeAnimal(animalId: number) {
  return useQuery({
    queryKey: [...vacunasQueryKey, "animal", animalId],
    queryFn: () => listarVacunasDeAnimal(animalId),
    enabled: animalId > 0,
  });
}

export function useCrearVacuna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearVacuna,

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: vacunasQueryKey,
      }),
  });
}
