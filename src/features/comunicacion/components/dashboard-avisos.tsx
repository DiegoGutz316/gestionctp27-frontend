"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, Megaphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import { useAvisos } from "../hooks/aviso-hooks";
import { urlFlyerAviso } from "../servicios/aviso.service";
import {
  ETIQUETA_CATEGORIA_AVISO,
  ETIQUETA_ESTADO_AVISO,
  type AvisoRespuesta,
} from "../validacion/aviso.validacion";
import { AvisoDetalleDialog } from "./aviso-detalle-dialog";

/** El panel resume; el resto se consulta en el módulo administrativo. */
const AVISOS_EN_EL_PANEL = 3;

/**
 * Tope del listado paginado. El servicio ordena por la fecha del aviso, así
 * que el panel pide la página completa de activos y se queda con los tres de
 * publicación más reciente.
 */
const AVISOS_ACTIVOS_A_CONSULTAR = 100;

/**
 * Backlog 5.6: "Los avisos activos pueden mostrarse en el panel principal".
 *
 * Es un resumen, no el listado: tres avisos activos y el enlace al módulo.
 * Mientras carga o si falla no ocupa espacio, porque el panel tiene su propio
 * contenido y un hueco vacío arriba distrae.
 */
export function DashboardAvisos() {
  const consulta = useAvisos({
    pagina: 1,
    limite: AVISOS_ACTIVOS_A_CONSULTAR,
    estado: "ACTIVO",
  });
  const [avisoAbierto, setAvisoAbierto] = useState<AvisoRespuesta | null>(
    null,
  );

  const avisos = useMemo(
    () => recientes(consulta.data?.datos ?? []),
    [consulta.data],
  );

  if (consulta.isPending && !consulta.data) return null;
  if (consulta.isError && avisos.length === 0) return null;

  return (
    <section className="rounded-[26px] border border-[#e5e2dc] dark:border-border bg-[#fbfaf7] dark:bg-muted px-5 py-5 shadow-[0_14px_45px_rgba(41,39,35,0.07)] sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-semibold text-[#292c2a] dark:text-foreground">
          <Megaphone className="size-4 text-[#7fa36a] dark:text-primary" />
          Avisos institucionales
        </h2>

        <Link
          href="/dashboard/comunicacion/avisos"
          className="shrink-0 text-sm text-[#7fa36a] dark:text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {avisos.length === 0 ? (
        <div className="flex items-center gap-3 py-6 text-sm text-[#858985] dark:text-foreground">
          <Megaphone className="size-4 shrink-0 text-[#7fa36a] dark:text-primary" />
          <p>No hay avisos institucionales activos por el momento</p>
        </div>
      ) : (
        <ul className="mt-2">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              className="border-b border-[#e5e2dc] dark:border-border last:border-0"
            >
              <button
                type="button"
                onClick={() => setAvisoAbierto(aviso)}
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-[#f3f1ec]/70 dark:hover:bg-accent sm:gap-4"
              >
                <Miniatura aviso={aviso} />

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-[#292c2a] dark:text-foreground">
                    {aviso.titulo}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-sm leading-5 text-[#858985] dark:text-foreground">
                    {aviso.descripcion}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#858985] dark:text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {formatearFecha(aviso.fecha)}
                    </span>
                    {aviso.categoria ? (
                      <span>{ETIQUETA_CATEGORIA_AVISO[aviso.categoria]}</span>
                    ) : null}
                    <Badge
                      variant="secondary"
                      className="bg-[#e7efe2] dark:bg-secondary font-normal text-[#5d734c] dark:text-primary"
                    >
                      {ETIQUETA_ESTADO_AVISO[aviso.estado]}
                    </Badge>
                  </span>
                </span>

                <Eye
                  aria-hidden
                  className="size-4 shrink-0 text-[#858985] dark:text-foreground"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AvisoDetalleDialog
        aviso={avisoAbierto}
        onCerrar={() => setAvisoAbierto(null)}
      />
    </section>
  );
}

function recientes(avisos: AvisoRespuesta[]) {
  return [...avisos]
    .sort((a, b) => {
      const publicado = b.creadoEn.localeCompare(a.creadoEn);
      return publicado !== 0 ? publicado : b.id - a.id;
    })
    .slice(0, AVISOS_EN_EL_PANEL);
}

function Miniatura({ aviso }: { aviso: AvisoRespuesta }) {
  if (!aviso.tieneFlyer) {
    return (
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-card text-[#7fa36a] dark:text-primary sm:size-24">
        <Megaphone className="size-5" />
      </span>
    );
  }

  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-card sm:size-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urlFlyerAviso(aviso.id)}
        alt=""
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
