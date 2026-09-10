"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  crearAnimal,
  desactivarAnimal,
  editarAnimal,
  listarAnimales,
  obtenerAnimal,
} from "../servicios/animal.service";

import type {
  CrearAnimal,
  FiltrarAnimales,
} from "../validacion/animal.validacion";

export const animalesQueryKey = [
  "pecuaria",
  "animales",
] as const;

export function useAnimales(
  filtros: FiltrarAnimales = {},
) {
  return useQuery({
    queryKey: [...animalesQueryKey, filtros],
    queryFn: () => listarAnimales(filtros),
    // Al cambiar de filtro se conservan los datos previos, para que la tabla
    // no parpadee entre consultas.
    placeholderData: (anterior) => anterior,
  });
}

export function useAnimal(id: number) {
  return useQuery({
    queryKey: [
      ...animalesQueryKey,
      id,
    ],
    queryFn: () => obtenerAnimal(id),
    enabled: id > 0,
  });
}

export function useCrearAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearAnimal,

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: animalesQueryKey,
      }),
  });
}

export function useEditarAnimal(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearAnimal) =>
      editarAnimal(id, datos),

    onSuccess: (animal) => {
      queryClient.setQueryData(
        [
          ...animalesQueryKey,
          id,
        ],
        animal,
      );

      return queryClient.invalidateQueries({
        queryKey: animalesQueryKey,
      });
    },
  });
}
export function useDesactivarAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      desactivarAnimal(id),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: animalesQueryKey,
      }),
  });
}
