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
 * Foto del panel: se pide con la sesión. Así un aviso inactivo o sin imagen
 * no dispara un 404 en la ruta pública.
 */
export function useSrcFlyer(
  aviso: { id: number; estado: EstadoAviso; tieneFlyer: boolean } | null,
): string | null {
  const id = aviso?.id ?? 0;
  const estado = aviso?.estado ?? null;
  const tieneFlyer = aviso?.tieneFlyer ?? false;

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!tieneFlyer || id <= 0) {
      setSrc(null);
      return;
    }

    let cancelado = false;
    let objeto: string | null = null;

    void obtenerFlyerGestion(id)
      .then((url) => {
        if (cancelado) {
          URL.revokeObjectURL(url);
          return;
        }
        objeto = url;
        setSrc(url);
      })
      .catch(() => {
        if (!cancelado) setSrc(null);
      });

    return () => {
      cancelado = true;
      if (objeto) URL.revokeObjectURL(objeto);
    };
  }, [id, tieneFlyer]);

  return src;
}

/** Foto de la landing. Si el aviso no tiene imagen, no se pide el archivo. */
export function useSrcFlyerPublico(
  aviso: { id: number; tieneFlyer: boolean } | null,
): string | null {
  const id = aviso?.id ?? 0;
  const tieneFlyer = aviso?.tieneFlyer ?? false;
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!tieneFlyer || id <= 0) {
      setSrc(null);
      return;
    }

    setSrc(urlFlyerAviso(id));
  }, [id, tieneFlyer]);

  return src;
}

export function useDesactivarAviso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desactivarAviso,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: avisosQueryKey }),
  });
}
