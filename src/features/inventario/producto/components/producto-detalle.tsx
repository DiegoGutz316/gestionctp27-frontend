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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/context/auth-context";
import { MovimientosTabla } from "../../stock/components/movimientos-tabla";
import { StockDeProducto } from "../../stock/components/stock-de-producto";
import {
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_UBICACION,
  ETIQUETA_UNIDAD_MEDIDA,
} from "../models/producto.model";
import { useProducto } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/producto.service";

export function ProductoDetalle({ id }: { id: number }) {
  const { usuario } = useAuth();
  const producto = useProducto(id);

  if (producto.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  if (producto.isError || !producto.data) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <p className="text-sm text-destructive">
          {getMensajeDeError(producto.error)}
        </p>
      </section>
    );
  }

  const datos = producto.data;

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
            <BreadcrumbLink render={<Link href="/dashboard/inventario" />}>
              Inventario
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
            {ETIQUETA_TIPO_PRODUCTO[datos.tipoProducto]} ·{" "}
            {ETIQUETA_UNIDAD_MEDIDA[datos.unidadMedida]}
          </p>
        </div>
        {usuario?.rol === "ADMINISTRADOR" ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/dashboard/inventario/${id}/editar`} />}
          >
            <PencilIcon data-icon="inline-start" />
            Editar producto
          </Button>
        ) : null}
      </div>

      <StockDeProducto producto={datos} />

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-4 shadow-xs sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Departamento
          </p>
          <p className="mt-1 text-sm text-foreground">
            {ETIQUETA_DEPARTAMENTO[datos.departamento]}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Ubicación
          </p>
          <p className="mt-1 text-sm text-foreground">
            {ETIQUETA_UBICACION[datos.ubicacion]}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Estado
          </p>
          <p className="mt-1 text-sm text-foreground">
            {datos.activo ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {datos.inventario ? (
        <MovimientosTabla inventarioId={datos.inventario.id} />
      ) : null}
    </section>
  );
}
