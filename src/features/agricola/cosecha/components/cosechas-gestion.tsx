"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, SearchIcon, WheatIcon } from "lucide-react";

import { ControlesPaginacion } from "@/components/controles-paginacion";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AgricolaVistasNav } from "@/features/agricola/components/agricola-vistas-nav";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fechaHoyCR } from "@/lib/fechas";

import { useCosechas } from "../hooks/cosecha-hooks";
import {
  rangoRapidoActivo,
  rangosRapidos,
  type RangoFechas,
} from "../models/rangos-fecha";
import { getMensajeDeError } from "../servicios/cosecha.service";
import { CosechasTabla } from "./cosechas-tabla";

export function CosechasGestion() {
  const [cultivo, setCultivo] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [pagina, setPagina] = useState(1);

  // Se espera a que el usuario deje de escribir para no consultar por tecla.
  const cultivoDebounced = useDebouncedValue(cultivo.trim(), 300);

  const hoy = fechaHoyCR();

  // Los campos nativos ya acotan el calendario, pero el usuario puede escribir
  // la fecha a mano, así que el orden se comprueba igual.
  const rangoInvalido = Boolean(desde && hasta && desde > hasta);

  const consulta = useCosechas(
    {
      cultivo: cultivoDebounced || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      pagina,
    },
    { habilitada: !rangoInvalido },
  );

  const cosechas = consulta.data?.datos ?? [];
  const meta = consulta.data?.meta;
  const total = meta?.total ?? 0;
  const hayFiltros = Boolean(cultivoDebounced || desde || hasta);
  const atajoActivo = rangoRapidoActivo(desde, hasta);

  const aplicarRango = ({ desde: nuevoDesde, hasta: nuevoHasta }: RangoFechas) => {
    setDesde(nuevoDesde);
    setHasta(nuevoHasta);
    setPagina(1);
  };

  /**
   * Los atajos funcionan como interruptor: volver a tocar el que está
   * aplicado quita el filtro de fechas en vez de volver a ponerlo, que es lo
   * que el usuario espera de un botón que se ve encendido.
   *
   * Solo se limpian las fechas. El cultivo es otro filtro y no se toca.
   */
  const alternarRango = (id: string, valores: RangoFechas) => {
    if (atajoActivo === id) {
      setDesde("");
      setHasta("");
      setPagina(1);

      return;
    }

    aplicarRango(valores);
  };

  const limpiar = () => {
    setCultivo("");
    setDesde("");
    setHasta("");
    setPagina(1);
  };

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
            <BreadcrumbLink render={<Link href="/dashboard/agricola" />}>
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Cosechas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cosechas registradas
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {rangoInvalido
              ? "Corrija el rango de fechas para ver el historial."
              : consulta.isLoading
                ? "Cargando cosechas…"
                : consulta.isError && cosechas.length === 0
                  ? "No se pudo consultar el historial."
                  : `${total} cosecha${
                      total === 1 ? "" : "s"
                    } encontrada${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/agricola/cosechas/nueva" />}
          >
            <WheatIcon data-icon="inline-start" />
            Registrar cosecha
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filtro-cultivo">Cultivo</Label>

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="filtro-cultivo"
                value={cultivo}
                onChange={(event) => {
                  setCultivo(event.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar por cultivo…"
                className="pl-9"
                maxLength={120}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-desde">Desde</Label>

            <Input
              id="filtro-desde"
              type="date"
              max={hasta || hoy}
              value={desde}
              aria-invalid={rangoInvalido}
              onChange={(event) => {
                setDesde(event.target.value);
                setPagina(1);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-hasta">Hasta</Label>

            <Input
              id="filtro-hasta"
              type="date"
              min={desde || undefined}
              max={hoy}
              value={hasta}
              aria-invalid={rangoInvalido}
              onChange={(event) => {
                setHasta(event.target.value);
                setPagina(1);
              }}
            />
          </div>
        </div>

        {rangoInvalido ? (
          <p role="alert" className="text-sm text-destructive">
            La fecha inicial no puede ser posterior a la fecha final.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="mr-1 text-sm text-muted-foreground">Período:</span>

          {rangosRapidos.map((rango) => {
            const activo = atajoActivo === rango.id;

            return (
              <Button
                key={rango.id}
                type="button"
                size="sm"
                variant={activo ? "default" : "outline"}
                aria-pressed={activo}
                title={activo ? "Tocar de nuevo para quitar el filtro" : undefined}
                onClick={() => alternarRango(rango.id, rango.calcular())}
              >
                {rango.etiqueta}
              </Button>
            );
          })}

          {hayFiltros ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={limpiar}
            >
              Limpiar filtros
            </Button>
          ) : null}
        </div>
      </div>

      {rangoInvalido ? (
        <div className="rounded-xl border bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-sm">
          Revise las fechas: la inicial debe ser anterior o igual a la final.
        </div>
      ) : (
        <CosechasTabla
          cargando={consulta.isLoading}
          mensajeError={
            consulta.isError ? getMensajeDeError(consulta.error) : null
          }
          cosechas={cosechas}
          hayFiltros={hayFiltros}
        />
      )}

      {!rangoInvalido && meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPagina} />
      ) : null}
    </section>
  );
}
