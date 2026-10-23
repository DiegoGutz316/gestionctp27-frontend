"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvisosCalendario } from "@/features/comunicacion/hooks/aviso-hooks";
import { urlFlyerAviso } from "@/features/comunicacion/servicios/aviso.service";
import type {
  AvisoPublico,
  CategoriaAviso,
} from "@/features/comunicacion/validacion/aviso.validacion";
import { cn } from "@/lib/utils";

import {
  agruparAvisosPorFecha,
  avisosVisiblesEnCalendario,
  claveDesdeDate,
  claveFechaValida,
  desplazarMes,
  DIAS_SEMANA,
  etiquetaMes,
  fechaCortaAviso,
  fechaLargaAviso,
  mesDeClave,
  mesTieneAvisos,
  proximosAvisos,
  semanasDelMes,
} from "../calendario-institucional";
import { categoriaDeAviso, etiquetaCategoria } from "../aviso-publico";
import { AvisoPublicoDialog } from "./aviso-publico-dialog";
import { BotonEscuchar } from "./boton-escuchar";

const ESTILO_CATEGORIA: Record<CategoriaAviso, { badge: string; punto: string }> =
  {
    ACADEMICOS: {
      badge: "bg-oliva/10 text-oliva-profundo",
      punto: "bg-oliva",
    },
    EVENTOS: {
      badge: "bg-oro/18 text-oro-profundo",
      punto: "bg-oro",
    },
    COMUNIDAD: {
      badge: "bg-salvia/18 text-oliva-profundo",
      punto: "bg-salvia",
    },
    ADMINISTRATIVOS: {
      badge: "bg-tinta/6 text-tinta/70",
      punto: "bg-tinta/35",
    },
  };

const SOMBRA =
  "shadow-[0_12px_32px_-26px_rgba(37,38,36,0.7)] ring-1 ring-tinta/8";

export function LandingCalendario() {
  const consulta = useAvisosCalendario();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  const avisos = useMemo(
    () => avisosVisiblesEnCalendario(consulta.data ?? []),
    [consulta.data],
  );

  const cargando = !montado || consulta.isPending;

  let cuerpo: ReactNode;
  let estado: string;
  if (cargando) {
    cuerpo = <EsqueletoCalendario />;
    estado = MENSAJE_CARGANDO;
  } else if (consulta.isError) {
    cuerpo = (
      <ErrorCalendario
        cargando={consulta.isFetching}
        onReintentar={() => void consulta.refetch()}
      />
    );
    estado = MENSAJE_ERROR;
  } else {
    cuerpo = <CalendarioCargado avisos={avisos} />;
    estado =
      avisos.length === 0
        ? MENSAJE_SIN_AVISOS
        : `Calendario cargado: ${avisos.length} ${
            avisos.length === 1 ? "actividad publicada" : "actividades publicadas"
          }.`;
  }

  // Lo que lee el botón de audio: los avisos ya cargados o el estado actual.
  function textoParaLeer(): string {
    const encabezado = `${TITULO}. ${DESCRIPCION}`;
    if (cargando) return `${encabezado} ${MENSAJE_CARGANDO}`;
    if (consulta.isError) return `${encabezado} ${MENSAJE_ERROR}`;
    if (avisos.length === 0) return `${encabezado} ${MENSAJE_SIN_AVISOS}`;

    const hoy = claveDesdeDate(new Date());
    const proximos = avisos
      .map((aviso) => ({ aviso, clave: claveFechaValida(aviso.fecha) ?? "" }))
      .filter(({ clave }) => clave >= hoy)
      .sort((a, b) => a.clave.localeCompare(b.clave))
      .map(({ aviso }) => aviso);
    if (proximos.length === 0) {
      return `${encabezado} No hay actividades próximas por ahora.`;
    }
    return [
      encabezado,
      `Próximas actividades: ${proximos.length}.`,
      ...proximos.map(
        (aviso) => `${fechaLargaAviso(aviso.fecha)}. ${aviso.titulo}. ${aviso.descripcion}`,
      ),
    ].join(" ");
  }

  return (
    <section
      id="calendario"
      aria-labelledby="calendario-titulo"
      className="scroll-mt-24 bg-landing py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Encabezado obtenerTexto={textoParaLeer} />
        {/* Fuera del contenedor con aria-busy para que el anuncio no se silencie. */}
        <p role="status" className="sr-only">
          {estado}
        </p>
        <div aria-busy={cargando}>{cuerpo}</div>
      </div>
    </section>
  );
}

const TITULO = "Calendario Institucional";
const DESCRIPCION =
  "Consulta actividades, comunicados y eventos importantes del colegio.";
const MENSAJE_CARGANDO = "Cargando el calendario institucional.";
const MENSAJE_ERROR =
  "No se pudo cargar el calendario institucional. Verifica la conexión e inténtalo nuevamente.";
const MENSAJE_SIN_AVISOS = "Aún no hay actividades publicadas.";

function Encabezado({ obtenerTexto }: { obtenerTexto: () => string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-oliva text-sobre-oliva">
        <CalendarDays className="size-5" aria-hidden />
        {/* Bajo el icono y fuera del flujo: no angosta el texto ni cambia la altura. */}
        <BotonEscuchar
          etiqueta="Calendario"
          obtenerTexto={obtenerTexto}
          className="absolute top-full left-1/2 mt-2 -translate-x-1/2"
        />
      </div>
      <div>
        <h2
          id="calendario-titulo"
          className="text-3xl font-semibold tracking-tight text-tinta sm:text-4xl"
        >
          {TITULO}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-tinta/60 sm:text-base">
          {DESCRIPCION}
        </p>
      </div>
    </div>
  );
}

function CalendarioCargado({ avisos }: { avisos: AvisoPublico[] }) {
  const hoy = useMemo(() => new Date(), []);
  const hoyClave = useMemo(() => claveDesdeDate(hoy), [hoy]);
  const porFecha = useMemo(() => agruparAvisosPorFecha(avisos), [avisos]);
  const proximos = useMemo(
    () => proximosAvisos(avisos, hoyClave, 3),
    [avisos, hoyClave],
  );

  const [mesVisible, setMesVisible] = useState(
    () => new Date(hoy.getFullYear(), hoy.getMonth(), 1),
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyClave);
  const [avisoId, setAvisoId] = useState<number | null>(null);
  const [avisoAbierto, setAvisoAbierto] = useState<AvisoPublico | null>(null);

  const eventos = porFecha.get(fechaSeleccionada) ?? [];
  const avisoActivo =
    eventos.find((aviso) => aviso.id === avisoId) ?? eventos[0] ?? null;
  const mesVacio = avisos.length > 0 && !mesTieneAvisos(porFecha, mesVisible);

  function seleccionarDia(clave: string) {
    setFechaSeleccionada(clave);
    setAvisoId(porFecha.get(clave)?.[0]?.id ?? null);
  }

  function seleccionarAviso(aviso: AvisoPublico) {
    const clave = claveFechaValida(aviso.fecha);
    if (!clave) return;
    setFechaSeleccionada(clave);
    setAvisoId(aviso.id);
    setMesVisible(mesDeClave(clave));
  }

  return (
    <>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-2 md:gap-8">
        <div className="flex min-w-0 flex-col gap-6">
          <CalendarioMes
            mesVisible={mesVisible}
            hoyClave={hoyClave}
            fechaSeleccionada={fechaSeleccionada}
            porFecha={porFecha}
            mesVacio={mesVacio}
            onMesAnterior={() => setMesVisible((mes) => desplazarMes(mes, -1))}
            onMesSiguiente={() => setMesVisible((mes) => desplazarMes(mes, 1))}
            onSeleccionarDia={seleccionarDia}
          />
          <ProximosEventos
            avisos={proximos}
            hoy={hoy}
            avisoActivoId={avisoActivo?.id ?? null}
            onSeleccionar={seleccionarAviso}
          />
        </div>

        <div className="min-w-0 md:sticky md:top-24">
          <PanelDetalle
            fechaSeleccionada={fechaSeleccionada}
            eventos={eventos}
            avisoActivo={avisoActivo}
            sinAvisos={avisos.length === 0}
            onElegirEvento={setAvisoId}
            onVerDetalle={() => {
              if (avisoActivo) setAvisoAbierto(avisoActivo);
            }}
          />
        </div>
      </div>

      <AvisoPublicoDialog
        aviso={avisoAbierto}
        onCerrar={() => setAvisoAbierto(null)}
      />
    </>
  );
}

function CalendarioMes({
  mesVisible,
  hoyClave,
  fechaSeleccionada,
  porFecha,
  mesVacio,
  onMesAnterior,
  onMesSiguiente,
  onSeleccionarDia,
}: {
  mesVisible: Date;
  hoyClave: string;
  fechaSeleccionada: string;
  porFecha: Map<string, AvisoPublico[]>;
  mesVacio: boolean;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onSeleccionarDia: (clave: string) => void;
}) {
  const semanas = semanasDelMes(mesVisible);
  const tituloMes = etiquetaMes(mesVisible);

  return (
    <div className={cn("rounded-2xl bg-tarjeta p-4 sm:p-6", SOMBRA)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-lg font-semibold tracking-tight text-balance text-tinta sm:text-xl">
          {tituloMes}
        </h3>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onMesAnterior}
            aria-label="Mes anterior"
            className="flex size-11 items-center justify-center rounded-full bg-crema text-oliva transition hover:bg-superficie focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onMesSiguiente}
            aria-label="Mes siguiente"
            className="flex size-11 items-center justify-center rounded-full bg-crema text-oliva transition hover:bg-superficie focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        className="mt-5"
        role="grid"
        aria-label={`Calendario de ${tituloMes}`}
      >
        <div role="row" className="grid grid-cols-7">
          {DIAS_SEMANA.map((dia) => (
            <div
              key={dia}
              role="columnheader"
              className="pb-2 text-center text-[length:calc(0.6875rem*var(--escala-texto,1))] font-medium tracking-wide text-tinta/45 sm:text-xs"
            >
              {dia}
            </div>
          ))}
        </div>

        {semanas.map((semana, indiceSemana) => (
          <div
            key={`semana-${indiceSemana}`}
            role="row"
            className="grid grid-cols-7"
          >
            {semana.map((celda, indiceCelda) => {
              if (!celda) {
                return (
                  <div
                    key={`vacia-${indiceSemana}-${indiceCelda}`}
                    role="gridcell"
                  />
                );
              }

              const eventos = porFecha.get(celda.clave) ?? [];
              const cantidad = eventos.length;
              const tituloActividad = eventos[0]?.titulo;
              const seleccionado = celda.clave === fechaSeleccionada;
              const esHoy = celda.clave === hoyClave;

              return (
                <div key={celda.clave} role="gridcell" className="p-0.5">
                  <button
                    type="button"
                    aria-pressed={seleccionado}
                    aria-label={etiquetaDia(
                      celda.dia,
                      tituloMes,
                      cantidad,
                      esHoy,
                      tituloActividad,
                    )}
                    onClick={() => onSeleccionarDia(celda.clave)}
                    className="flex h-full w-full flex-col items-center rounded-xl px-0.5 py-1 transition hover:bg-crema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40"
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-sm text-tinta",
                        seleccionado && "bg-oliva font-medium text-sobre-oliva",
                        esHoy && !seleccionado && "ring-1 ring-oliva/45",
                      )}
                    >
                      {celda.dia}
                    </span>
                    {tituloActividad ? (
                      <span
                        className="mt-0.5 line-clamp-2 w-full text-center text-[length:calc(0.5625rem*var(--escala-texto,1))] leading-tight font-medium text-oliva sm:text-[length:calc(0.625rem*var(--escala-texto,1))]"
                      >
                        {tituloActividad}
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {mesVacio ? (
        <p className="mt-4 rounded-xl bg-crema px-3 py-2.5 text-center text-sm text-tinta/65">
          Este mes no tiene actividades publicadas.
        </p>
      ) : null}
    </div>
  );
}

function etiquetaDia(
  dia: number,
  tituloMes: string,
  cantidad: number,
  esHoy: boolean,
  tituloActividad?: string,
): string {
  const actividades =
    cantidad === 0
      ? "Sin actividades"
      : cantidad === 1
        ? tituloActividad || "1 actividad"
        : `${cantidad} actividades. ${tituloActividad ?? ""}`.trim();
  return `${dia} de ${tituloMes}. ${actividades}${esHoy ? ". Hoy" : ""}`;
}

function ProximosEventos({
  avisos,
  hoy,
  avisoActivoId,
  onSeleccionar,
}: {
  avisos: AvisoPublico[];
  hoy: Date;
  avisoActivoId: number | null;
  onSeleccionar: (aviso: AvisoPublico) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-tinta">
        Próximos eventos
      </h3>

      {avisos.length === 0 ? (
        <p className={cn("mt-3 rounded-2xl bg-tarjeta px-4 py-4 text-sm text-tinta/60", SOMBRA)}>
          No hay actividades próximas por ahora.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {avisos.map((aviso) => {
            const activo = aviso.id === avisoActivoId;
            return (
              <li key={aviso.id}>
                <button
                  type="button"
                  onClick={() => onSeleccionar(aviso)}
                  className={cn(
                    "w-full rounded-2xl bg-tarjeta px-4 py-3.5 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40",
                    SOMBRA,
                    activo && "ring-2 ring-oliva",
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium text-oliva">
                      {fechaCortaAviso(aviso.fecha, hoy)}
                    </span>
                    <BadgeCategoria aviso={aviso} />
                  </span>
                  <span className="mt-1.5 block text-sm font-medium text-tinta">
                    {aviso.titulo}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-tinta/60">
                    {aviso.descripcion}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PanelDetalle({
  fechaSeleccionada,
  eventos,
  avisoActivo,
  sinAvisos,
  onElegirEvento,
  onVerDetalle,
}: {
  fechaSeleccionada: string;
  eventos: AvisoPublico[];
  avisoActivo: AvisoPublico | null;
  sinAvisos: boolean;
  onElegirEvento: (id: number) => void;
  onVerDetalle: () => void;
}) {
  return (
    <article
      aria-live="polite"
      className={cn("rounded-2xl bg-tarjeta p-4 sm:p-5", SOMBRA)}
    >
      {avisoActivo ? (
        <DetalleEvento
          aviso={avisoActivo}
          eventos={eventos}
          onElegirEvento={onElegirEvento}
          onVerDetalle={onVerDetalle}
        />
      ) : (
        <EstadoSinActividad
          fecha={fechaSeleccionada}
          sinAvisos={sinAvisos}
        />
      )}
    </article>
  );
}

function DetalleEvento({
  aviso,
  eventos,
  onElegirEvento,
  onVerDetalle,
}: {
  aviso: AvisoPublico;
  eventos: AvisoPublico[];
  onElegirEvento: (id: number) => void;
  onVerDetalle: () => void;
}) {
  return (
    <div>
      <FlyerEvento key={aviso.id} aviso={aviso} />

      <div className="mt-5 space-y-3 px-1">
        <BadgeCategoria aviso={aviso} />
        <h3 className="text-2xl font-semibold tracking-tight text-balance text-tinta">
          {aviso.titulo}
        </h3>
        <p className="flex items-center gap-2 text-sm text-tinta/70">
          <CalendarDays className="size-4 shrink-0 text-oro" aria-hidden />
          <span>{fechaLargaAviso(aviso.fecha)}</span>
        </p>
        <p className="line-clamp-4 text-sm leading-relaxed text-tinta/70">
          {aviso.descripcion}
        </p>
      </div>

      {eventos.length > 1 ? (
        <div className="mt-5 px-1">
          <p className="text-xs font-medium text-tinta/50">
            {eventos.length} eventos programados
          </p>
          <ul className="mt-2 space-y-2">
            {eventos.map((evento) => {
              const activo = evento.id === aviso.id;
              return (
                <li key={evento.id}>
                  <button
                    type="button"
                    aria-pressed={activo}
                    onClick={() => onElegirEvento(evento.id)}
                    className={cn(
                      "w-full rounded-xl px-3 py-2.5 text-left text-sm leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40",
                      activo
                        ? "bg-oliva font-medium text-sobre-oliva"
                        : "bg-crema text-tinta hover:bg-superficie",
                    )}
                  >
                    {evento.titulo}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 px-1">
        <Button
          type="button"
          className="rounded-full bg-oliva px-5 text-sobre-oliva hover:bg-oliva/90"
          onClick={onVerDetalle}
        >
          Ver detalle
        </Button>
      </div>
    </div>
  );
}

function FlyerEvento({ aviso }: { aviso: AvisoPublico }) {
  const [roto, setRoto] = useState(false);
  const mostrar = aviso.tieneFlyer && !roto;

  return (
    <div className="flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-crema sm:h-80">
      {mostrar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFlyerAviso(aviso.id)}
          alt={`Flyer de ${aviso.titulo}`}
          className="max-h-full max-w-full object-contain p-3"
          onError={() => setRoto(true)}
        />
      ) : (
        <PlaceholderFlyer />
      )}
    </div>
  );
}

function PlaceholderFlyer() {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <Image
        src="/escudo-ctp27.png"
        alt=""
        width={72}
        height={72}
        className="h-16 w-16 object-contain"
      />
      <p className="mt-3 text-sm font-medium text-oliva">
        Colegio Técnico Profesional
      </p>
      <p className="text-xs text-tinta/50">27 de Abril</p>
    </div>
  );
}

function EstadoSinActividad({
  fecha,
  sinAvisos,
}: {
  fecha: string;
  sinAvisos: boolean;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center sm:min-h-80">
      <div className="flex size-12 items-center justify-center rounded-full bg-crema text-oliva">
        <CalendarDays className="size-5" aria-hidden />
      </div>
      {sinAvisos ? (
        <>
          <p className="mt-4 max-w-sm text-base font-medium text-tinta">
            Aún no hay actividades publicadas
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-tinta/60">
            Cuando el colegio registre avisos con fecha, podrás consultarlos
            en este calendario.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 max-w-sm text-base font-medium text-tinta">
            No hay actividades programadas para esta fecha
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-tinta/60">
            Selecciona otro día para consultar avisos o eventos institucionales.
          </p>
          <p className="mt-3 text-xs text-tinta/45">{fechaLargaAviso(fecha)}</p>
        </>
      )}
    </div>
  );
}

function BadgeCategoria({ aviso }: { aviso: AvisoPublico }) {
  const categoria = categoriaDeAviso(aviso);
  const etiqueta = etiquetaCategoria(aviso);
  if (!categoria || !etiqueta) return null;
  const estilo = ESTILO_CATEGORIA[categoria];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        estilo.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", estilo.punto)} aria-hidden />
      {etiqueta}
    </span>
  );
}

function ErrorCalendario({
  cargando,
  onReintentar,
}: {
  cargando: boolean;
  onReintentar: () => void;
}) {
  return (
    <div className={cn("mt-10 max-w-md rounded-2xl bg-tarjeta px-6 py-8", SOMBRA)}>
      <p className="font-medium text-tinta">
        No se pudo cargar el calendario institucional
      </p>
      <p className="mt-1 text-sm text-tinta/60">
        Verifica la conexión e inténtalo nuevamente
      </p>
      <Button
        type="button"
        className="mt-5 rounded-full bg-oliva text-sobre-oliva hover:bg-oliva/90"
        disabled={cargando}
        onClick={onReintentar}
      >
        Reintentar
      </Button>
    </div>
  );
}

function EsqueletoCalendario() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="space-y-6">
        <div className={cn("rounded-2xl bg-tarjeta p-4 sm:p-6", SOMBRA)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 bg-superficie" />
            <div className="flex gap-2">
              <Skeleton className="size-9 rounded-full bg-superficie" />
              <Skeleton className="size-9 rounded-full bg-superficie" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-y-3">
            {Array.from({ length: 35 }).map((_, indice) => (
              <Skeleton
                key={`dia-esqueleto-${indice}`}
                className="mx-auto size-9 rounded-full bg-superficie"
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-36 bg-superficie" />
          <Skeleton className="h-20 w-full rounded-2xl bg-superficie" />
          <Skeleton className="h-20 w-full rounded-2xl bg-superficie" />
        </div>
      </div>
      <div className={cn("rounded-2xl bg-tarjeta p-4 sm:p-5", SOMBRA)}>
        <Skeleton className="h-72 w-full rounded-2xl bg-superficie sm:h-80" />
        <Skeleton className="mt-5 h-6 w-24 rounded-full bg-superficie" />
        <Skeleton className="mt-3 h-8 w-3/4 bg-superficie" />
        <Skeleton className="mt-3 h-4 w-1/2 bg-superficie" />
        <Skeleton className="mt-4 h-16 w-full bg-superficie" />
      </div>
    </div>
  );
}
