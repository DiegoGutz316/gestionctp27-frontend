"use client";

import Link from "next/link";
import { CalendarDays, Megaphone } from "lucide-react";

import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import { useAvisos } from "../hooks/aviso-hooks";

/** Cuántos avisos caben en el panel sin tapar el resto del contenido. */
const AVISOS_EN_EL_PANEL = 3;

/**
 * Backlog 5.6: "Los avisos activos pueden mostrarse en el panel principal".
 *
 * Es un resumen, no el listado: trae solo los más próximos y enlaza a la
 * pantalla completa. Mientras carga o si falla no ocupa espacio, porque el
 * panel tiene su propio contenido y un hueco vacío arriba distrae.
 */
export function DashboardAvisos() {
  const consulta = useAvisos({ pagina: 1, limite: AVISOS_EN_EL_PANEL });

  const avisos = consulta.data?.datos ?? [];
  const total = consulta.data?.meta?.total ?? 0;

  // Basta con mirar si hay algo que mostrar: cubre la carga inicial y el fallo
  // sin datos. Lo que no debe pasar es que un refresco fallido haga desaparecer
  // avisos que ya estaban en pantalla, y eso es alcanzable desde «Actualizar
  // datos»; en ese caso se conservan los últimos conocidos, como en el listado.
  if (avisos.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[26px] border border-[#e5e2dc] bg-[#fbfaf7] px-6 py-5 shadow-[0_14px_45px_rgba(41,39,35,0.07)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-semibold text-[#292c2a]">
          <Megaphone className="size-4 text-[#7fa36a]" />
          Avisos institucionales
        </h2>

        <Link
          href="/dashboard/comunicacion/avisos"
          className="text-sm text-[#7fa36a] hover:underline"
        >
          {total > AVISOS_EN_EL_PANEL ? `Ver los ${total}` : "Ver todos"}
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {avisos.map((aviso) => (
          <li
            key={aviso.id}
            className="border-b border-[#e5e2dc] pb-3 last:border-0 last:pb-0"
          >
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <p className="font-medium text-[#292c2a]">{aviso.titulo}</p>

              <span className="flex items-center gap-1.5 text-sm whitespace-nowrap text-[#858985]">
                <CalendarDays className="size-3.5" />
                {formatearFecha(aviso.fecha)}
              </span>
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-[#858985]">
              {aviso.descripcion}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
