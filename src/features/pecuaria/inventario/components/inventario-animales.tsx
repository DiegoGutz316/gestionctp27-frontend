"use client";

import { useEffect, useState } from "react";
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
import { PecuariaVistasNav } from "@/features/pecuaria/components/pecuaria-vistas-nav";
import { useAnimales } from "@/features/pecuaria/animal/hooks/hooks";
import { getMensajeDeError } from "@/features/pecuaria/animal/servicios/animal.service";

import {
  animalesDelInventario,
  pieInventarioInicial,
  type PieInventarioMep,
  type TipoInventarioPecuaria,
} from "../models/inventario.model";
import { descargarInventarioExcel } from "../servicios/inventario-excel";
import { InventarioEspeciesMenores } from "./inventario-especies-menores";
import { InventarioGanadoBovino } from "./inventario-ganado-bovino";

const TITULO: Record<TipoInventarioPecuaria, string> = {
  "especies-menores": "Inventario Especies Menores",
  "ganado-bovino": "Inventario Ganado Bovino-UDP",
};

export function InventarioAnimales({
  tipo,
}: {
  tipo: TipoInventarioPecuaria;
}) {
  const colegio = useColegio();
  const animales = useAnimales();
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [pie, setPie] = useState<PieInventarioMep>(() =>
    pieInventarioInicial(tipo),
  );

  useEffect(() => {
    const nombre = colegio.data?.nombre.trim();
    if (!nombre) return;
    setPie((actual) =>
      actual.centroEducativo
        ? actual
        : { ...actual, centroEducativo: nombre },
    );
  }, [colegio.data]);

  if (animales.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-96 w-full" />
      </section>
    );
  }

  if (animales.isError) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(animales.error)}
      </p>
    );
  }

  const listado = animalesDelInventario(animales.data ?? [], tipo);
  const titulo = TITULO[tipo];
  const sinCategoriaBovina =
    tipo === "ganado-bovino" &&
    listado.some((animal) => !animal.categoriaBovina);

  async function descargarExcel() {
    setDescargandoExcel(true);
    try {
      await descargarInventarioExcel(tipo, listado, pie);
      toast.success("El inventario de Excel se descargó correctamente.");
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
    <section className="mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col gap-6">
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
              <BreadcrumbLink render={<Link href="/dashboard/pecuaria" />}>
                Gestión pecuaria
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{titulo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-color-company">
              {titulo}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Plantilla del Ministerio de Educación Pública. Puede completar
              unidad, fecha y firmas antes de imprimir o descargar.
              {listado.length === 0
                ? " No hay animales activos para este inventario."
                : ` ${listado.length} animal${listado.length === 1 ? "" : "es"} activo${listado.length === 1 ? "" : "s"}.`}
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

        <PecuariaVistasNav />

        {sinCategoriaBovina ? (
          <p className="text-sm text-muted-foreground">
            Hay animales bovinos sin categoría (toro, novilla, vaca, ternero/a
            o torete). Edítelos para que las columnas de cantidad se llenen en
            la plantilla.
          </p>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground md:hidden print:hidden">
        Deslice la plantilla hacia el lado para leerla completa.
      </p>

      {tipo === "ganado-bovino" ? (
        <InventarioGanadoBovino
          animales={listado}
          pie={pie}
          onPieChange={setPie}
        />
      ) : (
        <InventarioEspeciesMenores
          animales={listado}
          pie={pie}
          onPieChange={setPie}
        />
      )}
    </section>
  );
}
