"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon, Home } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import type { RolUsuario } from "../models/usuario.model";
import type { PaginarUsuarios } from "../validacion/usuario.validacion";
import { useUsuarios } from "../hooks/hooks";
import { UsuariosFiltrosSheet } from "./usuarios-filtros-sheet";
import { UsuariosTabla } from "./usuarios-tabla";

const PAGE_SIZE = 8;

export function UsuariosGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");
  const [rol, setRol] = useState<RolUsuario | "todos">("todos");
  const [activo, setActivo] = useState<"todos" | "true" | "false">("todos");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = useState(1);
  const [sheetAbierto, setSheetAbierto] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBusquedaDebounced(busqueda.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [busqueda]);

  const filtrosActivos = useMemo(() => {
    let cantidad = 0;
    if (rol !== "todos") cantidad += 1;
    if (activo !== "todos") cantidad += 1;
    if (order !== "ASC") cantidad += 1;
    return cantidad;
  }, [rol, activo, order]);

  const filtros = useMemo<PaginarUsuarios>(() => {
    const resultado: PaginarUsuarios = {
      pagina: page,
      limite: PAGE_SIZE,
      order,
    };
    if (busquedaDebounced) resultado.q = busquedaDebounced;
    if (rol !== "todos") resultado.rol = rol;
    if (activo !== "todos") resultado.activo = activo === "true";
    return resultado;
  }, [busquedaDebounced, rol, activo, order, page]);

  const usuarios = useUsuarios(filtros);
  const total = usuarios.data?.meta.total ?? 0;
  const paginaUsuarios = usuarios.data?.datos ?? [];
  const meta = usuarios.data?.meta;

  function limpiarFiltros() {
    setRol("todos");
    setActivo("todos");
    setOrder("ASC");
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
            <BreadcrumbPage>Usuarios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {usuarios.isLoading
              ? "Cargando usuarios…"
              : `${total} usuario${total === 1 ? "" : "s"} registrado${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <AccionFlotante href="/dashboard/usuarios/nuevo" etiqueta="Crear usuario" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="pl-9"
            aria-label="Buscar usuarios"
          />
        </div>

        <UsuariosFiltrosSheet
          abierto={sheetAbierto}
          onAbiertoChange={setSheetAbierto}
          filtrosActivos={filtrosActivos}
          rol={rol}
          activo={activo}
          order={order}
          onRolChange={(valor) => {
            setRol(valor);
            setPage(1);
          }}
          onActivoChange={(valor) => {
            setActivo(valor);
            setPage(1);
          }}
          onOrderChange={(valor) => {
            setOrder(valor);
            setPage(1);
          }}
          onLimpiar={limpiarFiltros}
        />
      </div>

      <UsuariosTabla
        cargando={usuarios.isLoading}
        error={usuarios.isError}
        usuarios={paginaUsuarios}
      />

      {meta ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
