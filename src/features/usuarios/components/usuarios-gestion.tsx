"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ListFilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { ControlesPaginacion } from "@/components/controles-paginacion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ETIQUETA_ROL,
  ROLES_USUARIO,
  type RolUsuario,
} from "../models/usuario.model";
import type { PaginarUsuarios } from "../validacion/usuario.validacion";
import { useUsuarios } from "../hooks/hooks";

const PAGE_SIZE = 8;

const filtroRolItems = [
  { value: "todos", label: "Todos los roles" },
  ...ROLES_USUARIO.map((rol) => ({
    value: rol,
    label: ETIQUETA_ROL[rol],
  })),
];

const filtroActivoItems = [
  { value: "todos", label: "Todos" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const filtroOrdenItems = [
  { value: "ASC", label: "Nombre A–Z" },
  { value: "DESC", label: "Nombre Z–A" },
];

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

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
            <BreadcrumbPage>Usuarios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {usuarios.isLoading
            ? "Cargando usuarios…"
            : `${total} usuario${total === 1 ? "" : "s"} registrado${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <Button
        size="lg"
        className="h-10 w-full justify-center"
        nativeButton={false}
        render={<Link href="/dashboard/usuarios/nuevo" />}
      >
        <PlusIcon data-icon="inline-start" />
        Crear usuario
      </Button>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="h-10 pl-8"
            aria-label="Buscar usuarios"
          />
        </div>

        <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 gap-2"
              />
            }
          >
            <ListFilterIcon className="size-4" />
            Filtros
            {filtrosActivos > 0 ? (
              <Badge
                variant="secondary"
                className="h-5 min-w-5 justify-center rounded-full px-1.5"
              >
                {filtrosActivos}
              </Badge>
            ) : null}
          </SheetTrigger>
          <SheetContent side="right" className="gap-0">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refine el listado por rol, estado u orden.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 px-4">
              <Field>
                <FieldLabel htmlFor="filtro-rol">Rol</FieldLabel>
                <Select
                  items={filtroRolItems}
                  value={rol}
                  onValueChange={(valor) => {
                    setRol((valor as RolUsuario | "todos") ?? "todos");
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="filtro-rol" className="w-full">
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtroRolItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filtro-activo">Estado</FieldLabel>
                <Select
                  items={filtroActivoItems}
                  value={activo}
                  onValueChange={(valor) => {
                    setActivo(
                      (valor as "todos" | "true" | "false") ?? "todos",
                    );
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="filtro-activo" className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtroActivoItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filtro-orden">Orden</FieldLabel>
                <Select
                  items={filtroOrdenItems}
                  value={order}
                  onValueChange={(valor) => {
                    setOrder((valor as "ASC" | "DESC") ?? "ASC");
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="filtro-orden" className="w-full">
                    <SelectValue placeholder="Nombre A–Z" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtroOrdenItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={limpiarFiltros}
                disabled={filtrosActivos === 0}
              >
                Limpiar filtros
              </Button>
              <SheetClose render={<Button type="button" />}>
                Ver resultados
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Usuario
              </TableHead>
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Rol
              </TableHead>
              <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Estado
              </TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto size-8" />
                  </TableCell>
                </TableRow>
              ))}

            {usuarios.isError && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-destructive"
                >
                  No se pudieron cargar los usuarios. Verifique la conexión con
                  el servidor.
                </TableCell>
              </TableRow>
            )}

            {!usuarios.isLoading &&
              !usuarios.isError &&
              paginaUsuarios.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No hay usuarios que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              )}

            {paginaUsuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {iniciales(usuario.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {usuario.nombre}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {usuario.correo}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">
                    {ETIQUETA_ROL[usuario.rol]}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      usuario.activo
                        ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                    }
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          aria-label={`Acciones de ${usuario.nombre}`}
                        />
                      }
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/usuarios/${usuario.id}/editar`}
                          />
                        }
                      >
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
