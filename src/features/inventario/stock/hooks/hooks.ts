"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reintentarConsulta } from "@/lib/api";
import { productosQueryKey } from "../../producto/hooks/hooks";
import type {
  CrearEntrada,
  CrearSalida,
  EditarConfiguracionStock,
  FiltrarMovimientos,
} from "../validacion/stock.validacion";
import {
  crearConfiguracionStock,
  editarConfiguracionStock,
  listarMovimientos,
  obtenerConfiguracionStock,
  obtenerExistencias,
  registrarEntrada,
  registrarSalida,
} from "../servicios/stock.service";

export const configuracionStockQueryKey = [
  "inventario",
  "configuracion-stock",
] as const;
export const existenciasQueryKey = ["inventario", "existencias"] as const;

export function useConfiguracionStock(configuracionId: number) {
  return useQuery({
    queryKey: [...configuracionStockQueryKey, configuracionId],
    queryFn: () => obtenerConfiguracionStock(configuracionId),
    enabled: Number.isInteger(configuracionId) && configuracionId > 0,
  });
}

export function useExistencias(inventarioId: number) {
  return useQuery({
    queryKey: [...existenciasQueryKey, inventarioId],
    queryFn: () => obtenerExistencias(inventarioId),
    enabled: Number.isInteger(inventarioId) && inventarioId > 0,
  });
}

export function useCrearConfiguracionStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearConfiguracionStock,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productosQueryKey }),
  });
}

export function useEditarConfiguracionStock(configuracionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarConfiguracionStock) =>
      editarConfiguracionStock(configuracionId, datos),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productosQueryKey }),
        queryClient.invalidateQueries({
          queryKey: [...configuracionStockQueryKey, configuracionId],
        }),
      ]);
    },
  });
}

export const movimientosQueryKey = [
  "inventario",
  "existencias",
  "movimientos",
] as const;

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
 * productos como en la consulta de existencias, además del historial. Las
 * invalidaciones conservan separada la configuración de stock.
 */
export function useRegistrarEntrada(inventarioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      datos,
      idempotencyKey,
    }: {
      datos: CrearEntrada;
      idempotencyKey: string;
    }) => registrarEntrada(inventarioId, datos, idempotencyKey),
    retry: reintentarConsulta,
    onSuccess: () => invalidarExistencias(queryClient, inventarioId),
  });
}

export function useRegistrarSalida(inventarioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      datos,
      idempotencyKey,
    }: {
      datos: CrearSalida;
      idempotencyKey: string;
    }) => registrarSalida(inventarioId, datos, idempotencyKey),
    retry: reintentarConsulta,
    onSuccess: () => invalidarExistencias(queryClient, inventarioId),
  });
}

function invalidarExistencias(
  queryClient: ReturnType<typeof useQueryClient>,
  inventarioId: number,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: productosQueryKey }),
    queryClient.invalidateQueries({
      queryKey: [...existenciasQueryKey, inventarioId],
    }),
    queryClient.invalidateQueries({ queryKey: movimientosQueryKey }),
  ]);
}
