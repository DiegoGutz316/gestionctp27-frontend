"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Home, Leaf, Sprout } from "lucide-react";
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
import { usePeriodo, usePeriodos } from "@/features/libro-caja/periodo/hooks/hooks";
import { getMensajeDeError } from "@/features/libro-caja/periodo/servicios/periodo.service";

const LIMITE_PERIODOS = 100;

export function ReportesInicio() {
  const [periodoId, setPeriodoId] = useState<string>("");
  const [fondoId, setFondoId] = useState<string>("");

  const periodos = usePeriodos({ pagina: 1, limite: LIMITE_PERIODOS });
  const idNumerico = Number(periodoId);
  const periodo = usePeriodo(idNumerico);
  const fondos = periodo.data?.fondos ?? [];

  const listaPeriodos = periodos.data?.datos ?? [];
  const itemsPeriodo = listaPeriodos.map((item) => ({
    value: String(item.id),
    label: `${item.nombre} (${item.estado === "ABIERTO" ? "Abierto" : "Cerrado"})`,
  }));
  const itemsFondo = fondos.map((fondo) => ({
    value: String(fondo.id),
    label: fondo.departamento.nombreUnidad,
  }));

  const informeHref =
    periodoId && fondoId
      ? `/dashboard/libro-caja/periodos/${periodoId}/fondos/${fondoId}/informe`
      : null;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
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
            <BreadcrumbPage>Reportes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Reportes
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Genere el Informe Económico-UDP y los inventarios pecuarios con las
          plantillas del Ministerio de Educación Pública.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">Informe Económico-UDP</CardTitle>
            <CardDescription>
              Formato del Ministerio de Educación Pública: encabezado del
              colegio, asientos de ingresos y egresos, totales y firmas.
              Desde el informe puede imprimirlo o descargarlo en Excel.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {periodos.isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando periodos…</p>
          ) : null}

          {periodos.isError ? (
            <p className="text-sm text-destructive">
              {getMensajeDeError(periodos.error)}
            </p>
          ) : null}

          {!periodos.isLoading && !periodos.isError && listaPeriodos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay periodos de caja. Abra un periodo en Libro de caja para
              poder generar el informe.
            </p>
          ) : null}

          {listaPeriodos.length > 0 ? (
            <form
              className="space-y-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="periodo-informe">Periodo</FieldLabel>
                  <Select
                    items={itemsPeriodo}
                    value={periodoId || null}
                    onValueChange={(valor) => {
                      setPeriodoId(valor ?? "");
                      setFondoId("");
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
                      {itemsPeriodo.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="unidad-informe">Unidad</FieldLabel>
                  <Select
                    items={itemsFondo}
                    value={fondoId || null}
                    onValueChange={(valor) => setFondoId(valor ?? "")}
                    disabled={!periodoId || periodo.isLoading}
                  >
                    <SelectTrigger
                      id="unidad-informe"
                      className="w-full"
                      aria-label="Unidad productiva"
                    >
                      <SelectValue placeholder="Seleccione la unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemsFondo.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {periodo.isError ? (
                    <FieldDescription className="text-destructive">
                      {getMensajeDeError(periodo.error)}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      Cada unidad tiene su propio libro de ingresos y egresos.
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <div className="flex justify-end">
                {informeHref ? (
                  <Button
                    nativeButton={false}
                    render={<Link href={informeHref} />}
                  >
                    Ver informe
                  </Button>
                ) : (
                  <Button type="button" disabled>
                    Ver informe
                  </Button>
                )}
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <MostrarSiPuede modulo="PECUARIA" nivel="LECTURA">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
              <FileSpreadsheet className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Inventario Especies Menores
              </CardTitle>
              <CardDescription>
                Plantilla del MEP para chanchos, gallinas, pollos y cabras:
                asiento, identificación, edad, raza y observaciones. Desde el
                inventario puede imprimirlo o descargarlo en Excel.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end">
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

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
              <FileSpreadsheet className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Inventario Ganado Bovino-UDP
              </CardTitle>
              <CardDescription>
                Plantilla del MEP con cantidad por toro, novilla, vaca,
                ternero/a y torete, más raza y observaciones. Complete la
                categoría al registrar cada vaca para que las columnas de
                cantidad se llenen solas.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end">
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
      </MostrarSiPuede>

      <MostrarSiPuede modulo="REPORTES" nivel="LECTURA">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
              <Leaf className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Reporte de producción pecuaria
              </CardTitle>
              <CardDescription>
                Producción de un animal en un período, con el detalle de cada
                registro y los totales por tipo de producción.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/reportes/produccion-pecuaria" />}
            >
              Ver reporte
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
              <Sprout className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Reporte de producción agrícola
              </CardTitle>
              <CardDescription>
                Siembras, cosechas y tratamientos de un período, filtrables por
                cultivo y cama, con el total cosechado por unidad de medida.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/reportes/produccion-agricola" />}
            >
              Ver reporte
            </Button>
          </CardContent>
        </Card>
      </MostrarSiPuede>
    </section>
  );
}
