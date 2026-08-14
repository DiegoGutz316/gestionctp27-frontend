"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HistoryIcon, PlusIcon, SearchIcon } from "lucide-react";
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
import type { MetaPaginacion } from "@/lib/paginacion";
import { getMensajeDeError } from "../api";
import { useCategorias, useInsumos } from "../hooks";
import {
  InsumosFiltrosSheet,
  TODAS_LAS_CATEGORIAS,
} from "./insumos-filtros-sheet";
import { InsumosTabla } from "./insumos-tabla";

const PAGE_SIZE = 8;

export function InventarioGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState(TODAS_LAS_CATEGORIAS);
  const [page, setPage] = useState(1);
  const [sheetAbierto, setSheetAbierto] = useState(false);

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const categorias = useCategorias();
  const insumos = useInsumos({
    nombre: busquedaDebounced || undefined,
    categoriaId:
      categoriaId === TODAS_LAS_CATEGORIAS ? undefined : Number(categoriaId),
  });

  const filtrosActivos = categoriaId === TODAS_LAS_CATEGORIAS ? 0 : 1;
  const hayFiltros =
    busquedaDebounced !== "" || categoriaId !== TODAS_LAS_CATEGORIAS;

  const lista = insumos.data ?? [];
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const paginaActual = Math.min(page, totalPaginas);

  // La API aún no pagina; se pagina en cliente para igualar Usuarios.
  const paginaInsumos = useMemo(() => {
    const inicio = (paginaActual - 1) * PAGE_SIZE;
    return lista.slice(inicio, inicio + PAGE_SIZE);
  }, [lista, paginaActual]);

  const meta = useMemo<MetaPaginacion | null>(() => {
    if (insumos.isLoading || insumos.isError) return null;
    return {
      total,
      pagina: paginaActual,
      limite: PAGE_SIZE,
      totalPaginas,
      tieneAnterior: paginaActual > 1,
      tieneSiguiente: paginaActual < totalPaginas,
    };
  }, [insumos.isError, insumos.isLoading, paginaActual, total, totalPaginas]);

  function limpiarFiltros() {
    setCategoriaId(TODAS_LAS_CATEGORIAS);
    setPage(1);
  }

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor);
    setPage(1);
  }

  function cambiarCategoria(valor: string) {
    setCategoriaId(valor);
    setPage(1);
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventario</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Inventario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {insumos.isLoading
            ? "Cargando insumos…"
            : `${total} insumo${total === 1 ? "" : "s"} registrado${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="h-10 w-full justify-center sm:flex-1"
          nativeButton={false}
          render={<Link href="/dashboard/inventario/entradas" />}
        >
          <HistoryIcon data-icon="inline-start" />
          Entradas
        </Button>
        <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
          <Button
            size="lg"
            className="h-10 w-full justify-center sm:flex-1"
            nativeButton={false}
            render={<Link href="/dashboard/inventario/nuevo" />}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar insumo
          </Button>
        </MostrarSiPuede>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => cambiarBusqueda(event.target.value)}
            placeholder="Buscar por nombre…"
            className="h-10 pl-8"
            aria-label="Buscar insumos"
            maxLength={120}
          />
        </div>

        <InsumosFiltrosSheet
          abierto={sheetAbierto}
          onAbiertoChange={setSheetAbierto}
          filtrosActivos={filtrosActivos}
          categoriaId={categoriaId}
          categorias={categorias.data ?? []}
          cargandoCategorias={categorias.isLoading}
          onCategoriaChange={cambiarCategoria}
          onLimpiar={limpiarFiltros}
        />
      </div>

      <InsumosTabla
        cargando={insumos.isLoading}
        error={insumos.isError}
        insumos={paginaInsumos}
        mensajeError={
          insumos.isError ? getMensajeDeError(insumos.error) : undefined
        }
        vacioConFiltros={hayFiltros}
      />

      {meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
