"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, PlusIcon, SearchIcon } from "lucide-react";
import { AccionFlotante } from "@/components/accion-flotante";
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
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDepartamentos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/departamento.service";
import { DepartamentosTabla } from "./departamentos-tabla";

const PAGE_SIZE = 8;

export function DepartamentosGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const departamentos = useDepartamentos({
    q: busquedaDebounced || undefined,
    pagina: page,
    limite: PAGE_SIZE,
  });

  const hayFiltros = busquedaDebounced !== "";
  const total = departamentos.data?.meta.total ?? 0;
  const meta = departamentos.data?.meta;

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor);
    setPage(1);
  }

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
            <BreadcrumbLink render={<Link href="/dashboard/libro-caja" />}>
              Libro de caja
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Departamentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Departamentos
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {departamentos.isLoading
              ? "Cargando departamentos…"
              : `${total} unidad${total === 1 ? "" : "es"} activa${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
          <Button
            className="hidden md:inline-flex"
            nativeButton={false}
            render={
              <Link href="/dashboard/libro-caja/departamentos/nuevo" />
            }
          >
            <PlusIcon data-icon="inline-start" />
            Registrar departamento
          </Button>
          <AccionFlotante
            href="/dashboard/libro-caja/departamentos/nuevo"
            etiqueta="Registrar departamento"
          />
        </MostrarSiPuede>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => cambiarBusqueda(event.target.value)}
            placeholder="Buscar por nombre de unidad o tipo de actividad…"
            className="pl-9"
            aria-label="Buscar departamentos"
            maxLength={150}
          />
        </div>
      </div>

      <DepartamentosTabla
        cargando={departamentos.isLoading}
        error={departamentos.isError}
        departamentos={departamentos.data?.datos ?? []}
        mensajeError={
          departamentos.isError
            ? getMensajeDeError(departamentos.error)
            : undefined
        }
        vacioConFiltros={hayFiltros}
      />

      {meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
