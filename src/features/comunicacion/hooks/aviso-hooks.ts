"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  consultarAvisos,
  consultarAvisosParaCalendario,
  desactivarAviso,
  editarAviso,
  obtenerAviso,
  obtenerFlyerGestion,
  registrarAviso,
  urlFlyerAviso,
} from "../servicios/aviso.service";
import type {
  ConsultarAvisos,
  EstadoAviso,
  RegistrarAviso,
} from "../validacion/aviso.validacion";

export const avisosQueryKey = ["comunicacion", "avisos"] as const;

/**
 * Sin `placeholderData`: al cambiar de página conservar el resultado anterior
 * mostraría avisos que no corresponden a lo consultado.
 */
export function useAvisos(
  filtros: ConsultarAvisos = {},
  opciones?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...avisosQueryKey, filtros],
    queryFn: () => consultarAvisos(filtros),
    enabled: opciones?.enabled ?? true,
  });
}

/** Avisos activos con fecha, para el calendario de la landing. */
export function useAvisosCalendario() {
  return useQuery({
    queryKey: [...avisosQueryKey, "publicos", "calendario"],
    queryFn: consultarAvisosParaCalendario,
  });
}

export function useRegistrarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarAviso,

    // Deja lista la consulta del 5.6: al publicar, el listado queda obsoleto.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}

export function useAviso(id: number) {
  return useQuery({
    queryKey: [...avisosQueryKey, "detalle", id],
    queryFn: () => obtenerAviso(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useEditarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: RegistrarAviso }) =>
      editarAviso(id, datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}

/**
 * El aviso activo usa la imagen pública. El inactivo se pide con la sesión,
 * porque esa imagen no se publica.
 */
export function useSrcFlyer(
  aviso: { id: number; estado: EstadoAviso; tieneFlyer: boolean } | null,
): string | null {
  const id = aviso?.id ?? 0;
  const estado = aviso?.estado ?? null;
  const tieneFlyer = aviso?.tieneFlyer ?? false;

  // El aviso activo usa la URL pública y se deriva sin estado. Solo el flyer de
  // un aviso inactivo es asíncrono y necesita guardarse.
  const publico = tieneFlyer && id > 0 && estado === "ACTIVO";
  const deGestion = tieneFlyer && id > 0 && estado !== "ACTIVO";

  const [srcGestion, setSrcGestion] = useState<{
    id: number;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!deGestion) return;

    let cancelado = false;
    let objeto: string | null = null;

    void obtenerFlyerGestion(id)
      .then((url) => {
        if (cancelado) {
          URL.revokeObjectURL(url);
          return;
        }
        objeto = url;
        setSrcGestion({ id, url });
      })
      .catch(() => {
        if (!cancelado) setSrcGestion(null);
      });

    return () => {
      cancelado = true;
      if (objeto) URL.revokeObjectURL(objeto);
      // La URL ya está revocada: no debe quedar disponible para el render.
      setSrcGestion(null);
    };
  }, [id, deGestion]);

  if (publico) return urlFlyerAviso(id);
  if (deGestion && srcGestion?.id === id) return srcGestion.url;

  return null;
}

export function useDesactivarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desactivarAviso,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}
