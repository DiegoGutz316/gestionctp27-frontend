"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ListFilterIcon, Search } from "lucide-react";

import { AccionFlotante } from "@/components/accion-flotante";
import { ControlesPaginacion } from "@/components/controles-paginacion";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

      <div className="flex items-center gap-2">
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
          <>
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 gap-2 md:hidden"
                  />
                }
              >
                <ListFilterIcon className="size-4" />
                Filtros
                {estado !== "TODOS" ? (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 justify-center rounded-full px-1.5"
                  >
                    1
                  </Badge>
                ) : null}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros</DialogTitle>
                  <DialogDescription>
                    Filtre los avisos por estado.
                  </DialogDescription>
                </DialogHeader>
                <div
                  className="flex flex-col gap-2"
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
                        className={`cursor-pointer rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
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
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={estado === "TODOS"}
                    onClick={() => {
                      setEstado("TODOS");
                      setPagina(1);
                    }}
                  >
                    Limpiar
                  </Button>
                  <DialogClose render={<Button type="button" />}>
                    Ver resultados
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div
              className="hidden shrink-0 gap-1 md:flex"
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
                    className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
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
          </>
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
