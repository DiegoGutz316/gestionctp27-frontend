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
import { getMensajeDeError } from "../servicios/colegio.service";
import { useColegio } from "../hooks/hooks";
import { ColegioForm } from "./colegio-form";

export function ColegioEditar() {
  const colegio = useColegio();

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
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Editar información del colegio
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Actualice el nombre, la cuenta bancaria y la entidad de depósito.
        </p>
      </div>

      {colegio.isLoading ? (
        <p className="text-sm text-muted-foreground">
          Cargando información del colegio…
        </p>
      ) : null}

      {colegio.isError || (!colegio.isLoading && !colegio.data) ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(colegio.error)}
        </p>
      ) : null}

      {colegio.data ? <ColegioForm colegio={colegio.data} /> : null}
    </section>
  );
}
