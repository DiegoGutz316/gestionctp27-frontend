import type { Metadata } from "next";
import Link from "next/link";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EntradasTabla } from "@/features/inventario/components/entradas-tabla";

export const metadata: Metadata = {
  title: "Entradas de inventario | GestiónCTP27",
};

/**
 * Backlog 4.5. La consulta solo exige LECTURA (la hereda del layout de
 * inventario); el botón para registrar sí pide COMPLETO.
 */
export default function EntradasPage() {
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Entradas de inventario
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Historial de los ingresos de insumos registrados.
          </p>
        </div>
        <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
          <Button
            className="h-10 shrink-0"
            nativeButton={false}
            render={<Link href="/dashboard/inventario/entradas/nueva" />}
          >
            Registrar entrada
          </Button>
        </MostrarSiPuede>
      </div>

      <EntradasTabla />
    </section>
  );
}
