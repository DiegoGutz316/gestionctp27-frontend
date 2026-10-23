"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EditarDepartamento,
  FiltrarDepartamentos,
} from "../validacion/departamento.validacion";
import { periodosQueryKey } from "@/features/libro-caja/periodo/hooks/hooks";
import {
  crearDepartamento,
  desactivarDepartamento,
  editarDepartamento,
  listarDepartamentos,
  listarDepartamentosActivos,
  obtenerDepartamento,
} from "../servicios/departamento.service";

export const departamentosQueryKey = ["libro-caja", "departamentos"] as const;

export function useDepartamentos(
  filtros: FiltrarDepartamentos = {},
  opciones: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...departamentosQueryKey, filtros],
    queryFn: () => listarDepartamentos(filtros),
    enabled: opciones.enabled ?? true,
  });
}

export function useDepartamentosActivos() {
  return useQuery({
    queryKey: [...departamentosQueryKey, "activos", "todos"],
    queryFn: listarDepartamentosActivos,
  });
}

export function useDepartamento(id: number) {
  return useQuery({
    queryKey: [...departamentosQueryKey, id],
    queryFn: () => obtenerDepartamento(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCrearDepartamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearDepartamento,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: departamentosQueryKey });
      void queryClient.invalidateQueries({ queryKey: periodosQueryKey });
    },
  });
}

export function useEditarDepartamento(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarDepartamento) => editarDepartamento(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: departamentosQueryKey }),
  });
}

export function useDesactivarDepartamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => desactivarDepartamento(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: departamentosQueryKey });
      void queryClient.invalidateQueries({ queryKey: periodosQueryKey });
    },
  });
}
