"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EditarProducto,
  FiltrarProductos,
} from "../validacion/producto.validacion";
import {
  crearProducto,
  editarProducto,
  listarProductos,
  listarTodosLosProductos,
  obtenerProducto,
} from "../servicios/producto.service";

export const productosQueryKey = ["inventario", "productos"] as const;

export function useProductos(
  filtros: FiltrarProductos = {},
  opciones: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...productosQueryKey, filtros],
    queryFn: () => listarProductos(filtros),
    enabled: opciones.enabled ?? true,
  });
}

/**
 * Para selectores que necesitan el catálogo completo, no una página.
 *
 * Clave de caché propia: lo que devuelve es una lista, no una página con su
 * meta, y mezclarlas haría que una invalide a la otra.
 */
export function useTodosLosProductos(
  filtros: Omit<FiltrarProductos, "pagina" | "limite"> = {},
) {
  return useQuery({
    queryKey: [...productosQueryKey, "todos", filtros],
    queryFn: () => listarTodosLosProductos(filtros),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: [...productosQueryKey, id],
    queryFn: () => obtenerProducto(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productosQueryKey }),
  });
}

export function useEditarProducto(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarProducto) => editarProducto(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productosQueryKey }),
  });
}
