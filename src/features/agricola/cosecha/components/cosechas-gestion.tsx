"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, WheatIcon } from "lucide-react";

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
import {
  BarraFiltrosAgricolas,
  type EtiquetaFiltro,
} from "@/features/agricola/components/barra-filtros-agricolas";
import { useCamasCultivo } from "@/features/agricola/hooks/cama-cultivo-hooks";
import { INVERNADEROS } from "@/features/agricola/validacion/cama-cultivo.validacion";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fechaHoyCR } from "@/lib/fechas";

import { useCosechas } from "../hooks/cosecha-hooks";
import {
  formatearCantidadConUnidad,
  resumirTotales,
} from "../models/cosecha.model";
import { rangosRapidos } from "../models/rangos-fecha";
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

/** Rango escrito a mano. No calcula fechas: las pone la persona en Desde y Hasta. */
const PERIODO_PERSONALIZADO = "personalizado";

export function CosechasGestion() {
  const [cultivo, setCultivo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [camaId, setCamaId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [periodo, setPeriodo] = useState(PERIODO_PERSONALIZADO);
  const [pagina, setPagina] = useState(1);

  // Las camas salen del endpoint que ya usa la pantalla de camas. Se listan
  // todas, incluidas las que aún no tienen cosechas: una lista que cambia
  // según los datos es menos predecible que una fija.
  const camas = useCamasCultivo();

  // Un fallo de red también deja la lista vacía. Si no se distinguen, el
  // selector diría «Todas las camas» —como si el filtro estuviera listo y sin
  // aplicar— cuando en realidad no se pudo cargar nada.
  const camasSinCargar = camas.isLoading || camas.isError;

  const listaCamas = camas.data ?? [];

  const ubicacionesItems = INVERNADEROS.map((nombre) => ({
    value: nombre,
    label: nombre,
  }));

  const camasDeLaUbicacion = ubicacion
    ? listaCamas.filter(
        (cama) => cama.ubicacion.toLowerCase() === ubicacion.toLowerCase(),
      )
    : listaCamas;

  const camasItems = [
    { value: TODAS_LAS_CAMAS, label: "Todas las camas" },
    ...camasDeLaUbicacion.map((cama) => ({
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
      ubicacion: ubicacion || undefined,
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
  const porCultivo = consulta.data?.totalesPorCultivo ?? [];
  const hayFiltros = Boolean(
    cultivoDebounced || ubicacion || camaId || desde || hasta,
  );

  const periodosItems = [
    { value: PERIODO_PERSONALIZADO, label: "Personalizado" },
    ...rangosRapidos.map((rango) => ({
      value: rango.id,
      label: rango.etiqueta,
    })),
  ];

  /** Escribir una fecha a mano deja el período en Personalizado. */
  const cambiarFecha = (ponerFecha: (valor: string) => void, valor: string) => {
    ponerFecha(valor);
    setPeriodo(PERIODO_PERSONALIZADO);
    setPagina(1);
  };

  /**
   * Un período predefinido rellena Desde y Hasta con el mismo cálculo que
   * usaban los atajos. Personalizado no toca las fechas: las escribe la persona.
   */
  const aplicarPeriodo = (id: string) => {
    if (id === PERIODO_PERSONALIZADO) {
      setPeriodo(PERIODO_PERSONALIZADO);
      setPagina(1);

      return;
    }

    const rango = rangosRapidos.find((item) => item.id === id);

    if (!rango) return;

    const valores = rango.calcular();

    setDesde(valores.desde);
    setHasta(valores.hasta);
    setPeriodo(id);
    setPagina(1);
  };

  const limpiar = () => {
    setCultivo("");
    setUbicacion("");
    setCamaId("");
    setDesde("");
    setHasta("");
    setPeriodo(PERIODO_PERSONALIZADO);
    setPagina(1);
  };

  const camaElegida = listaCamas.find((cama) => String(cama.id) === camaId);
  const etiquetas: EtiquetaFiltro[] = [];

  if (ubicacion) {
    etiquetas.push({
      id: "ubicacion",
      etiqueta: ubicacion,
      onQuitar: () => {
        setUbicacion("");
        setPagina(1);
      },
    });
  }

  if (camaId) {
    etiquetas.push({
      id: "cama",
      etiqueta: camaElegida?.codigo ?? "Cama",
      onQuitar: () => {
        setCamaId("");
        setPagina(1);
      },
    });
  }

  if (periodo !== PERIODO_PERSONALIZADO) {
    const rango = rangosRapidos.find((item) => item.id === periodo);

    etiquetas.push({
      id: "periodo",
      etiqueta: rango?.etiqueta ?? "Período",
      onQuitar: () => {
        setPeriodo(PERIODO_PERSONALIZADO);
        setDesde("");
        setHasta("");
        setPagina(1);
      },
    });
  } else {
    if (desde) {
      etiquetas.push({
        id: "desde",
        etiqueta: `Desde ${formatearFecha(desde)}`,
        onQuitar: () => {
          setDesde("");
          setPagina(1);
        },
      });
    }

    if (hasta) {
      etiquetas.push({
        id: "hasta",
        etiqueta: `Hasta ${formatearFecha(hasta)}`,
        onQuitar: () => {
          setHasta("");
          setPagina(1);
        },
      });
    }
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

          {/* Cuanto se produjo de cada cultivo, sin mezclar unidades. */}
          {porCultivo.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {porCultivo.map((total) => (
                <li
                  key={`${total.cultivo}-${total.unidadMedida}`}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  <span className="font-medium text-foreground">
                    {total.cultivo}
                  </span>{" "}
                  {formatearCantidadConUnidad(total.cantidad, total.unidadMedida)}
                </li>
              ))}
            </ul>
          ) : null}
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

      <BarraFiltrosAgricolas
        busqueda={{
          id: "filtro-cultivo",
          value: cultivo,
          onChange: (valor) => {
            setCultivo(valor);
            setPagina(1);
          },
          placeholder: "Buscar cultivo...",
          maxLength: 120,
        }}
        etiquetas={etiquetas}
        onLimpiar={limpiar}
        aviso={
          camas.isError || problemaFechas ? (
            <div className="space-y-2">
              {camas.isError ? (
                <p className="text-sm text-destructive">
                  {getMensajeDeError(camas.error)}
                </p>
              ) : null}
              {problemaFechas ? (
                <p role="alert" className="text-sm text-destructive">
                  {problemaFechas}
                </p>
              ) : null}
            </div>
          ) : null
        }
      >
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="filtro-ubicacion" className="h-5 leading-5">
              Ubicación
            </Label>

            <Select
              items={ubicacionesItems}
              value={ubicacion !== "" ? ubicacion : null}
              onValueChange={(valor) => {
                const siguiente = (valor as string | null) ?? "";

                setUbicacion(siguiente);

                if (siguiente && camaId) {
                  const cama = listaCamas.find(
                    (item) => String(item.id) === camaId,
                  );

                  if (
                    cama &&
                    cama.ubicacion.toLowerCase() !== siguiente.toLowerCase()
                  ) {
                    setCamaId("");
                  }
                }

                setPagina(1);
              }}
            >
              <SelectTrigger id="filtro-ubicacion" className="h-9 w-full">
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

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="filtro-cama" className="h-5 leading-5">
              Cama de cultivo
            </Label>

            <Select
              items={camasItems}
              // Sin datos el valor se deja sin fijar a propósito: es lo que
              // hace que el trigger muestre el marcador de posición en vez de
              // una opción válida que aquí sería mentira.
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
                setPagina(1);
              }}
              disabled={camasSinCargar}
            >
              <SelectTrigger id="filtro-cama" className="h-9 w-full">
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

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="filtro-desde" className="h-5 leading-5">
              Desde
            </Label>

            <Input
              id="filtro-desde"
              type="date"
              className="h-9 max-h-9 w-full min-w-0 py-0 leading-9 [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0"
              min={FECHA_MINIMA}
              max={hasta || hoy}
              value={desde}
              aria-invalid={fueraDeRango(desde) || invertido}
              onChange={(event) => cambiarFecha(setDesde, event.target.value)}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="filtro-hasta" className="h-5 leading-5">
              Hasta
            </Label>

            <Input
              id="filtro-hasta"
              type="date"
              className="h-9 max-h-9 w-full min-w-0 py-0 leading-9 [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0"
              min={desde || FECHA_MINIMA}
              max={hoy}
              value={hasta}
              aria-invalid={fueraDeRango(hasta) || invertido}
              onChange={(event) => cambiarFecha(setHasta, event.target.value)}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="filtro-periodo" className="h-5 leading-5">
              Período
            </Label>

            <Select
              items={periodosItems}
              value={periodo}
              onValueChange={(valor) => {
                aplicarPeriodo((valor as string | null) ?? PERIODO_PERSONALIZADO);
              }}
            >
              <SelectTrigger id="filtro-periodo" className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {periodosItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      </BarraFiltrosAgricolas>

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
