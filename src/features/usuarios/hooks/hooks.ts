"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EditarUsuario,
  PaginarUsuarios,
} from "../validacion/usuario.validacion";
import {
  crearUsuario,
  desactivarUsuario,
  editarUsuario,
  listarUsuarios,
  obtenerUsuario,
} from "../servicios/usuarios.service";

export const usuariosQueryKey = ["usuarios"] as const;

export function useUsuarios(
  filtros: PaginarUsuarios = {},
  opciones: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...usuariosQueryKey, "lista", filtros],
    queryFn: () => listarUsuarios(filtros),
    enabled: opciones.enabled ?? true,
  });
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: [...usuariosQueryKey, id],
    queryFn: () => obtenerUsuario(id),
    enabled: Boolean(id),
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearUsuario,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosQueryKey }),
  });
}

export function useEditarUsuario(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EditarUsuario) => editarUsuario(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosQueryKey }),
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarUsuario(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosQueryKey }),
  });
}
