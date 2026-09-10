"use client";

import Link from "next/link";
import {
  HeartPulseIcon,
  Home,
  MilkIcon,
  PencilIcon,
} from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useHistorialSalud } from "@/features/pecuaria/salud/hooks/hooks";
import {
  ETIQUETA_CONDICION_SALUD,
  formatearFecha,
  type CondicionSalud,
} from "@/features/pecuaria/salud/models/salud.model";
import { getMensajeDeError } from "@/features/pecuaria/salud/servicios/salud.service";

import { useAnimal } from "../hooks/hooks";
import {
  ETIQUETA_ESTADO_ANIMAL,
  esAnimalActivo,
  etiquetaCategoriaBovina,
  etiquetaEspecie,
  type EstadoAnimal,
} from "../models/animal.model";

export function AnimalDetalle({ id }: { id: number }) {
  const animal = useAnimal(id);
  const historial = useHistorialSalud(id);

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
  const activo = esAnimalActivo(datos.estado);
  const registros = historial.data?.registros ?? [];

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
            <BreadcrumbLink render={<Link href="/dashboard/pecuaria" />}>
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
          <h1 className="text-2xl font-semibold tracking-tight">
            {datos.nombre}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {datos.codigo} · {etiquetaEspecie(datos.especie)} · {datos.raza}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link
                href={`/dashboard/pecuaria/produccion?animalId=${datos.id}`}
              />
            }
          >
            <MilkIcon data-icon="inline-start" />
            Producción
          </Button>

          <MostrarSiPuede modulo="PECUARIA" nivel="COMPLETO">
            {activo ? (
              <Button
                nativeButton={false}
                render={
                  <Link
                    href={`/dashboard/pecuaria/salud/nuevo?animalId=${datos.id}`}
                  />
                }
              >
                <HeartPulseIcon data-icon="inline-start" />
                Registrar salud
              </Button>
            ) : null}

            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={`/dashboard/pecuaria/${datos.id}/editar`} />
              }
            >
              <PencilIcon data-icon="inline-start" />
              Editar
            </Button>
          </MostrarSiPuede>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-4 shadow-xs sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Especie
          </p>
          <p className="mt-1 text-sm">{etiquetaEspecie(datos.especie)}</p>
        </div>
        {datos.especie === "VACA" ? (
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Categoría
            </p>
            <p className="mt-1 text-sm">
              {etiquetaCategoriaBovina(datos.categoriaBovina)}
            </p>
          </div>
        ) : null}
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Fecha de nacimiento
          </p>
          <p className="mt-1 text-sm">{formatearFecha(datos.fechaNacimiento)}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Estado
          </p>
          <Badge variant="secondary" className="mt-1">
            {ETIQUETA_ESTADO_ANIMAL[datos.estado as EstadoAnimal] ??
              datos.estado}
          </Badge>
        </div>
      </div>

      {datos.observaciones ? (
        <p className="text-sm text-muted-foreground">{datos.observaciones}</p>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold tracking-tight">
          Historial de salud
        </h2>

        {historial.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : null}

        {historial.isError ? (
          <p className="text-sm text-destructive">
            {getMensajeDeError(historial.error)}
          </p>
        ) : null}

        {historial.data ? (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Condición observada</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No hay registros de salud para este animal.
                    </TableCell>
                  </TableRow>
                ) : (
                  registros.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{formatearFecha(registro.fecha)}</TableCell>
                      <TableCell>
                        {
                          ETIQUETA_CONDICION_SALUD[
                            registro.condicionObservada as CondicionSalud
                          ]
                        }
                      </TableCell>
                      <TableCell>{registro.diagnostico ?? "—"}</TableCell>
                      <TableCell>{registro.observaciones ?? "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
