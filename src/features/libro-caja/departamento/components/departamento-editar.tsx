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
import { getMensajeDeError } from "../servicios/departamento.service";
import { useDepartamento } from "../hooks/hooks";
import { DepartamentoEditarForm } from "./departamento-editar-form";

export function DepartamentoEditar({ id }: { id: number }) {
  const departamento = useDepartamento(id);

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
              render={<Link href="/dashboard/libro-caja/departamentos" />}
            >
              Departamentos
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
          Editar departamento
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Actualice el nombre de la unidad y el tipo de actividad.
        </p>
      </div>

      {departamento.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando departamento…</p>
      ) : null}

      {departamento.isError ||
      (!departamento.isLoading && !departamento.data) ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(departamento.error)}
        </p>
      ) : null}

      {departamento.data ? (
        <DepartamentoEditarForm departamento={departamento.data} />
      ) : null}
    </section>
  );
}
