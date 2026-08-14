"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
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
import { EntradasTabla } from "./entradas-tabla";
import { InventarioVistaSwitch } from "./inventario-vista-switch";

export function EntradasGestion() {
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
            <BreadcrumbPage>Entradas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Inventario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de los ingresos de insumos registrados.
        </p>
      </div>

      <InventarioVistaSwitch />

      <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
        <Button
          size="lg"
          className="h-10 w-full justify-center"
          nativeButton={false}
          render={<Link href="/dashboard/inventario/entradas/nueva" />}
        >
          <PlusIcon data-icon="inline-start" />
          Registrar entrada
        </Button>
      </MostrarSiPuede>

      <EntradasTabla />
    </section>
  );
}
