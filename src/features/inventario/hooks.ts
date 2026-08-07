"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EditarInsumo, FiltrarInsumos } from "./models/inventario.model";
import {
  crearCategoria,
  crearInsumo,
  editarInsumo,
  obtenerCategorias,
  obtenerInsumo,
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

export function useInsumo(id: number) {
  return useQuery({
    queryKey: [...insumosQueryKey, id],
    queryFn: () => obtenerInsumo(id),
  });
}

export function useEditarInsumo(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarInsumo) => editarInsumo(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: insumosQueryKey }),
  });
}
