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

import { useCamaCultivo } from "../hooks/cama-cultivo-hooks";
import { CamaCultivoEditarForm } from "./cama-cultivo-editar-form";

export function CamaCultivoEditar({ id }: { id: number }) {
  const cama = useCamaCultivo(id);

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
              render={<Link href="/dashboard/agricola" />}
            >
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar cama de cultivo
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {cama.isLoading
            ? "Cargando datos…"
            : cama.data
              ? `Actualice los datos de ${cama.data.codigo}.`
              : "Actualice la información de la cama de cultivo."}
        </p>
      </div>

      {cama.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-40" />
        </div>
      ) : null}

      {cama.isError || (!cama.isLoading && !cama.data) ? (
        <p className="text-sm text-destructive">
          No se pudo cargar la información de la cama de cultivo. Verifique
          el identificador o la conexión con el servidor.
        </p>
      ) : null}

      {cama.data ? <CamaCultivoEditarForm cama={cama.data} /> : null}
    </section>
  );
}
