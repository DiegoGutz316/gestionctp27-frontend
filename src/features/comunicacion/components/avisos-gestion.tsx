"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Megaphone } from "lucide-react";

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

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useAvisos } from "../hooks/aviso-hooks";
import { getMensajeDeError } from "../servicios/aviso.service";
import { AvisosLista } from "./avisos-lista";

export function AvisosGestion() {
  const [pagina, setPagina] = useState(1);

  const consulta = useAvisos({ pagina });

  const avisos = consulta.data?.datos ?? [];
  const meta = consulta.data?.meta;
  const total = meta?.total ?? 0;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
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
              : consulta.isError && avisos.length === 0
                ? "No se pudo consultar los avisos."
                : `${total} aviso${total === 1 ? "" : "s"} activo${
                    total === 1 ? "" : "s"
                  }`}
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

      <AvisosLista
        cargando={consulta.isLoading}
        mensajeError={consulta.isError ? getMensajeDeError(consulta.error) : null}
        avisos={avisos}
      />

      {meta && total > 0 ? (
        <ControlesPaginacion meta={meta} onPaginaChange={setPagina} />
      ) : null}
    </section>
  );
}
