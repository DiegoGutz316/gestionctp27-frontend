"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CrearEntrada,
  CrearSalida,
  EditarInventario,
  FiltrarMovimientos,
} from "../validacion/stock.validacion";
import {
  crearStock,
  editarStock,
  listarMovimientos,
  obtenerStock,
  registrarEntrada,
  registrarSalida,
} from "../servicios/stock.service";

export const stockQueryKey = ["inventario", "stock"] as const;

export function useStockItem(id: number) {
  return useQuery({
    queryKey: [...stockQueryKey, id],
    queryFn: () => obtenerStock(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCrearStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearStock,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}

export function useEditarStock(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarInventario) => editarStock(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}

export const movimientosQueryKey = ["inventario", "movimientos"] as const;

export function useMovimientos(filtros: FiltrarMovimientos = {}) {
  return useQuery({
    queryKey: [...movimientosQueryKey, filtros],
    queryFn: () => listarMovimientos(filtros),
    // Al cambiar de página o filtro se conservan los datos previos, para que
    // la tabla no parpadee entre consultas.
    placeholderData: (anterior) => anterior,
  });
}

/**
 * Una entrada/salida cambia la existencia incluida tanto en consultas de
 * productos como de stock, además del historial. Se invalida el prefijo del
 * módulo y se devuelve la promesa para que `mutateAsync` espere el refetch.
 */
export function useRegistrarEntrada(inventarioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearEntrada) =>
      registrarEntrada(inventarioId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}

export function useRegistrarSalida(inventarioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearSalida) => registrarSalida(inventarioId, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inventario"] }),
  });
}
