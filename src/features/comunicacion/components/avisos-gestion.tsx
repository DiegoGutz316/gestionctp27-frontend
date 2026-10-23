"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";

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

import { useAuth } from "@/features/auth/context/auth-context";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useAvisos } from "../hooks/aviso-hooks";
import { getMensajeDeError } from "../servicios/aviso.service";
import type { AvisoRespuesta } from "../validacion/aviso.validacion";
import { AvisoDesactivarDialog } from "./aviso-desactivar-dialog";
import {
  AvisosFiltrosSheet,
  type FiltroEstadoAviso,
} from "./avisos-filtros-sheet";
import { AvisosTabla } from "./avisos-tabla";

export function AvisosGestion() {
  const { puede } = useAuth();
  const puedeAdministrar = puede("REPORTES", "COMPLETO");
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState("");
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<FiltroEstadoAviso>("TODOS");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
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
    estado: puedeAdministrar ? estado : "ACTIVO",
  });

  const avisos = consulta.data?.datos ?? [];
  const meta = consulta.data?.meta;
  const total = meta?.total ?? 0;
  const hayFiltro =
    q.length > 0 || (puedeAdministrar && estado !== "TODOS");

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
          <AccionFlotante
            href="/dashboard/comunicacion/avisos/nuevo"
            etiqueta="Publicar aviso"
          />
        </MostrarSiPuede>
      </div>

      <div className="flex items-center gap-3">
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

        {puedeAdministrar ? (
          <AvisosFiltrosSheet
            abierto={filtrosAbiertos}
            onAbiertoChange={setFiltrosAbiertos}
            estado={estado}
            onEstadoChange={(valor) => {
              setEstado(valor);
              setPagina(1);
            }}
            onLimpiar={() => {
              setEstado("TODOS");
              setPagina(1);
            }}
          />
        ) : null}
      </div>

      <AvisosTabla
        cargando={consulta.isLoading}
        mensajeError={consulta.isError ? getMensajeDeError(consulta.error) : null}
        avisos={avisos}
        sinResultadosPorFiltro={hayFiltro}
        onDesactivar={setAvisoADesactivar}
      />

      {meta && meta.totalPaginas > 1 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPagina} />
      ) : null}

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
