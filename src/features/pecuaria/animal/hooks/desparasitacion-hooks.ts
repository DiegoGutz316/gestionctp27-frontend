"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  crearDesparasitacion,
  listarDesparasitacionesDeAnimal,
} from "../servicios/desparasitacion.service";

export const desparasitacionesQueryKey = [
  "pecuaria",
  "desparasitaciones",
] as const;

/**
 * Backlog 2.8. La clave cuelga de `desparasitacionesQueryKey`, así que la
 * invalidación que hace el registro del backlog 2.7 también refresca este
 * historial.
 */
export function useDesparasitacionesDeAnimal(animalId: number) {
  return useQuery({
    queryKey: [...desparasitacionesQueryKey, "animal", animalId],
    queryFn: () => listarDesparasitacionesDeAnimal(animalId),
    enabled: animalId > 0,
  });
}

export function useCrearDesparasitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearDesparasitacion,

    // Todas las consultas de desparasitaciones cuelgan de este prefijo, así
    // que un registro nuevo refresca cualquier historial abierto.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: desparasitacionesQueryKey,
      }),
  });
}
