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
import { getMensajeDeError } from "../servicios/stock.service";
import { useConfiguracionStock } from "../hooks/hooks";
import { StockEditarForm } from "./stock-editar-form";

export function StockEditar({ id }: { id: number }) {
  const configuracion = useConfiguracionStock(id);
  const producto = configuracion.data?.producto;

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
            <BreadcrumbLink render={<Link href="/dashboard/inventario" />}>
              Inventario
            </BreadcrumbLink>
          </BreadcrumbItem>
          {producto ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link href={`/dashboard/inventario/${producto.id}`} />
                  }
                >
                  {producto.nombre}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ) : null}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar stock</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar configuración de stock
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Actualice el stock mínimo o el precio. Las existencias se gestionan
          por separado mediante entradas y salidas.
        </p>
      </div>

      {configuracion.isLoading ? (
        <p className="text-sm text-muted-foreground">
          Cargando configuración de stock…
        </p>
      ) : null}

      {configuracion.isError || (!configuracion.isLoading && !configuracion.data) ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(configuracion.error)}
        </p>
      ) : null}

      {configuracion.data ? (
        <StockEditarForm configuracion={configuracion.data} />
      ) : null}
    </section>
  );
}
