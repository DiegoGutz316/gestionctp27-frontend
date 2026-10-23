"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, PlusIcon } from "lucide-react";

import { AccionFlotante } from "@/components/accion-flotante";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgricolaVistasNav } from "@/features/agricola/components/agricola-vistas-nav";
import { BarraFiltrosAgricolas, type EtiquetaFiltro } from "@/features/agricola/components/barra-filtros-agricolas";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { useSiembras } from "../hooks/siembra-hooks";
import { fechaHoyLocal, formatearFecha } from "../models/siembra.model";
import { SiembrasTabla } from "./siembras-tabla";

export function SiembrasGestion() {
  const [cultivo, setCultivo] = useState("");
  const [fecha, setFecha] = useState("");
  const cultivoDebounced = useDebouncedValue(cultivo.trim(), 300);
  const consulta = useSiembras({
    cultivo: cultivoDebounced || undefined,
    fecha: fecha || undefined,
  });
  const siembras = consulta.data ?? [];
  const hayFiltros = Boolean(cultivoDebounced || fecha);

  const etiquetas: EtiquetaFiltro[] = [];

  if (fecha) {
    etiquetas.push({
      id: "fecha",
      etiqueta: formatearFecha(fecha),
      onQuitar: () => setFecha(""),
    });
  }

  const limpiar = () => {
    setCultivo("");
    setFecha("");
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />} className="flex items-center gap-1.5"><Home className="size-3.5" />Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink render={<Link href="/dashboard/agricola" />}>Gestión agrícola</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Siembras</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Siembras registradas</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{consulta.isLoading ? "Cargando siembras…" : `${siembras.length} siembra${siembras.length === 1 ? "" : "s"} encontrada${siembras.length === 1 ? "" : "s"}`}</p>
        </div>
        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button className="hidden md:inline-flex" nativeButton={false} render={<Link href="/dashboard/agricola/siembras/nueva" />}>
            <PlusIcon data-icon="inline-start" />Registrar siembra
          </Button>
          <AccionFlotante href="/dashboard/agricola/siembras/nueva" etiqueta="Registrar siembra" />
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <BarraFiltrosAgricolas
        busqueda={{
          id: "filtro-cultivo",
          value: cultivo,
          onChange: setCultivo,
          placeholder: "Buscar cultivo...",
          maxLength: 120,
        }}
        etiquetas={etiquetas}
        onLimpiar={limpiar}
      >
        <div className="space-y-2">
          <Label htmlFor="filtro-fecha">Fecha de siembra</Label>
          <Input id="filtro-fecha" type="date" max={fechaHoyLocal()} value={fecha} onChange={(event) => setFecha(event.target.value)} />
        </div>
      </BarraFiltrosAgricolas>

      <SiembrasTabla cargando={consulta.isLoading} error={consulta.isError} siembras={siembras} hayFiltros={hayFiltros} />
    </section>
  );
}
