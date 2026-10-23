"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ListFilterIcon, SearchIcon } from "lucide-react";
import { AccionFlotante } from "@/components/accion-flotante";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  ESTADOS_PERIODO,
  ETIQUETA_ESTADO_PERIODO,
  type EstadoPeriodo,
} from "../models/periodo.model";
import { usePeriodos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";
import { PeriodosTabla } from "./periodos-tabla";

const PAGE_SIZE = 8;
const TODOS = "todos";

const filtroEstadoItems = [
  { value: TODOS, label: "Todos los estados" },
  ...ESTADOS_PERIODO.map((estado) => ({
    value: estado,
    label: ETIQUETA_ESTADO_PERIODO[estado],
  })),
];

export function PeriodosGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoPeriodo | "todos">(TODOS);
  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const periodos = usePeriodos({
    q: busquedaDebounced || undefined,
    estado: estado === TODOS ? undefined : estado,
    pagina: page,
    limite: PAGE_SIZE,
  });
  const periodosAbiertos = usePeriodos({
    estado: "ABIERTO",
    pagina: 1,
    limite: 1,
  });
  const periodoAbierto = periodosAbiertos.data?.datos[0];

  const hayFiltros = busquedaDebounced !== "" || estado !== TODOS;
  const total = periodos.data?.meta.total ?? 0;
  const meta = periodos.data?.meta;

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
            <BreadcrumbPage>Periodos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Periodos
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {periodos.isLoading
              ? "Cargando periodos…"
              : `${total} periodo${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
          {periodoAbierto ? (
            <Button
              className="w-full sm:w-auto"
              nativeButton={false}
              render={
                <Link
                  href={`/dashboard/libro-caja/periodos/${periodoAbierto.id}`}
                />
              }
            >
              Ver periodo abierto
            </Button>
          ) : (
            <AccionFlotante
              href="/dashboard/libro-caja/periodos/nuevo"
              etiqueta="Abrir periodo"
            />
          )}
        </MostrarSiPuede>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => cambiarBusqueda(event.target.value)}
            placeholder="Buscar por nombre…"
            className="pl-9"
            aria-label="Buscar periodos"
            maxLength={150}
          />
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button type="button" variant="outline" className="shrink-0 gap-2 md:hidden" />
            }
          >
            <ListFilterIcon className="size-4" />
            Filtros
            {estado !== TODOS ? (
              <Badge variant="secondary" className="h-5 min-w-5 justify-center rounded-full px-1.5">
                1
              </Badge>
            ) : null}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros</DialogTitle>
              <DialogDescription>Filtre los periodos por estado.</DialogDescription>
            </DialogHeader>
            <div>
              <Select
                items={filtroEstadoItems}
                value={estado}
                onValueChange={(valor) => {
                  setEstado((valor as EstadoPeriodo | "todos") ?? TODOS);
                  setPage(1);
                }}
              >
                <SelectTrigger id="filtro-estado-periodo-movil" className="w-full">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  {filtroEstadoItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>Ver resultados</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Select
          items={filtroEstadoItems}
          value={estado}
          onValueChange={(valor) => {
            setEstado((valor as EstadoPeriodo | "todos") ?? TODOS);
            setPage(1);
          }}
        >
          <SelectTrigger
            id="filtro-estado-periodo"
            aria-label="Filtrar por estado"
            className="hidden w-48 shrink-0 md:flex"
          >
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            {filtroEstadoItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PeriodosTabla
        cargando={periodos.isLoading}
        error={periodos.isError}
        periodos={periodos.data?.datos ?? []}
        mensajeError={
          periodos.isError ? getMensajeDeError(periodos.error) : undefined
        }
        vacioConFiltros={hayFiltros}
      />

      {meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPage} />
      ) : null}
    </section>
  );
}
