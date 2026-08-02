"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearCategoria, crearInsumo, obtenerCategorias } from "./api";

export const categoriasQueryKey = ["inventario", "categorias"] as const;

export function useCategorias() {
  return useQuery({
    queryKey: categoriasQueryKey,
    queryFn: obtenerCategorias,
  });
}

export function useCrearCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearCategoria,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoriasQueryKey }),
  });
}

export function useCrearInsumo() {
  return useMutation({ mutationFn: crearInsumo });
}
