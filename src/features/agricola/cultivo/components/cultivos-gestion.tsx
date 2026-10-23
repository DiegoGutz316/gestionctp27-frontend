"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, PlusIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { AgricolaVistasNav } from "@/features/agricola/components/agricola-vistas-nav";
import {
  BarraFiltrosAgricolas,
  type EtiquetaFiltro,
} from "@/features/agricola/components/barra-filtros-agricolas";

import { useCultivos } from "../hooks/cultivo-hooks";
import {
  ETIQUETA_TIPO_CULTIVO,
  TIPOS_CULTIVO,
  type TipoCultivo,
} from "../models/cultivo.model";
import { CultivosTabla } from "./cultivos-tabla";

export function CultivosGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");

  // La búsqueda viaja al servidor, que ignora tildes: «maiz» encuentra «Maíz».
  const busquedaDiferida = useDebouncedValue(busqueda, 300);

  const consulta = useCultivos({
    q: busquedaDiferida.trim() || undefined,
    tipo: (tipo || undefined) as TipoCultivo | undefined,
  });
  const cultivos = consulta.data ?? [];

  const tiposItems = TIPOS_CULTIVO.map((valor) => ({
    value: valor,
    label: ETIQUETA_TIPO_CULTIVO[valor],
  }));

  const etiquetas: EtiquetaFiltro[] = [
    ...(busqueda.trim()
      ? [
          {
            id: "busqueda",
            etiqueta: `Nombre: ${busqueda.trim()}`,
            onQuitar: () => setBusqueda(""),
          },
        ]
      : []),
    ...(tipo
      ? [
          {
            id: "tipo",
            etiqueta: `Tipo: ${ETIQUETA_TIPO_CULTIVO[tipo as TipoCultivo]}`,
            onQuitar: () => setTipo(""),
          },
        ]
      : []),
  ];

  const hayFiltros = etiquetas.length > 0;

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
            <BreadcrumbPage>Cultivos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cultivos registrados
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {consulta.isLoading
              ? "Cargando cultivos…"
              : consulta.isError
                ? "No se pudo consultar el catálogo."
                : `${cultivos.length} cultivo${cultivos.length === 1 ? "" : "s"} encontrado${cultivos.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/agricola/cultivos/nuevo" />}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar cultivo
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <BarraFiltrosAgricolas
        busqueda={{
          id: "filtro-cultivo",
          value: busqueda,
          onChange: setBusqueda,
          placeholder: "Buscar cultivo...",
          maxLength: 120,
        }}
        etiquetas={etiquetas}
        onLimpiar={() => {
          setBusqueda("");
          setTipo("");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="filtro-tipo">Tipo de cultivo</Label>
          <Select
            items={tiposItems}
            value={tipo === "" ? null : tipo}
            onValueChange={(valor) => setTipo((valor as string | null) ?? "")}
          >
            <SelectTrigger id="filtro-tipo" className="w-full">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              {tiposItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </BarraFiltrosAgricolas>

      <CultivosTabla
        cargando={consulta.isLoading}
        error={consulta.isError}
        cultivos={cultivos}
        hayFiltros={hayFiltros}
      />
    </section>
  );
}
