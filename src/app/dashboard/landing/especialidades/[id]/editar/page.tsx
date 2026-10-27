"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
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
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { EspecialidadForm } from "@/features/landing/especialidades/components/especialidad-form";
import { useEspecialidadesGestion } from "@/features/landing/especialidades/hooks/hooks";
import { getMensajeDeError } from "@/features/landing/especialidades/servicios/especialidad.service";

export default function EditarEspecialidadPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const listado = useEspecialidadesGestion();

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const especialidad = listado.data?.find((item) => item.id === id);

  return (
    <RequerirPermiso modulo="REPORTES" nivel="COMPLETO">
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
                render={<Link href="/dashboard/landing/especialidades" />}
              >
                Especialidades
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
            Editar especialidad
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice el texto o la foto de la landing.
          </p>
        </div>

        {listado.isLoading ? <Skeleton className="h-64 w-full" /> : null}
        {listado.isError ? (
          <p className="text-sm text-destructive">
            {getMensajeDeError(listado.error)}
          </p>
        ) : null}
        {especialidad ? <EspecialidadForm especialidad={especialidad} /> : null}
        {!listado.isLoading && !listado.isError && !especialidad ? (
          <p className="text-sm text-muted-foreground">
            No se encontró la especialidad.
          </p>
        ) : null}
      </section>
    </RequerirPermiso>
  );
}
