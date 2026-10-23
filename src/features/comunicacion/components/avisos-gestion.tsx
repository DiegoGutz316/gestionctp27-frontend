"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Megaphone, Search, X } from "lucide-react";

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

import { useAuth } from "@/features/auth/context/auth-context";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useAvisos } from "../hooks/aviso-hooks";
import { getMensajeDeError } from "../servicios/aviso.service";
import type { AvisoRespuesta, EstadoAviso } from "../validacion/aviso.validacion";
import { AvisoDesactivarDialog } from "./aviso-desactivar-dialog";
import { AvisoDetalleDialog } from "./aviso-detalle-dialog";
import { AvisosTabla } from "./avisos-tabla";

type FiltroEstado = "TODOS" | EstadoAviso;

const FILTROS: { id: FiltroEstado; etiqueta: string }[] = [
  { id: "TODOS", etiqueta: "Todos" },
  { id: "ACTIVO", etiqueta: "Activos" },
  { id: "INACTIVO", etiqueta: "Inactivos" },
];

export function AvisosGestion() {
  const { puede } = useAuth();
  const puedeAdministrar = puede("REPORTES", "COMPLETO");
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState("");
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<FiltroEstado>("TODOS");
  const [avisoAbierto, setAvisoAbierto] = useState<AvisoRespuesta | null>(null);
  const [avisoADesactivar, setAvisoADesactivar] =
    useState<AvisoRespuesta | null>(null);

  useEffect(() => {
    const espera = window.setTimeout(() => {
      setQ(texto.trim());
      setPagina(1);
    }, 300);
    return () => window.clearTimeout(espera);
  }, [texto]);

  const consulta = useAvisos({
    pagina,
    q: q || undefined,
    estado: puedeAdministrar ? estado : estado === "INACTIVO" ? "INACTIVO" : "ACTIVO",
  });

  const avisos = consulta.data?.datos ?? [];
  const meta = consulta.data?.meta;
  const total = meta?.total ?? 0;
  const hayFiltro = q.length > 0 || estado !== "TODOS";

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
            <BreadcrumbPage>Avisos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Avisos institucionales
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {consulta.isLoading
              ? "Cargando avisos…"
              : consulta.isError
                ? "No se pudo cargar el listado."
                : `${total} aviso${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/comunicacion/avisos/nuevo" />}
          >
            <Megaphone data-icon="inline-start" />
            Publicar aviso
          </Button>
        </MostrarSiPuede>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="Buscar por título"
            aria-label="Buscar avisos por título"
            className="pl-9"
          />
        </div>

        <div
          className="flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain"
          role="group"
          aria-label="Filtrar por estado"
        >
          {FILTROS.map((filtro) => {
            const activo = estado === filtro.id;
            return (
              <button
                key={filtro.id}
                type="button"
                aria-pressed={activo}
                onClick={() => {
                  setEstado(filtro.id);
                  setPagina(1);
                }}
                className={`shrink-0 cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap transition md:py-1.5 ${
                  activo
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {filtro.etiqueta}
              </button>
            );
          })}
        </div>

        {hayFiltro ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setTexto("");
              setQ("");
              setEstado("TODOS");
              setPagina(1);
            }}
          >
            <X data-icon="inline-start" />
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      <AvisosTabla
        cargando={consulta.isLoading}
        mensajeError={consulta.isError ? getMensajeDeError(consulta.error) : null}
        avisos={avisos}
        sinResultadosPorFiltro={hayFiltro}
        onVer={setAvisoAbierto}
        onDesactivar={setAvisoADesactivar}
      />

      {meta && meta.totalPaginas > 1 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPagina} />
      ) : null}

      <AvisoDetalleDialog
        aviso={avisoAbierto}
        onCerrar={() => setAvisoAbierto(null)}
      />

      <AvisoDesactivarDialog
        aviso={avisoADesactivar}
        open={avisoADesactivar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setAvisoADesactivar(null);
        }}
      />
    </section>
  );
}
