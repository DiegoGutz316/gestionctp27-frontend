"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Home, Printer } from "lucide-react";
import { toast } from "sonner";
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
import { useColegio } from "@/features/libro-caja/colegio/hooks/hooks";
import { getMensajeDeError as getMensajeColegio } from "@/features/libro-caja/colegio/servicios/colegio.service";
import { useAsientos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";
import { descargarInformeEconomicoExcel } from "../servicios/informe-excel";
import { InformeEconomicoUdp } from "./informe-economico-udp";

export function InformeEconomico({
  periodoId,
  fondoId,
}: {
  periodoId: number;
  fondoId: number;
}) {
  const colegio = useColegio();
  const libro = useAsientos(periodoId, fondoId);
  const [descargandoExcel, setDescargandoExcel] = useState(false);

  if (colegio.isLoading || libro.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-96 w-full" />
      </section>
    );
  }

  if (colegio.isError || !colegio.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeColegio(colegio.error)}
      </p>
    );
  }

  if (libro.isError || !libro.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(libro.error)}
      </p>
    );
  }

  const unidad = libro.data.fondo.departamento.nombreUnidad;
  const datosColegio = colegio.data;
  const datosLibro = libro.data;

  async function descargarExcel() {
    setDescargandoExcel(true);
    try {
      await descargarInformeEconomicoExcel(datosColegio, datosLibro);
      toast.success("El informe de Excel se descargó correctamente.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo generar el archivo de Excel.",
      );
    } finally {
      setDescargandoExcel(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6">
      <div className="print:hidden space-y-6">
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
              <BreadcrumbLink render={<Link href="/dashboard/reportes" />}>
                Reportes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={
                  <Link
                    href={`/dashboard/libro-caja/periodos/${periodoId}/fondos/${fondoId}`}
                  />
                }
              >
                {unidad}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Informe económico</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-color-company">
              Informe Económico-UDP
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {unidad} · {datosLibro.periodo.nombre}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={descargandoExcel}
              onClick={() => void descargarExcel()}
            >
              <FileSpreadsheet data-icon="inline-start" />
              {descargandoExcel ? "Generando Excel…" : "Descargar Excel"}
            </Button>
            <Button type="button" onClick={() => window.print()}>
              <Printer data-icon="inline-start" />
              Imprimir / guardar PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#cfcfcf] p-4 print:overflow-visible print:bg-white print:p-0">
        <div className="mx-auto bg-white shadow-md print:shadow-none">
          <InformeEconomicoUdp colegio={datosColegio} libro={datosLibro} />
        </div>
      </div>
    </section>
  );
}
