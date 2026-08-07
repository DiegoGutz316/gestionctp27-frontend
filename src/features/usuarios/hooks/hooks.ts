"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EditarUsuario, PaginarUsuarios } from "../models/usuario.model";
import {
  crearUsuario,
  editarUsuario,
  listarUsuarios,
  obtenerUsuario,
} from "../servicios/usuarios.service";

export const usuariosQueryKey = ["usuarios"] as const;

export function useUsuarios(filtros: PaginarUsuarios = {}) {
  return useQuery({
    queryKey: [...usuariosQueryKey, "lista", filtros],
    queryFn: () => listarUsuarios(filtros),
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
