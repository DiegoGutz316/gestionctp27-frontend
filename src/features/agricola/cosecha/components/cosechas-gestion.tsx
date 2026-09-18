"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, SearchIcon, WheatIcon } from "lucide-react";

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
import { getMensajeDeError } from "../servicios/cosecha.service";
import { CosechasTabla } from "./cosechas-tabla";

export function CosechasGestion() {
  const [cultivo, setCultivo] = useState("");
  const [fecha, setFecha] = useState("");

  // Se espera a que el usuario deje de escribir para no consultar por tecla.
  const cultivoDebounced = useDebouncedValue(cultivo.trim(), 300);

  const consulta = useCosechas({
    cultivo: cultivoDebounced || undefined,
    fecha: fecha || undefined,
  });

  const cosechas = consulta.data ?? [];
  const hayFiltros = Boolean(cultivoDebounced || fecha);

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
            {consulta.isLoading
              ? "Cargando cosechas…"
              : consulta.isError && cosechas.length === 0
                ? "No se pudo consultar el historial."
                : `${cosechas.length} cosecha${
                    cosechas.length === 1 ? "" : "s"
                  } encontrada${cosechas.length === 1 ? "" : "s"}`}
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

      <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filtro-cultivo">Cultivo</Label>

          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="filtro-cultivo"
              value={cultivo}
              onChange={(event) => setCultivo(event.target.value)}
              placeholder="Buscar por cultivo…"
              className="pl-9"
              maxLength={120}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filtro-fecha">Fecha de cosecha</Label>

          <div className="flex gap-2">
            <Input
              id="filtro-fecha"
              type="date"
              max={fechaHoyCR()}
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
            />

            {hayFiltros ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCultivo("");
                  setFecha("");
                }}
              >
                Limpiar
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <CosechasTabla
        cargando={consulta.isLoading}
        mensajeError={
          consulta.isError ? getMensajeDeError(consulta.error) : null
        }
        cosechas={cosechas}
        hayFiltros={hayFiltros}
      />
    </section>
  );
}
