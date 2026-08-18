"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ConsultarMovimientos,
  EditarInsumo,
  FiltrarInsumos,
} from "./models/inventario.model";
import {
  crearCategoria,
  crearInsumo,
  editarInsumo,
  obtenerCategorias,
  obtenerInsumo,
  obtenerInsumos,
  obtenerMovimientos,
  registrarEntrada,
  registrarSalida,
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

// Clave base del historial de movimientos (backlogs 4.5 y 4.6).
export const movimientosQueryKey = ["inventario", "movimientos"] as const;

/** Ambas vistas cambian con cualquier movimiento: existencias e historial. */
function invalidarInventario(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: insumosQueryKey }),
    queryClient.invalidateQueries({ queryKey: movimientosQueryKey }),
  ]);
}

/**
 * Backlog 4.4. Al invalidar la clave base de insumos se cumple además el
 * criterio pendiente del backlog 4.2: "la información se actualiza después de
 * registrar entradas o salidas".
 *
 * Se **devuelve** la promesa de ambas invalidaciones: TanStack Query espera lo
 * que retorne `onSuccess` antes de resolver `mutateAsync`. Así el formulario
 * navega con los datos ya refrescados; si se descartaran las promesas, la
 * pantalla de destino podría pintar la existencia anterior y el desmontaje
 * podría cortar el refetch en curso.
 */
export function useRegistrarEntrada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrarEntrada,
    onSuccess: () => invalidarInventario(queryClient),
  });
}

/** Backlog 4.6. Misma semántica de invalidación que el registro de entradas. */
export function useRegistrarSalida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrarSalida,
    onSuccess: () => invalidarInventario(queryClient),
  });
}

export function useMovimientos(filtros: ConsultarMovimientos = {}) {
  return useQuery({
    queryKey: [...movimientosQueryKey, filtros],
    queryFn: () => obtenerMovimientos(filtros),
    // Al cambiar de página o filtro se conservan los datos previos, para que la
    // tabla no parpadee entre consultas.
    placeholderData: (anterior) => anterior,
  });
}
