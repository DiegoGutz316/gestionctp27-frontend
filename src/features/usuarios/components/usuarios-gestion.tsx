"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  type FiltrarUsuarios,
  type RolUsuario,
} from "../models/usuario.model";
import { useUsuarios } from "../hooks/hooks";

const PAGE_SIZE = 8;

const filtroRolItems = [
  { value: "todos", label: "Todos los roles" },
  ...ROLES_USUARIO.map((rol) => ({
    value: rol,
    label: ETIQUETA_ROL[rol],
  })),
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBusquedaDebounced(busqueda.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [busqueda]);

  const filtros = useMemo<FiltrarUsuarios>(() => {
    const resultado: FiltrarUsuarios = {};
    if (busquedaDebounced) resultado.busqueda = busquedaDebounced;
    if (rol !== "todos") resultado.rol = rol;
    return resultado;
  }, [busquedaDebounced, rol]);

  const usuarios = useUsuarios(filtros);
  const total = usuarios.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginaActual = Math.min(page, totalPages);

  const paginaUsuarios = useMemo(() => {
    const inicio = (paginaActual - 1) * PAGE_SIZE;
    return (usuarios.data ?? []).slice(inicio, inicio + PAGE_SIZE);
  }, [usuarios.data, paginaActual]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <Select
          items={filtroRolItems}
          value={rol}
          onValueChange={(valor) => {
            setRol((valor as RolUsuario | "todos") ?? "todos");
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-full sm:w-40">
            <ListFilterIcon className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Filtros" />
          </SelectTrigger>
          <SelectContent>
            {filtroRolItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {total > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="default"
                disabled={paginaActual <= 1}
                onClick={() => setPage((actual) => Math.max(1, actual - 1))}
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Anterior
              </Button>
            </PaginationItem>
            {pageNumbers.map((numero) => (
              <PaginationItem key={numero}>
                <Button
                  variant={numero === paginaActual ? "outline" : "ghost"}
                  size="icon"
                  className={
                    numero === paginaActual
                      ? "border-foreground/20 bg-background"
                      : undefined
                  }
                  onClick={() => setPage(numero)}
                  aria-current={numero === paginaActual ? "page" : undefined}
                >
                  {numero}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="ghost"
                size="default"
                disabled={paginaActual >= totalPages}
                onClick={() =>
                  setPage((actual) => Math.min(totalPages, actual + 1))
                }
              >
                Siguiente
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
