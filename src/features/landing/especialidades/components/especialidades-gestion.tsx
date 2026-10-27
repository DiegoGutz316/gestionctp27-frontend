"use client";

import Link from "next/link";
import { Home, PencilIcon, PlusIcon, RotateCcw, Ban } from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { ICONO_LUCIDE } from "../models/especialidad.model";
import {
  useDesactivarEspecialidad,
  useEspecialidadesGestion,
  useReactivarEspecialidad,
} from "../hooks/hooks";
import {
  getMensajeDeError,
  urlFotoVisible,
} from "../servicios/especialidad.service";

export function EspecialidadesGestion() {
  const especialidades = useEspecialidadesGestion();
  const desactivar = useDesactivarEspecialidad();
  const reactivar = useReactivarEspecialidad();

  async function alternarActivo(id: number, activo: boolean, nombre: string) {
    try {
      if (activo) {
        await desactivar.mutateAsync(id);
        toast.success(`"${nombre}" ocultada de la landing.`);
      } else {
        await reactivar.mutateAsync(id);
        toast.success(`"${nombre}" visible en la landing.`);
      }
    } catch (error) {
      toast.error(getMensajeDeError(error));
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
            <BreadcrumbPage>Especialidades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Especialidades de la landing
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Edite nombres, descripciones y fotos del sitio público.
          </p>
        </div>
        <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/landing/especialidades/nueva" />}
          >
            <PlusIcon data-icon="inline-start" />
            Nueva especialidad
          </Button>
        </MostrarSiPuede>
      </div>

      {especialidades.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : null}

      {especialidades.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(especialidades.error)}
        </p>
      ) : null}

      {!especialidades.isLoading && !especialidades.isError ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {(especialidades.data ?? []).map((item) => {
            const Icono = ICONO_LUCIDE[item.icono];
            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border bg-card shadow-xs"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFotoVisible(item)}
                    alt={item.fotoAlt || item.nombre}
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-8 items-center justify-center rounded-lg bg-muted"
                          aria-hidden
                        >
                          <Icono className="size-4" style={{ color: item.acento }} />
                        </span>
                        <h2 className="truncate font-semibold">{item.nombre}</h2>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {item.descripcion}
                      </p>
                    </div>
                    <Badge variant={item.activo ? "secondary" : "outline"}>
                      {item.activo ? "Visible" : "Oculta"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/dashboard/landing/especialidades/${item.id}/editar`}
                        />
                      }
                    >
                      <PencilIcon data-icon="inline-start" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={desactivar.isPending || reactivar.isPending}
                      onClick={() =>
                        void alternarActivo(item.id, item.activo, item.nombre)
                      }
                    >
                      {item.activo ? (
                        <>
                          <Ban data-icon="inline-start" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <RotateCcw data-icon="inline-start" />
                          Mostrar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {!especialidades.isLoading &&
      !especialidades.isError &&
      (especialidades.data?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay especialidades registradas.
        </p>
      ) : null}

      <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
        <div className="sm:hidden">
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href="/dashboard/landing/especialidades/nueva" />}
          >
            <PlusIcon data-icon="inline-start" />
            Nueva especialidad
          </Button>
        </div>
      </MostrarSiPuede>
    </section>
  );
}
