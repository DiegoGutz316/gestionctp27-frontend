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

import { useAnimales } from "@/features/pecuaria/animal/hooks/hooks";
import {
  ETIQUETA_TIPO_PRODUCCION,
  UNIDAD_TIPO_PRODUCCION,
  esAnimalActivo,
  etiquetaEspecieProduccion,
  formatearCantidad,
  formatearFecha,
} from "@/features/pecuaria/produccion/models/produccion.model";
import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useReporteProduccionPecuaria } from "../hooks/reportes-hooks";
import { getMensajeDeError } from "../servicios/reportes.service";
import {
  filtrosReporteProduccionPecuariaSchema,
  type FiltrosReporteProduccionPecuaria,
} from "../validacion/reportes.validacion";

const FILTROS_SIN_APLICAR: FiltrosReporteProduccionPecuaria = {
  animalId: 0,
  fechaInicio: "",
  fechaFin: "",
};

export function ReporteProduccionPecuaria() {
  // Lo que el usuario edita vive en el formulario; lo que se consulta vive
  // aquí y solo cambia al presionar «Generar reporte».
  const [aplicados, setAplicados] =
    useState<FiltrosReporteProduccionPecuaria | null>(null);

  const reporte = useReporteProduccionPecuaria(
    aplicados ?? FILTROS_SIN_APLICAR,
    aplicados !== null,
  );

  // Un reporte histórico también es válido para un animal dado de baja: el
  // backend solo exige que el animal exista.
  const animales = useAnimales({ incluirInactivos: true });
  const animalesItems = (animales.data ?? []).map((animal) => ({
    value: String(animal.id),
    label: `${animal.codigo} — ${animal.nombre} (${etiquetaEspecieProduccion(animal.especie)})${
      esAnimalActivo(animal.estado) ? "" : " · Inactivo"
    }`,
  }));

  const cargaFallo = animales.isError;
  const sinAnimales =
    !animales.isLoading && !cargaFallo && animalesItems.length === 0;

  const form = useForm({
    defaultValues: {
      animalId: "",
      fechaInicio: "",
      fechaFin: "",
    },

    validators: {
      onSubmit: zodValidator(filtrosReporteProduccionPecuariaSchema),
    },

    onSubmit: ({ value }) => {
      const nuevos = filtrosReporteProduccionPecuariaSchema.parse(value);

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
            <BreadcrumbPage>Producción pecuaria</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Reporte de producción pecuaria
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Consulte la producción de un animal en un período y sus totales por
          tipo de producción.
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <form.Field name="animalId">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Animal
                  </FieldLabel>

                  <Select
                    items={animalesItems}
                    value={field.state.value === "" ? null : field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange((valor as string | null) ?? "")
                    }
                    disabled={
                      animales.isLoading || cargaFallo || sinAnimales
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue
                        placeholder={
                          animales.isLoading
                            ? "Cargando animales…"
                            : cargaFallo
                              ? "No se pudo cargar"
                              : "Seleccione un animal"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {animalesItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {sinAnimales ? (
                    <p className="text-sm text-muted-foreground">
                      No hay animales registrados.
                    </p>
                  ) : null}

                  {cargaFallo ? (
                    <p className="text-sm text-destructive">
                      {getMensajeDeError(animales.error)}
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
              <Button type="submit" disabled={generando || cargaFallo}>
                {generando ? "Generando…" : "Generar reporte"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>

      {aplicados === null ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Seleccione un animal y el período, y presione «Generar reporte».
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

      {aplicados !== null && datos ? (
        <>
          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {datos.animal.codigo} — {datos.animal.nombre}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {etiquetaEspecieProduccion(datos.animal.especie)} · Período del{" "}
                {formatearFecha(datos.fechaInicio)} al{" "}
                {formatearFecha(datos.fechaFin)}
              </p>
            </CardHeader>
          </Card>

          {datos.registros.length === 0 ? (
            <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              No se encontraron datos para los filtros seleccionados.
            </p>
          ) : (
            <>
              {datos.totales.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {datos.totales.map((total) => (
                    <Card key={total.tipoProduccion} className="shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total {ETIQUETA_TIPO_PRODUCCION[total.tipoProduccion]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold tabular-nums tracking-tight">
                          {formatearCantidad(total.cantidad)}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            {UNIDAD_TIPO_PRODUCCION[total.tipoProduccion]}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Animal</TableHead>
                      <TableHead>Tipo de producción</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {datos.registros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="whitespace-normal">
                          {datos.animal.codigo} — {datos.animal.nombre}
                        </TableCell>
                        <TableCell>
                          {ETIQUETA_TIPO_PRODUCCION[registro.tipoProduccion]}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatearCantidad(registro.cantidad)}{" "}
                          {UNIDAD_TIPO_PRODUCCION[registro.tipoProduccion]}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatearFecha(registro.fecha)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </>
      ) : null}
    </section>
  );
}
