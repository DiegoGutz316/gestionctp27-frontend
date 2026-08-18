"use client";

import Link from "next/link";
import { ArrowDownToLineIcon, ArrowUpFromLineIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { MovimientosTabla } from "./movimientos-tabla";
import { InventarioVistaSwitch } from "./inventario-vista-switch";

export function MovimientosGestion() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
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
            <BreadcrumbPage>Movimientos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Inventario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de entradas y salidas de insumos registradas.
        </p>
      </div>

      <InventarioVistaSwitch />

      <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="lg"
            className="h-10 flex-1 justify-center"
            nativeButton={false}
            render={<Link href="/dashboard/inventario/movimientos/entrada" />}
          >
            <ArrowDownToLineIcon data-icon="inline-start" />
            Registrar entrada
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-10 flex-1 justify-center"
            nativeButton={false}
            render={<Link href="/dashboard/inventario/movimientos/salida" />}
          >
            <ArrowUpFromLineIcon data-icon="inline-start" />
            Registrar salida
          </Button>
        </div>
      </MostrarSiPuede>

      <MovimientosTabla />
    </section>
  );
}
