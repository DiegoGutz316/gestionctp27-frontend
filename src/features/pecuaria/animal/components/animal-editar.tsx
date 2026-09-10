"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

import { useAnimal } from "../hooks/hooks";
import { AnimalEditarForm } from "./animal-editar-form";

export function AnimalEditar({
  id,
}: {
  id: number;
}) {
  const animal = useAnimal(id);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5">
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
              render={
                <Link href="/dashboard/pecuaria" />
              }
            >
              Gestión pecuaria
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Editar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar animal
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {animal.isLoading
            ? "Cargando datos…"
            : animal.data
              ? `Actualice los datos de ${animal.data.nombre}.`
              : "Actualice la información del animal."}
        </p>
      </div>

      {animal.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-40" />
        </div>
      ) : null}

      {animal.isError ||
      (!animal.isLoading && !animal.data) ? (
        <p className="text-sm text-destructive">
          No se pudo cargar la información del
          animal. Verifique el identificador o la
          conexión con el servidor.
        </p>
      ) : null}

      {animal.data ? (
        <AnimalEditarForm animal={animal.data} />
      ) : null}
    </section>
  );
}