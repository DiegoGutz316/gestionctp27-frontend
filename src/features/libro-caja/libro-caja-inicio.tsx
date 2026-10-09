"use client";

import Link from "next/link";
import {
  Building2,
  CalendarRange,
  ChevronRight,
  Home,
  Landmark,
  PencilIcon,
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useColegio } from "@/features/libro-caja/colegio/hooks/hooks";
import { getMensajeDeError } from "@/features/libro-caja/colegio/servicios/colegio.service";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";

function datoOVacio(valor: string) {
  return valor.trim() === "" ? "Sin registrar" : valor;
}

function ColegioResumen({ colegio }: { colegio: ColegioRespuesta }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      <div>
        <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Nombre
        </dt>
        <dd className="mt-1 text-sm text-foreground">{colegio.nombre}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Cuenta bancaria
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {datoOVacio(colegio.numeroCuentaBancaria)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Entidad de depósito
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {datoOVacio(colegio.entidadDeposito)}
        </dd>
      </div>
    </dl>
  );
}

export function LibroCajaInicio() {
  const colegio = useColegio();

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
            <BreadcrumbPage>Libro de caja</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Libro de caja
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Información del colegio, departamentos y periodos de caja.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
            <Landmark className="size-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-lg">Información del colegio</CardTitle>
            <CardDescription>
              Nombre, cuenta bancaria y entidad donde se depositan los fondos.
            </CardDescription>
          </div>
          <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
            <Button
              variant="outline"
              size="sm"
              className="ml-auto shrink-0"
              nativeButton={false}
              render={<Link href="/dashboard/libro-caja/colegio/editar" />}
            >
              <PencilIcon data-icon="inline-start" />
              Editar
            </Button>
          </MostrarSiPuede>
        </CardHeader>
        <CardContent>
          {colegio.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          ) : null}

          {colegio.isError ? (
            <p className="text-sm text-destructive">
              {getMensajeDeError(colegio.error)}
            </p>
          ) : null}

          {colegio.data ? <ColegioResumen colegio={colegio.data} /> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/libro-caja/departamentos"
          className="group"
        >
          <Card className="h-full shadow-xs transition-colors group-hover:border-[#dce7d6] dark:group-hover:border-border">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-lg">Departamentos</CardTitle>
                <CardDescription>
                  Unidades productivas que solicitan fondo de caja.
                </CardDescription>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-color-company" />
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/libro-caja/periodos" className="group">
          <Card className="h-full shadow-xs transition-colors group-hover:border-[#dce7d6] dark:group-hover:border-border">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
                <CalendarRange className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-lg">Periodos</CardTitle>
                <CardDescription>
                  Apertura, fondos por departamento y cierre.
                </CardDescription>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-color-company" />
            </CardHeader>
          </Card>
        </Link>
      </div>
    </section>
  );
}
