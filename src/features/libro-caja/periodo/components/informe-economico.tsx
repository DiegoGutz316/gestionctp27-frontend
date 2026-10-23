"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { useAuth } from "@/features/auth/context/auth-context";
import { useColegio } from "@/features/libro-caja/colegio/hooks/hooks";
import { getMensajeDeError as getMensajeColegio } from "@/features/libro-caja/colegio/servicios/colegio.service";
import { useAsientos, useGuardarPieInforme } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";
import { descargarInformeEconomicoExcel } from "../servicios/informe-excel";
import type { PieInformeRespuesta } from "../validacion/periodo.validacion";
import {
  InformeEconomicoUdp,
  PIE_INFORME_VACIO,
  type PieInformeUdp,
} from "./informe-economico-udp";

function pieDesdeServidor(
  valor: PieInformeRespuesta | null | undefined,
): PieInformeUdp {
  if (!valor) return PIE_INFORME_VACIO;
  return {
    observaciones: [
      valor.observaciones[0] ?? "",
      valor.observaciones[1] ?? "",
      valor.observaciones[2] ?? "",
    ],
    director: valor.director,
    presidente: valor.presidente,
    tesorera: valor.tesorera,
    firmaDirector: valor.firmaDirector,
    firmaPresidente: valor.firmaPresidente,
    firmaTesorera: valor.firmaTesorera,
    coordinador: valor.coordinador,
  };
}

export function InformeEconomico({
  periodoId,
  fondoId,
}: {
  periodoId: number;
  fondoId: number;
}) {
  const { puede } = useAuth();
  const puedeGuardar = puede("LIBRO_CAJA", "COMPLETO");
  const colegio = useColegio();
  const libro = useAsientos(periodoId, fondoId);
  const guardar = useGuardarPieInforme(periodoId, fondoId);
  const guardarPie = useRef(guardar.mutate);
  guardarPie.current = guardar.mutate;
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [pieLocal, setPieLocal] = useState<PieInformeUdp | null>(null);
  const pieServidor = useMemo(
    () => pieDesdeServidor(libro.data?.fondo.pieInforme),
    [libro.data?.fondo.pieInforme],
  );
  const pie = pieLocal ?? pieServidor;

  useEffect(() => {
    setPieLocal(null);
  }, [fondoId]);

  useEffect(() => {
    if (!puedeGuardar || !libro.data) return;
    if (JSON.stringify(pie) === JSON.stringify(pieServidor)) return;

    const timer = window.setTimeout(() => {
      guardarPie.current(pie, {
        onError: (error) => toast.error(getMensajeDeError(error)),
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pie, pieServidor, libro.data, puedeGuardar]);

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
      await descargarInformeEconomicoExcel(datosColegio, datosLibro, pie);
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
              <BreadcrumbLink render={<Link href="/dashboard/libro-caja" />}>
                Libro de caja
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
          <InformeEconomicoUdp
            colegio={datosColegio}
            libro={datosLibro}
            pie={pie}
            onPieChange={setPieLocal}
          />
        </div>
      </div>
    </section>
  );
}
