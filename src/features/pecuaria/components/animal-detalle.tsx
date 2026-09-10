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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useAnimal } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/animal.service";

/** Fecha en formato local; el backend la entrega como AAAA-MM-DD. */
function formatearFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length !== 3) return fecha;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

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
      <p className="mt-1 text-sm text-foreground">
        {children}
      </p>
    </div>
  );
}

/**
 * Backlog 2.2: "El usuario puede seleccionar un animal para visualizar su
 * información detallada". Es una vista de solo lectura; basta con LECTURA
 * sobre PECUARIA, y la acción de editar se muestra solo a quien tenga COMPLETO.
 */
export function AnimalDetalle({ id }: { id: number }) {
  const animal = useAnimal(id);

  if (animal.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  if (animal.isError || !animal.data) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <p className="text-sm text-destructive">
          {getMensajeDeError(animal.error)}
        </p>
      </section>
    );
  }

  const datos = animal.data;
  const inactivo =
    datos.estado.toUpperCase() === "INACTIVO";

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
              render={<Link href="/dashboard/pecuaria" />}
            >
              Gestión pecuaria
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{datos.nombre}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {datos.nombre}
            </h1>
            <Badge
              variant={inactivo ? "outline" : "secondary"}
            >
              {datos.estado}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {datos.codigo} · {datos.especie} · {datos.raza}
          </p>
        </div>

        <MostrarSiPuede
          modulo="PECUARIA"
          nivel="COMPLETO"
        >
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link
                href={`/dashboard/pecuaria/${id}/editar`}
              />
            }
          >
            <PencilIcon data-icon="inline-start" />
            Editar animal
          </Button>
        </MostrarSiPuede>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-4 shadow-xs sm:grid-cols-3">
        <Dato etiqueta="Código">{datos.codigo}</Dato>
        <Dato etiqueta="Especie">{datos.especie}</Dato>
        <Dato etiqueta="Raza">{datos.raza}</Dato>
        <Dato etiqueta="Fecha de nacimiento">
          {formatearFecha(datos.fechaNacimiento)}
        </Dato>
        <Dato etiqueta="Estado">{datos.estado}</Dato>
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
