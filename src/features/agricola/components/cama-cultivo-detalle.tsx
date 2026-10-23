"use client";

import Link from "next/link";
import { Home, PencilIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AccionFlotante } from "@/components/accion-flotante";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useCamaCultivo } from "../hooks/cama-cultivo-hooks";
import { getMensajeDeError } from "../servicios/cama-cultivo.service";
import { ETIQUETA_ESTADO_CAMA_CULTIVO } from "../validacion/cama-cultivo.validacion";

function Dato({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {etiqueta}
      </p>
      <p className="mt-1 text-sm text-foreground">{children}</p>
    </div>
  );
}

export function CamaCultivoDetalle({ id }: { id: number }) {
  const cama = useCamaCultivo(id);

  if (cama.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  if (cama.isError || !cama.data) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <p className="text-sm text-destructive">
          {getMensajeDeError(cama.error)}
        </p>
      </section>
    );
  }

  const datos = cama.data;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard/agricola" />}
            >
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{datos.codigo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {datos.codigo}
            </h1>
            <Badge variant="secondary">
              {ETIQUETA_ESTADO_CAMA_CULTIVO[datos.estado]}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {datos.ubicacion}
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <AccionFlotante
            href={`/dashboard/agricola/${id}/editar`}
            etiqueta="Editar cama"
            icono={<PencilIcon className="size-5" />}
          />
        </MostrarSiPuede>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-4 shadow-xs sm:grid-cols-3">
        <Dato etiqueta="Código">{datos.codigo}</Dato>
        <Dato etiqueta="Ubicación">{datos.ubicacion}</Dato>
        <Dato etiqueta="Estado">
          {ETIQUETA_ESTADO_CAMA_CULTIVO[datos.estado]}
        </Dato>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Observaciones
        </p>
        <p className="mt-1 text-sm whitespace-pre-line text-foreground">
          {datos.observaciones?.trim() ? (
            datos.observaciones
          ) : (
            <span className="text-muted-foreground">
              Sin observaciones registradas.
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
