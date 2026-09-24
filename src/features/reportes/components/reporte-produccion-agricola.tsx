"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Home } from "lucide-react";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCamasCultivo } from "@/features/agricola/hooks/cama-cultivo-hooks";
import {
  ETIQUETA_UNIDAD_MEDIDA,
  formatearCantidadConUnidad,
} from "@/features/agricola/cosecha/models/cosecha.model";
import {
  formatearCantidad,
  formatearFecha,
} from "@/features/agricola/siembra/models/siembra.model";
import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useReporteProduccionAgricola } from "../hooks/reportes-hooks";
import { getMensajeDeError } from "../servicios/reportes.service";
import {
  filtrosReporteProduccionAgricolaSchema,
  type FiltrosReporteProduccionAgricola,
} from "../validacion/reportes.validacion";

const TODAS_LAS_CAMAS = "TODAS";

const FILTROS_SIN_APLICAR: FiltrosReporteProduccionAgricola = {
  fechaInicio: "",
  fechaFin: "",
};

function TablaSeccion({
  titulo,
  mensajeVacio,
  vacia,
  encabezados,
  children,
}: {
  titulo: string;
  mensajeVacio: string;
  vacia: boolean;
  encabezados: { texto: string; derecha?: boolean }[];
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight">{titulo}</h2>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {encabezados.map((encabezado) => (
                <TableHead
                  key={encabezado.texto}
                  className={encabezado.derecha ? "text-right" : undefined}
                >
                  {encabezado.texto}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {vacia ? (
              <TableRow>
                <TableCell
                  colSpan={encabezados.length}
                  className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
                >
                  {mensajeVacio}
                </TableCell>
              </TableRow>
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function ReporteProduccionAgricola() {
  // Lo que el usuario edita vive en el formulario; lo que se consulta vive
  // aquí y solo cambia al presionar «Generar reporte».
  const [aplicados, setAplicados] =
    useState<FiltrosReporteProduccionAgricola | null>(null);

  const reporte = useReporteProduccionAgricola(
    aplicados ?? FILTROS_SIN_APLICAR,
    aplicados !== null,
  );

  // Un fallo de red también deja la lista vacía; sin distinguirlo, el
  // selector diría «Todas las camas» como si el filtro estuviera listo.
  const camas = useCamasCultivo();
  const camasSinCargar = camas.isLoading || camas.isError;
  const camasItems = [
    { value: TODAS_LAS_CAMAS, label: "Todas las camas" },
    ...(camas.data ?? []).map((cama) => ({
      value: String(cama.id),
      label: `${cama.codigo} — ${cama.ubicacion}`,
    })),
  ];

  const form = useForm({
    defaultValues: {
      cultivo: "",
      camaId: "",
      fechaInicio: "",
      fechaFin: "",
    },

    validators: {
      onSubmit: zodValidator(filtrosReporteProduccionAgricolaSchema),
    },

    onSubmit: ({ value }) => {
      const nuevos = filtrosReporteProduccionAgricolaSchema.parse(value);

      // Mismos filtros: la clave de la consulta no cambia y no se volvería a
      // pedir nada, así que el botón parecería no hacer nada.
      if (JSON.stringify(nuevos) === JSON.stringify(aplicados)) {
        void reporte.refetch();
        return;
      }

      setAplicados(nuevos);
    },
  });

  const hoy = fechaHoyCR();
  const datos = reporte.data;

  const sinDatos =
    datos !== undefined &&
    datos.siembras.length === 0 &&
    datos.cosechas.length === 0 &&
    datos.tratamientos.length === 0;

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
            <BreadcrumbLink render={<Link href="/dashboard/reportes" />}>
              Reportes
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Producción agrícola</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Reporte de producción agrícola
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Consulte siembras, cosechas y tratamientos de un período, con el total
          cosechado por unidad de medida.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
        className="space-y-4 rounded-xl border bg-card p-4 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <form.Field name="cultivo">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Cultivo</FieldLabel>

                  <Input
                    id={field.name}
                    placeholder="Ej: Tomate"
                    maxLength={120}
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="camaId">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Cama de cultivo</FieldLabel>

                  <Select
                    items={camasItems}
                    // Sin datos el valor se deja sin fijar a propósito: hace
                    // que el trigger muestre el marcador de posición.
                    value={
                      field.state.value !== ""
                        ? field.state.value
                        : camasSinCargar
                          ? null
                          : TODAS_LAS_CAMAS
                    }
                    onValueChange={(valor) => {
                      const elegida =
                        (valor as string | null) ?? TODAS_LAS_CAMAS;

                      field.handleChange(
                        elegida === TODAS_LAS_CAMAS ? "" : elegida,
                      );
                    }}
                    disabled={camasSinCargar}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
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

                  {camas.isError ? (
                    <p className="text-sm text-destructive">
                      {getMensajeDeError(camas.error)}
                    </p>
                  ) : null}

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="fechaInicio">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha inicio
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="date"
                    max={hoy}
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="fechaFin">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha fin
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="date"
                    max={hoy}
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) => state.isSubmitting || reporte.isFetching}
        >
          {(generando) => (
            <div className="flex justify-end">
              <Button type="submit" disabled={generando}>
                {generando ? "Generando…" : "Generar reporte"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>

      {aplicados === null ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Indique el período y presione «Generar reporte».
        </p>
      ) : null}

      {aplicados !== null && reporte.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {aplicados !== null && reporte.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(reporte.error)}
        </p>
      ) : null}

      {aplicados !== null && datos && sinDatos ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          No se encontraron datos para los filtros seleccionados.
        </p>
      ) : null}

      {aplicados !== null && datos && !sinDatos ? (
        <>
          {datos.totales.cosechas.length > 0 ? (
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total cosechado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {datos.totales.cosechas.map((total) => (
                  <p
                    key={total.unidadMedida}
                    className="text-2xl font-semibold tabular-nums tracking-tight"
                  >
                    {formatearCantidadConUnidad(
                      total.cantidad,
                      total.unidadMedida,
                    )}
                  </p>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <TablaSeccion
            titulo="Siembras"
            mensajeVacio="No se encontraron siembras."
            vacia={datos.siembras.length === 0}
            encabezados={[
              { texto: "Cultivo" },
              { texto: "Cama" },
              { texto: "Fecha de siembra" },
              { texto: "Cantidad sembrada", derecha: true },
            ]}
          >
            {datos.siembras.map((siembra) => (
              <TableRow key={siembra.id}>
                <TableCell className="font-medium whitespace-normal">
                  {siembra.tipoCultivo}
                </TableCell>
                <TableCell>{siembra.cama.codigo}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatearFecha(siembra.fechaSiembra)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatearCantidad(siembra.cantidadSembrada)}
                </TableCell>
              </TableRow>
            ))}
          </TablaSeccion>

          <TablaSeccion
            titulo="Cosechas"
            mensajeVacio="No se encontraron cosechas."
            vacia={datos.cosechas.length === 0}
            encabezados={[
              { texto: "Cultivo" },
              { texto: "Cama" },
              { texto: "Fecha" },
              { texto: "Cantidad obtenida", derecha: true },
              { texto: "Unidad" },
            ]}
          >
            {datos.cosechas.map((cosecha) => (
              <TableRow key={cosecha.id}>
                <TableCell className="font-medium whitespace-normal">
                  {cosecha.siembra.tipoCultivo}
                </TableCell>
                <TableCell>{cosecha.siembra.cama.codigo}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatearFecha(cosecha.fecha)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatearCantidad(cosecha.cantidadObtenida)}
                </TableCell>
                <TableCell>
                  {ETIQUETA_UNIDAD_MEDIDA[cosecha.unidadMedida]}
                </TableCell>
              </TableRow>
            ))}
          </TablaSeccion>

          {/* El backend no devuelve la cama en los tratamientos, solo el
              cultivo de la siembra, por eso no hay columna de cama. */}
          <TablaSeccion
            titulo="Tratamientos"
            mensajeVacio="No se encontraron tratamientos."
            vacia={datos.tratamientos.length === 0}
            encabezados={[
              { texto: "Cultivo" },
              { texto: "Producto" },
              { texto: "Fecha" },
              { texto: "Cantidad", derecha: true },
            ]}
          >
            {datos.tratamientos.map((tratamiento) => (
              <TableRow key={tratamiento.id}>
                <TableCell className="font-medium whitespace-normal">
                  {tratamiento.siembra.tipoCultivo}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {tratamiento.producto}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatearFecha(tratamiento.fecha)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatearCantidad(tratamiento.cantidad)}
                </TableCell>
              </TableRow>
            ))}
          </TablaSeccion>
        </>
      ) : null}
    </section>
  );
}
