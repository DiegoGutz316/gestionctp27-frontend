"use client";

import Link from "next/link";
import { Ban, CalendarDays, Megaphone, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import { useSrcFlyer } from "../hooks/aviso-hooks";
import type { AvisoRespuesta } from "../validacion/aviso.validacion";

type Props = {
  cargando: boolean;
  mensajeError: string | null;
  avisos: AvisoRespuesta[];
  onDesactivar: (aviso: AvisoRespuesta) => void;
};

/**
 * Backlog 5.6: "La consulta muestra título, descripción y fecha de cada
 * aviso" y "Si no existen avisos activos, el sistema muestra un mensaje
 * informativo".
 *
 * Carga, error, vacío y datos son estados excluyentes: un fallo de red
 * también deja la lista vacía, y confundirlos haría decir que no hay avisos
 * cuando en realidad no se pudieron consultar.
 */
export function AvisosLista({
  cargando,
  mensajeError,
  avisos,
  onDesactivar,
}: Props) {
  const hayAvisos = avisos.length > 0;

  // Con datos ya cargados, un refresco fallido no debe esconderlos: se
  // muestran y el fallo se avisa aparte.
  const estado = cargando
    ? "cargando"
    : hayAvisos
      ? "datos"
      : mensajeError
        ? "error"
        : "vacio";

  if (estado === "cargando") {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, indice) => (
          <Card key={`esqueleto-${indice}`}>
            <CardContent className="space-y-3 py-5">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (estado === "error") {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm whitespace-normal text-destructive">
          {mensajeError}
        </CardContent>
      </Card>
    );
  }

  if (estado === "vacio") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Megaphone className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">
            No hay avisos institucionales activos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mensajeError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          No se pudo actualizar la lista ({mensajeError}). Se muestran los
          últimos avisos cargados.
        </p>
      ) : null}

      {avisos.map((aviso) => (
        <Card key={aviso.id}>
          <CardContent className="py-5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h2 className="font-semibold tracking-tight">{aviso.titulo}</h2>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {formatearFecha(aviso.fecha)}
                </span>

                <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/dashboard/comunicacion/avisos/${aviso.id}/editar`}
                        />
                      }
                    >
                      <Pencil data-icon="inline-start" />
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDesactivar(aviso)}
                    >
                      <Ban data-icon="inline-start" />
                      Desactivar
                    </Button>
                  </div>
                </MostrarSiPuede>
              </div>
            </div>

            <FlyerLista aviso={aviso} />

            <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">
              {aviso.descripcion}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FlyerLista({ aviso }: { aviso: AvisoRespuesta }) {
  const src = useSrcFlyer(aviso.tieneFlyer ? aviso : null);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Flyer de ${aviso.titulo}`}
      className="mt-3 max-h-64 w-full rounded-lg border object-contain"
    />
  );
}
