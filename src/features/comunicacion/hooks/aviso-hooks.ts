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

  const [src, setSrc] = useState<string | null>(() =>
    tieneFlyer && estado === "ACTIVO" ? urlFlyerAviso(id) : null,
  );

  useEffect(() => {
    if (!tieneFlyer || id <= 0) {
      setSrc(null);
      return;
    }

    if (estado === "ACTIVO") {
      setSrc(urlFlyerAviso(id));
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
  }, [id, estado, tieneFlyer]);

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
