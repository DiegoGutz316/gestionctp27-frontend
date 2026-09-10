"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { crearDesparasitacion } from "../servicios/desparasitacion.service";

export const desparasitacionesQueryKey = [
  "pecuaria",
  "desparasitaciones",
] as const;

export function useCrearDesparasitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearDesparasitacion,

    // La clave ya queda invalidada para cuando el backlog 2.8 agregue el
    // listado por animal.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: desparasitacionesQueryKey,
      }),
  });
}
