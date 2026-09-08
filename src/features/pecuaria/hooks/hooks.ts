"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { crearAnimal } from "../servicios/animal.service";

export const animalesQueryKey = [
  "pecuaria",
  "animales",
] as const;

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