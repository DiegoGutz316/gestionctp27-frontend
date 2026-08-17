"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon, Home } from "lucide-react";
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
import type {
  Departamento,
  TipoProducto,
  Ubicacion,
} from "../models/producto.model";
import { useProductos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/producto.service";
import { ProductosFiltrosSheet, TODOS } from "./productos-filtros-sheet";
import { ProductosTabla } from "./productos-tabla";

const PAGE_SIZE = 8;

export function ProductosGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoProducto, setTipoProducto] = useState<TipoProducto | "todos">(
    TODOS,
  );
  const [departamento, setDepartamento] = useState<Departamento | "todos">(
    TODOS,
  );
  const [ubicacion, setUbicacion] = useState<Ubicacion | "todos">(TODOS);
  const [page, setPage] = useState(1);
  const [sheetAbierto, setSheetAbierto] = useState(false);

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const productos = useProductos({
    nombre: busquedaDebounced || undefined,
    tipoProducto: tipoProducto === TODOS ? undefined : tipoProducto,
    departamento: departamento === TODOS ? undefined : departamento,
    ubicacion: ubicacion === TODOS ? undefined : ubicacion,
  });

  const filtrosActivos = [tipoProducto, departamento, ubicacion].filter(
    (valor) => valor !== TODOS,
  ).length;
  const hayFiltros = busquedaDebounced !== "" || filtrosActivos > 0;

  const total = productos.data?.length ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const paginaActual = Math.min(page, totalPaginas);

  // La API no pagina; se pagina en cliente para igualar Usuarios.
  const paginaProductos = useMemo(() => {
    const items = productos.data ?? [];
    const inicio = (paginaActual - 1) * PAGE_SIZE;
    return items.slice(inicio, inicio + PAGE_SIZE);
  }, [productos.data, paginaActual]);

  const meta = useMemo<MetaPaginacion | null>(() => {
    if (productos.isLoading || productos.isError) return null;
    return {
      total,
      pagina: paginaActual,
      limite: PAGE_SIZE,
      totalPaginas,
      tieneAnterior: paginaActual > 1,
      tieneSiguiente: paginaActual < totalPaginas,
    };
  }, [productos.isError, productos.isLoading, paginaActual, total, totalPaginas]);

  function limpiarFiltros() {
    setTipoProducto(TODOS);
    setDepartamento(TODOS);
    setUbicacion(TODOS);
    setPage(1);
  }

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
            <BreadcrumbPage>Inventario</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de Inventario
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {productos.isLoading
              ? "Cargando productos…"
              : `${total} producto${total === 1 ? "" : "s"} registrado${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/inventario/nuevo" />}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar producto
          </Button>
        </MostrarSiPuede>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => cambiarBusqueda(event.target.value)}
            placeholder="Buscar por nombre…"
            className="pl-9"
            aria-label="Buscar productos"
            maxLength={120}
          />
        </div>

        <ProductosFiltrosSheet
          abierto={sheetAbierto}
          onAbiertoChange={setSheetAbierto}
          filtrosActivos={filtrosActivos}
          tipoProducto={tipoProducto}
          departamento={departamento}
          ubicacion={ubicacion}
          onTipoProductoChange={(valor) => {
            setTipoProducto(valor);
            setPage(1);
          }}
          onDepartamentoChange={(valor) => {
            setDepartamento(valor);
            setPage(1);
          }}
          onUbicacionChange={(valor) => {
            setUbicacion(valor);
            setPage(1);
          }}
          onLimpiar={limpiarFiltros}
        />
      </div>

      <ProductosTabla
        cargando={productos.isLoading}
        error={productos.isError}
        productos={paginaProductos}
        mensajeError={
          productos.isError ? getMensajeDeError(productos.error) : undefined
        }
        vacioConFiltros={hayFiltros}
      />

      {meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
