"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, PlusIcon, SearchIcon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useCamasCultivo } from "../hooks/cama-cultivo-hooks";
import { INVERNADEROS } from "../validacion/cama-cultivo.validacion";
import { AgricolaVistasNav } from "./agricola-vistas-nav";
import { CamasCultivoTabla } from "./camas-cultivo-tabla";

const TODAS_LAS_CAMAS = "TODAS";

export function CamasCultivoGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [camaId, setCamaId] = useState("");

  // Se espera a que el usuario deje de escribir para no consultar en cada tecla.
  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const catalogo = useCamasCultivo();
  const camas = useCamasCultivo({
    q: busquedaDebounced || undefined,
    ubicacion: ubicacion || undefined,
    camaId: camaId ? Number(camaId) : undefined,
  });

  const lista = camas.data ?? [];
  const hayFiltros = Boolean(busquedaDebounced || ubicacion || camaId);
  const camasSinCargar = catalogo.isLoading || catalogo.isError;
  const listaCatalogo = catalogo.data ?? [];

  const camasDeLaUbicacion = ubicacion
    ? listaCatalogo.filter(
        (cama) => cama.ubicacion.toLowerCase() === ubicacion.toLowerCase(),
      )
    : listaCatalogo;

  const ubicacionesItems = INVERNADEROS.map((nombre) => ({
    value: nombre,
    label: nombre,
  }));

  const camasItems = [
    { value: TODAS_LAS_CAMAS, label: "Todas las camas" },
    ...camasDeLaUbicacion.map((cama) => ({
      value: String(cama.id),
      label: `${cama.codigo} — ${cama.ubicacion}`,
    })),
  ];

  const limpiar = () => {
    setBusqueda("");
    setUbicacion("");
    setCamaId("");
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
            <BreadcrumbPage>Gestión agrícola</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de camas de cultivo
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {camas.isLoading
              ? "Cargando camas de cultivo…"
              : `${lista.length} cama${
                  lista.length === 1 ? "" : "s"
                } de cultivo registrada${
                  lista.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/agricola/nuevo" />}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar cama
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filtro-busqueda-cama">Buscar</Label>

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="filtro-busqueda-cama"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por código o estado…"
                className="pl-9"
                maxLength={120}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-ubicacion-cama">Ubicación</Label>

            <Select
              items={ubicacionesItems}
              value={ubicacion !== "" ? ubicacion : null}
              onValueChange={(valor) => {
                const siguiente = (valor as string | null) ?? "";

                setUbicacion(siguiente);

                if (siguiente && camaId) {
                  const cama = listaCatalogo.find(
                    (item) => String(item.id) === camaId,
                  );

                  if (
                    cama &&
                    cama.ubicacion.toLowerCase() !== siguiente.toLowerCase()
                  ) {
                    setCamaId("");
                  }
                }
              }}
            >
              <SelectTrigger id="filtro-ubicacion-cama" className="w-full">
                <SelectValue placeholder="Invernadero 1 o 2" />
              </SelectTrigger>

              <SelectContent>
                {ubicacionesItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-cama-cultivo">Cama de cultivo</Label>

            <Select
              items={camasItems}
              value={
                camaId !== ""
                  ? camaId
                  : camasSinCargar
                    ? null
                    : TODAS_LAS_CAMAS
              }
              onValueChange={(valor) => {
                const elegida = (valor as string | null) ?? TODAS_LAS_CAMAS;

                setCamaId(elegida === TODAS_LAS_CAMAS ? "" : elegida);
              }}
              disabled={camasSinCargar}
            >
              <SelectTrigger id="filtro-cama-cultivo" className="w-full">
                <SelectValue
                  placeholder={
                    catalogo.isLoading
                      ? "Cargando camas…"
                      : catalogo.isError
                        ? "No se pudo cargar"
                        : "Todas las camas"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {camasItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hayFiltros ? (
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="ghost" onClick={limpiar}>
              Limpiar filtros
            </Button>
          </div>
        ) : null}
      </div>

      <CamasCultivoTabla
        cargando={camas.isLoading}
        error={camas.isError}
        camas={lista}
        vacioConFiltros={hayFiltros}
      />
    </section>
  );
}
