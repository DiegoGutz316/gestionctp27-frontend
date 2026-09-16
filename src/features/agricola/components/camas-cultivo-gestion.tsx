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
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useCamasCultivo } from "../hooks/cama-cultivo-hooks";
import { CamasCultivoTabla } from "./camas-cultivo-tabla";

export function CamasCultivoGestion() {
  const [busqueda, setBusqueda] = useState("");

  // Se espera a que el usuario deje de escribir para no consultar en cada tecla.
  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const camas = useCamasCultivo({
    q: busquedaDebounced || undefined,
  });

  const lista = camas.data ?? [];
  const hayFiltros = busquedaDebounced !== "";

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

      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por código o estado…"
          className="pl-9"
          aria-label="Buscar camas de cultivo"
          maxLength={120}
        />
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
