"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  FileSpreadsheet,
  Home,
  Leaf,
  Sprout,
} from "lucide-react";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  usePeriodo,
  usePeriodos,
} from "@/features/libro-caja/periodo/hooks/hooks";
import { getMensajeDeError } from "@/features/libro-caja/periodo/servicios/periodo.service";

const LIMITE_PERIODOS = 100;

const claseTarjetaReporte =
  "group flex h-full flex-col border-[#dde4db] dark:border-border bg-white dark:bg-card shadow-[0_6px_24px_rgba(39,50,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(39,50,42,0.08)]";

const claseIcono =
  "flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf2e9] dark:bg-secondary text-[#62774d] dark:text-primary";

export function ReportesInicio() {
  const [periodoId, setPeriodoId] =
    useState<string>("");

  const [fondoId, setFondoId] =
    useState<string>("");

  const periodos = usePeriodos({
    pagina: 1,
    limite: LIMITE_PERIODOS,
  });

  const idNumerico = Number(periodoId);

  const periodo = usePeriodo(
    idNumerico,
  );

  const fondos =
    periodo.data?.fondos ?? [];

  const listaPeriodos =
    periodos.data?.datos ?? [];

  const itemsPeriodo =
    listaPeriodos.map((item) => ({
      value: String(item.id),
      label: `${item.nombre} (${
        item.estado === "ABIERTO"
          ? "Abierto"
          : "Cerrado"
      })`,
    }));

  const itemsFondo = fondos.map(
    (fondo) => ({
      value: String(fondo.id),
      label:
        fondo.departamento
          .nombreUnidad,
    }),
  );

  const informeHref =
    periodoId && fondoId
      ? `/dashboard/libro-caja/periodos/${periodoId}/fondos/${fondoId}/informe`
      : null;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href="/dashboard" />
              }
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Reportes
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Reportes
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          Consulte reportes de
          producción e inventario y
          genere los formatos
          institucionales utilizados
          por el colegio.
        </p>
      </div>

      {/* =========================================
          REPORTES DEL SISTEMA
          ========================================= */}

      <MostrarSiPuede
        modulo="REPORTES"
        nivel="LECTURA"
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#303832] dark:text-foreground">
              Reportes del sistema
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Consulte información
              operativa y exporte los
              resultados en PDF o
              Excel.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Pecuaria */}
            <Card
              className={
                claseTarjetaReporte
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div
                  className={
                    claseIcono
                  }
                >
                  <Leaf className="size-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">
                    Producción pecuaria
                  </CardTitle>

                  <CardDescription className="leading-5">
                    Producción de un
                    animal en un período,
                    con detalle y totales
                    por tipo de
                    producción.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end border-t border-[#edf0eb] dark:border-border pt-4">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/dashboard/reportes/produccion-pecuaria" />
                  }
                >
                  Ver reporte
                </Button>
              </CardContent>
            </Card>

            {/* Agrícola */}
            <Card
              className={
                claseTarjetaReporte
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div
                  className={
                    claseIcono
                  }
                >
                  <Sprout className="size-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">
                    Producción agrícola
                  </CardTitle>

                  <CardDescription className="leading-5">
                    Siembras, cosechas y
                    tratamientos por
                    período, cultivo y
                    cama de cultivo.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end border-t border-[#edf0eb] dark:border-border pt-4">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/dashboard/reportes/produccion-agricola" />
                  }
                >
                  Ver reporte
                </Button>
              </CardContent>
            </Card>

            {/* Inventario */}
            <Card
              className={
                claseTarjetaReporte
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div
                  className={
                    claseIcono
                  }
                >
                  <Boxes className="size-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">
                    Inventario
                  </CardTitle>

                  <CardDescription className="leading-5">
                    Entradas, salidas,
                    existencia final y
                    saldo actual por
                    producto y categoría.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end border-t border-[#edf0eb] dark:border-border pt-4">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/dashboard/reportes/inventario" />
                  }
                >
                  Ver reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </MostrarSiPuede>

      {/* =========================================
          FORMATOS INSTITUCIONALES
          ========================================= */}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#303832] dark:text-foreground">
            Formatos institucionales
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Genere documentos e
            inventarios basados en los
            formatos utilizados por el
            Ministerio de Educación
            Pública.
          </p>
        </div>

        {/* Informe económico */}
        <Card className="overflow-hidden border-[#dde4db] dark:border-border bg-white dark:bg-card shadow-[0_6px_24px_rgba(39,50,42,0.04)]">
          <CardHeader className="border-b border-[#edf0eb] dark:border-border bg-[#fafbf9] dark:bg-muted">
            <div className="flex items-start gap-4">
              <div
                className={
                  claseIcono
                }
              >
                <FileSpreadsheet className="size-5" />
              </div>

              <div className="space-y-1">
                <CardTitle className="text-lg">
                  Informe
                  Económico-UDP
                </CardTitle>

                <CardDescription className="max-w-3xl leading-5">
                  Formato del Ministerio
                  de Educación Pública
                  con información del
                  colegio, ingresos,
                  egresos, totales y
                  firmas.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            {periodos.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Cargando periodos…
              </p>
            ) : null}

            {periodos.isError ? (
              <p className="text-sm text-destructive">
                {getMensajeDeError(
                  periodos.error,
                )}
              </p>
            ) : null}

            {!periodos.isLoading &&
            !periodos.isError &&
            listaPeriodos.length ===
              0 ? (
              <div className="rounded-xl border border-dashed border-[#dfe5dc] dark:border-border bg-[#fafbf9] dark:bg-muted px-4 py-6">
                <p className="text-sm text-muted-foreground">
                  No hay periodos de
                  caja. Abra un periodo
                  en Libro de caja para
                  poder generar el
                  informe.
                </p>
              </div>
            ) : null}

            {listaPeriodos.length >
            0 ? (
              <form
                className="space-y-5"
                onSubmit={(event) =>
                  event.preventDefault()
                }
              >
                <FieldGroup className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="periodo-informe">
                      Periodo
                    </FieldLabel>

                    <Select
                      items={
                        itemsPeriodo
                      }
                      value={
                        periodoId ||
                        null
                      }
                      onValueChange={(
                        valor,
                      ) => {
                        setPeriodoId(
                          valor ?? "",
                        );

                        setFondoId(
                          "",
                        );
                      }}
                    >
                      <SelectTrigger
                        id="periodo-informe"
                        className="w-full"
                        aria-label="Periodo del informe"
                      >
                        <SelectValue placeholder="Seleccione un periodo" />
                      </SelectTrigger>

                      <SelectContent>
                        {itemsPeriodo.map(
                          (item) => (
                            <SelectItem
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {
                                item.label
                              }
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="unidad-informe">
                      Unidad
                    </FieldLabel>

                    <Select
                      items={
                        itemsFondo
                      }
                      value={
                        fondoId ||
                        null
                      }
                      onValueChange={(
                        valor,
                      ) =>
                        setFondoId(
                          valor ??
                            "",
                        )
                      }
                      disabled={
                        !periodoId ||
                        periodo.isLoading
                      }
                    >
                      <SelectTrigger
                        id="unidad-informe"
                        className="w-full"
                        aria-label="Unidad productiva"
                      >
                        <SelectValue placeholder="Seleccione la unidad" />
                      </SelectTrigger>

                      <SelectContent>
                        {itemsFondo.map(
                          (item) => (
                            <SelectItem
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {
                                item.label
                              }
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>

                    {periodo.isError ? (
                      <FieldDescription className="text-destructive">
                        {getMensajeDeError(
                          periodo.error,
                        )}
                      </FieldDescription>
                    ) : (
                      <FieldDescription>
                        Cada unidad tiene
                        su propio libro
                        de ingresos y
                        egresos.
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  {informeHref ? (
                    <Button
                      nativeButton={
                        false
                      }
                      render={
                        <Link
                          href={
                            informeHref
                          }
                        />
                      }
                    >
                      Ver informe
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled
                    >
                      Ver informe
                    </Button>
                  )}
                </div>
              </form>
            ) : null}
          </CardContent>
        </Card>

        {/* Inventarios pecuarios MEP */}
        <MostrarSiPuede
          modulo="PECUARIA"
          nivel="LECTURA"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className={
                claseTarjetaReporte
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div
                  className={
                    claseIcono
                  }
                >
                  <FileSpreadsheet className="size-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">
                    Inventario Especies
                    Menores
                  </CardTitle>

                  <CardDescription className="leading-5">
                    Plantilla del MEP
                    para chanchos,
                    gallinas, pollos y
                    cabras, con
                    identificación,
                    edad, raza y
                    observaciones.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end border-t border-[#edf0eb] dark:border-border pt-4">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/dashboard/pecuaria/inventario/especies-menores" />
                  }
                >
                  Ver inventario
                </Button>
              </CardContent>
            </Card>

            <Card
              className={
                claseTarjetaReporte
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div
                  className={
                    claseIcono
                  }
                >
                  <FileSpreadsheet className="size-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">
                    Inventario Ganado
                    Bovino-UDP
                  </CardTitle>

                  <CardDescription className="leading-5">
                    Plantilla del MEP
                    para registrar
                    toros, novillas,
                    vacas, terneros y
                    toretes, junto con
                    raza y
                    observaciones.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end border-t border-[#edf0eb] dark:border-border pt-4">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/dashboard/pecuaria/inventario/ganado-bovino" />
                  }
                >
                  Ver inventario
                </Button>
              </CardContent>
            </Card>
          </div>
        </MostrarSiPuede>
      </section>
    </section>
  );
}