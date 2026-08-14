"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ConsultarEntradas,
  EditarInsumo,
  FiltrarInsumos,
} from "./models/inventario.model";
import {
  crearCategoria,
  crearInsumo,
  editarInsumo,
  obtenerCategorias,
  obtenerEntradas,
  obtenerInsumo,
  obtenerInsumos,
  registrarEntrada,
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

/**
 * Backlog 4.4. Al invalidar la clave base de insumos se cumple además el
 * criterio pendiente del backlog 4.2: "la información se actualiza después de
 * registrar entradas o salidas".
 */
// Clave base del historial de entradas (backlog 4.5).
export const entradasQueryKey = ["inventario", "entradas"] as const;

export function useRegistrarEntrada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrarEntrada,
    onSuccess: () => {
      // Cambian tanto las existencias como el historial.
      void queryClient.invalidateQueries({ queryKey: insumosQueryKey });
      void queryClient.invalidateQueries({ queryKey: entradasQueryKey });
    },
  });
}

export function useEntradas(filtros: ConsultarEntradas = {}) {
  return useQuery({
    queryKey: [...entradasQueryKey, filtros],
    queryFn: () => obtenerEntradas(filtros),
    // Al cambiar de página o filtro se conservan los datos previos, para que la
    // tabla no parpadee entre consultas.
    placeholderData: (anterior) => anterior,
  });
}
