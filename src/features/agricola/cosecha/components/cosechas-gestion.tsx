"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, SearchIcon, WheatIcon } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AgricolaVistasNav } from "@/features/agricola/components/agricola-vistas-nav";
import { useCamasCultivo } from "@/features/agricola/hooks/cama-cultivo-hooks";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fechaHoyCR } from "@/lib/fechas";

import { useCosechas } from "../hooks/cosecha-hooks";
import { resumirTotales } from "../models/cosecha.model";
import {
  rangosRapidos,
  resolverAtajoActivo,
  type RangoFechas,
} from "../models/rangos-fecha";
import { getMensajeDeError } from "../servicios/cosecha.service";
import { CosechasTabla } from "./cosechas-tabla";

/**
 * Piso del filtro de fechas. El colegio no tiene cosechas anteriores, y sirve
 * para descartar los años a medio escribir.
 */
const FECHA_MINIMA = "1900-01-01";

/**
 * Opción «sin filtrar» del selector de camas. Sin ella, una vez elegida una
 * cama solo se podría quitar con «Limpiar filtros», que borra también el
 * cultivo y las fechas. Mismo recurso que usa la consulta de producción.
 */
const TODAS_LAS_CAMAS = "TODAS";

export function CosechasGestion() {
  const [cultivo, setCultivo] = useState("");
  const [camaId, setCamaId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [pagina, setPagina] = useState(1);

  // Cuál de los atajos tocó la persona. Se guarda el id y no solo las fechas
  // porque hay días en que dos atajos dan el mismo rango.
  const [atajoSeleccionado, setAtajoSeleccionado] = useState<string | null>(
    null,
  );

  // Las camas salen del endpoint que ya usa la pantalla de camas. Se listan
  // todas, incluidas las que aún no tienen cosechas: una lista que cambia
  // según los datos es menos predecible que una fija.
  const camas = useCamasCultivo();

  const camasItems = [
    { value: TODAS_LAS_CAMAS, label: "Todas las camas" },
    ...(camas.data ?? []).map((cama) => ({
      value: String(cama.id),
      label: `${cama.codigo} — ${cama.ubicacion}`,
    })),
  ];

  // Se espera a que el usuario deje de escribir para no consultar por tecla.
  const cultivoDebounced = useDebouncedValue(cultivo.trim(), 300);

  const hoy = fechaHoyCR();

  const invertido = Boolean(desde && hasta && desde > hasta);

  /**
   * El `min`/`max` de los campos nativos no impide escribir: Chrome deja el
   * valor puesto y solo lo marca inválido, así que hay que comprobarlo aquí.
   *
   * El piso no es un capricho: al teclear el año dígito a dígito el campo pasa
   * por años como 0002 o 0202, que son fechas pasadas válidas para el
   * servidor, y cada tecla salía en una consulta que no significaba nada.
   */
  const fueraDeRango = (valor: string) =>
    Boolean(valor) && (valor > hoy || valor < FECHA_MINIMA);

  /**
   * Qué anda mal en las fechas, si algo anda mal. Mientras haya un problema
   * no se consulta: el backend rechaza estas fechas con un 400 y el usuario
   * vería un error de servidor en vez de entender qué escribió mal.
   */
  const problemaFechas =
    (desde && desde > hoy) || (hasta && hasta > hoy)
      ? "Las fechas no pueden ser futuras."
      : (desde && desde < FECHA_MINIMA) || (hasta && hasta < FECHA_MINIMA)
        ? `Ingrese un año a partir de ${FECHA_MINIMA.slice(0, 4)}.`
        : invertido
          ? "La fecha inicial no puede ser posterior a la fecha final."
          : null;

  const consulta = useCosechas(
    {
      cultivo: cultivoDebounced || undefined,
      camaId: camaId ? Number(camaId) : undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      pagina,
    },
    { habilitada: !problemaFechas },
  );

  const cosechas = consulta.data?.datos ?? [];
  const meta = consulta.data?.meta;
  const total = meta?.total ?? 0;

  // Lo cosechado en todo el filtro, no en la página visible: es la cifra que
  // le importa a un docente, y contar registros no se la da.
  const totales = resumirTotales(consulta.data?.totales ?? []);
  const hayFiltros = Boolean(cultivoDebounced || camaId || desde || hasta);
  const atajoActivo = resolverAtajoActivo(atajoSeleccionado, desde, hasta);

  /** Escribir una fecha a mano deja de ser «el atajo que toqué». */
  const cambiarFecha = (ponerFecha: (valor: string) => void, valor: string) => {
    ponerFecha(valor);
    setAtajoSeleccionado(null);
    setPagina(1);
  };

  /**
   * Los atajos funcionan como interruptor: volver a tocar el que está
   * aplicado quita el filtro de fechas en vez de volver a ponerlo, que es lo
   * que el usuario espera de un botón que se ve encendido.
   *
   * Solo se limpian las fechas. El cultivo es otro filtro y no se toca.
   */
  const alternarRango = (id: string, valores: RangoFechas) => {
    if (atajoActivo === id) {
      setDesde("");
      setHasta("");
      setAtajoSeleccionado(null);
      setPagina(1);

      return;
    }

    setDesde(valores.desde);
    setHasta(valores.hasta);
    setAtajoSeleccionado(id);
    setPagina(1);
  };

  const limpiar = () => {
    setCultivo("");
    setCamaId("");
    setDesde("");
    setHasta("");
    setAtajoSeleccionado(null);
    setPagina(1);
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
            <BreadcrumbLink render={<Link href="/dashboard/agricola" />}>
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Cosechas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cosechas registradas
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {problemaFechas
              ? "Corrija las fechas para ver el historial."
              : consulta.isLoading
                ? "Cargando cosechas…"
                : consulta.isError && cosechas.length === 0
                  ? "No se pudo consultar el historial."
                  : `${total} cosecha${
                      total === 1 ? "" : "s"
                    } encontrada${total === 1 ? "" : "s"}${
                      totales ? ` · ${totales}` : ""
                    }`}
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/agricola/cosechas/nueva" />}
          >
            <WheatIcon data-icon="inline-start" />
            Registrar cosecha
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="filtro-cultivo">Cultivo</Label>

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="filtro-cultivo"
                value={cultivo}
                onChange={(event) => {
                  setCultivo(event.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar por cultivo…"
                className="pl-9"
                maxLength={120}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-cama">Cama de cultivo</Label>

            <Select
              items={camasItems}
              value={camaId === "" ? TODAS_LAS_CAMAS : camaId}
              onValueChange={(valor) => {
                const elegida = (valor as string | null) ?? TODAS_LAS_CAMAS;

                setCamaId(elegida === TODAS_LAS_CAMAS ? "" : elegida);
                setPagina(1);
              }}
              disabled={camas.isLoading || camas.isError}
            >
              <SelectTrigger id="filtro-cama" className="w-full">
                <SelectValue
                  placeholder={
                    camas.isLoading
                      ? "Cargando camas…"
                      : camas.isError
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

          <div className="space-y-2">
            <Label htmlFor="filtro-desde">Desde</Label>

            <Input
              id="filtro-desde"
              type="date"
              min={FECHA_MINIMA}
              max={hasta || hoy}
              value={desde}
              aria-invalid={fueraDeRango(desde) || invertido}
              onChange={(event) => cambiarFecha(setDesde, event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-hasta">Hasta</Label>

            <Input
              id="filtro-hasta"
              type="date"
              min={desde || FECHA_MINIMA}
              max={hoy}
              value={hasta}
              aria-invalid={fueraDeRango(hasta) || invertido}
              onChange={(event) => cambiarFecha(setHasta, event.target.value)}
            />
          </div>
        </div>

        {problemaFechas ? (
          <p role="alert" className="text-sm text-destructive">
            {problemaFechas}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="mr-1 text-sm text-muted-foreground">Período:</span>

          {rangosRapidos.map((rango) => {
            const activo = atajoActivo === rango.id;

            return (
              <Button
                key={rango.id}
                type="button"
                size="sm"
                variant={activo ? "default" : "outline"}
                aria-pressed={activo}
                title={activo ? "Tocar de nuevo para quitar el filtro" : undefined}
                onClick={() => alternarRango(rango.id, rango.calcular())}
              >
                {rango.etiqueta}
              </Button>
            );
          })}

          {hayFiltros ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={limpiar}
            >
              Limpiar filtros
            </Button>
          ) : null}
        </div>
      </div>

      {problemaFechas ? (
        <div className="rounded-xl border bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-sm">
          Revise las fechas del filtro para ver el historial.
        </div>
      ) : (
        <CosechasTabla
          cargando={consulta.isLoading}
          mensajeError={
            consulta.isError ? getMensajeDeError(consulta.error) : null
          }
          cosechas={cosechas}
          hayFiltros={hayFiltros}
        />
      )}

      {!problemaFechas && meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPagina} />
      ) : null}
    </section>
  );
}
