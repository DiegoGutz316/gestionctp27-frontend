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
import { getMensajeDeError } from "../servicios/periodo.service";
import { usePeriodo } from "../hooks/hooks";
import { PeriodoEditarForm } from "./periodo-editar-form";

export function PeriodoEditar({ id }: { id: number }) {
  const periodo = usePeriodo(id);

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
            <BreadcrumbLink render={<Link href="/dashboard/libro-caja" />}>
              Libro de caja
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard/libro-caja/periodos" />}
            >
              Periodos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Editar periodo
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Actualice el nombre y las fechas de un periodo abierto.
        </p>
      </div>

      {periodo.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando periodo…</p>
      ) : null}

      {periodo.isError || (!periodo.isLoading && !periodo.data) ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(periodo.error)}
        </p>
      ) : null}

      {periodo.data?.estado === "CERRADO" ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            El periodo &quot;{periodo.data.nombre}&quot; está cerrado y no se
            puede editar.
          </p>
          <Link
            href={`/dashboard/libro-caja/periodos/${id}`}
            className="text-sm font-medium text-color-company underline-offset-4 hover:underline"
          >
            Volver al detalle
          </Link>
        </div>
      ) : null}

      {periodo.data && periodo.data.estado !== "CERRADO" ? (
        <PeriodoEditarForm periodo={periodo.data} />
      ) : null}
    </section>
  );
}
