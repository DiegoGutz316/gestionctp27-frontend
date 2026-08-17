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
  obtenerProducto,
} from "../servicios/producto.service";

export const productosQueryKey = ["inventario", "productos"] as const;

export function useProductos(filtros: FiltrarProductos = {}) {
  return useQuery({
    queryKey: [...productosQueryKey, filtros],
    queryFn: () => listarProductos(filtros),
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
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}

export function useEditarProducto(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarProducto) => editarProducto(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}
