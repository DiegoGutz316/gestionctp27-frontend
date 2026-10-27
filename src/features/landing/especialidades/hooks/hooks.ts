"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  crearEspecialidad,
  desactivarEspecialidad,
  editarEspecialidad,
  listarEspecialidadesGestion,
  listarEspecialidadesPublicas,
  quitarFotoEspecialidad,
  reactivarEspecialidad,
  subirFotoEspecialidad,
} from "../servicios/especialidad.service";
import type { CrearEspecialidad } from "../validacion/especialidad.validacion";

export const especialidadesQueryKey = ["landing", "especialidades"] as const;

export function useEspecialidadesPublicas() {
  return useQuery({
    queryKey: [...especialidadesQueryKey, "publicas"],
    queryFn: listarEspecialidadesPublicas,
  });
}

export function useEspecialidadesGestion() {
  return useQuery({
    queryKey: [...especialidadesQueryKey, "gestion"],
    queryFn: listarEspecialidadesGestion,
  });
}

function invalidar(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: especialidadesQueryKey });
}

export function useCrearEspecialidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearEspecialidad) => crearEspecialidad(datos),
    onSuccess: () => invalidar(queryClient),
  });
}

export function useEditarEspecialidad(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearEspecialidad) => editarEspecialidad(id, datos),
    onSuccess: () => invalidar(queryClient),
  });
}

export function useDesactivarEspecialidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => desactivarEspecialidad(id),
    onSuccess: () => invalidar(queryClient),
  });
}

export function useReactivarEspecialidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reactivarEspecialidad(id),
    onSuccess: () => invalidar(queryClient),
  });
}

export function useSubirFotoEspecialidad(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (archivo: File) => subirFotoEspecialidad(id, archivo),
    onSuccess: () => invalidar(queryClient),
  });
}

export function useQuitarFotoEspecialidad(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => quitarFotoEspecialidad(id),
    onSuccess: () => invalidar(queryClient),
  });
}
