"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FiltrarInsumos } from "@/schemas";
import {
  crearCategoria,
  crearInsumo,
  obtenerCategorias,
  obtenerInsumos,
} from "./api";

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

// Clave base: invalidarla (sin filtros) refresca también cualquier variante
// filtrada ya cacheada, por el matching parcial de TanStack Query.
export const insumosQueryKey = ["inventario", "insumos"] as const;

export function useInsumos(filtros: FiltrarInsumos = {}) {
  return useQuery({
    queryKey: [...insumosQueryKey, filtros],
    queryFn: () => obtenerInsumos(filtros),
  });
}

export function useCrearInsumo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearInsumo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: insumosQueryKey }),
  });
}
