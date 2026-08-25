"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ActualizarColegio } from "../validacion/colegio.validacion";
import {
  actualizarColegio,
  obtenerColegio,
} from "../servicios/colegio.service";

export const colegioQueryKey = ["libro-caja", "colegio"] as const;

export function useColegio(opciones: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: colegioQueryKey,
    queryFn: obtenerColegio,
    enabled: opciones.enabled ?? true,
  });
}

export function useActualizarColegio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: ActualizarColegio) => actualizarColegio(datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: colegioQueryKey }),
  });
}
