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
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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

import { useProductos } from "@/features/inventario/producto/hooks/hooks";
import {
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_UNIDAD_MEDIDA,
  TIPOS_PRODUCTO,
} from "@/features/inventario/producto/models/producto.model";

import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useReporteInventario } from "../hooks/reportes-hooks";

import { getMensajeDeError } from "../servicios/reportes.service";

import {
  filtrosReporteInventarioSchema,
  type FiltrosReporteInventario,
} from "../validacion/reportes.validacion";

import { BotonesExportacionReporte } from "./botones-exportacion-reporte";

const TODOS_PRODUCTOS = "TODOS";
const TODAS_CATEGORIAS = "TODAS";

const FILTROS_SIN_APLICAR: FiltrosReporteInventario = {
  productoId: undefined,
  tipoProducto: undefined,
  fechaInicio: "",
  fechaFin: "",
};

function formatearCantidad(
  valor: number,
): string {
  return valor.toLocaleString("es-CR", {
    maximumFractionDigits: 2,
  });
}

export function ReporteInventario() {
  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] =
    useState<FiltrosReporteInventario | null>(
      null,
    );

  const productos = useProductos({
    pagina: 1,
    limite: 100,
    orden: "NOMBRE",
  });

  const reporte =
    useReporteInventario(
      filtrosAplicados ??
        FILTROS_SIN_APLICAR,
      filtrosAplicados !== null,
    );

  const productosItems = [
    {
      value: TODOS_PRODUCTOS,
      label: "Todos los productos",
    },
    ...(productos.data?.datos ?? []).map(
      (producto) => ({
        value: String(producto.id),
        label: producto.nombre,
      }),
    ),
  ];

  const categoriasItems = [
    {
      value: TODAS_CATEGORIAS,
      label: "Todas las categorías",
    },
    ...TIPOS_PRODUCTO.map((tipo) => ({
      value: tipo,
      label:
        ETIQUETA_TIPO_PRODUCTO[
          tipo
        ],
    })),
  ];

  const form = useForm({
    defaultValues: {
      productoId: "",
      tipoProducto: "",
      fechaInicio: "",
      fechaFin: "",
    },

    validators: {
      onSubmit: zodValidator(
        filtrosReporteInventarioSchema,
      ),
    },

    onSubmit: ({ value }) => {
      const nuevosFiltros =
        filtrosReporteInventarioSchema.parse(
          value,
        );

      if (
        JSON.stringify(
          nuevosFiltros,
        ) ===
        JSON.stringify(
          filtrosAplicados,
        )
      ) {
        void reporte.refetch();
        return;
      }

      setFiltrosAplicados(
        nuevosFiltros,
      );
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
            <BreadcrumbLink
              render={
                <Link href="/dashboard/reportes" />
              }
            >
              Reportes
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Inventario
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-color-company">
          Reporte de inventario
        </h1>

        <p className="mt-0.5 text-sm text-muted-foreground">
          Consulte entradas, salidas,
          existencia final y saldo actual
          de los productos.
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
          <form.Field name="productoId">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                  >
                    Producto / insumo
                  </FieldLabel>

                  <Select
                    items={
                      productosItems
                    }
                    value={
                      field.state.value !==
                      ""
                        ? field.state
                            .value
                        : productos.isLoading ||
                            productos.isError
                          ? null
                          : TODOS_PRODUCTOS
                    }
                    onValueChange={(
                      valor,
                    ) => {
                      const elegido =
                        (valor as
                          | string
                          | null) ??
                        TODOS_PRODUCTOS;

                      field.handleChange(
                        elegido ===
                          TODOS_PRODUCTOS
                          ? ""
                          : elegido,
                      );
                    }}
                    disabled={
                      productos.isLoading ||
                      productos.isError
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={
                        invalid
                      }
                      onBlur={
                        field.handleBlur
                      }
                    >
                      <SelectValue
                        placeholder={
                          productos.isLoading
                            ? "Cargando productos…"
                            : productos.isError
                              ? "No se pudo cargar"
                              : "Todos los productos"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {productosItems.map(
                        (item) => (
                          <SelectItem
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {item.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>

                  {productos.isError ? (
                    <p className="text-sm text-destructive">
                      {getMensajeDeError(
                        productos.error,
                      )}
                    </p>
                  ) : null}

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="tipoProducto">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                  >
                    Categoría
                  </FieldLabel>

                  <Select
                    items={
                      categoriasItems
                    }
                    value={
                      field.state.value ||
                      TODAS_CATEGORIAS
                    }
                    onValueChange={(
                      valor,
                    ) => {
                      const elegida =
                        (valor as
                          | string
                          | null) ??
                        TODAS_CATEGORIAS;

                      field.handleChange(
                        elegida ===
                          TODAS_CATEGORIAS
                          ? ""
                          : elegida,
                      );
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={
                        invalid
                      }
                      onBlur={
                        field.handleBlur
                      }
                    >
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>

                    <SelectContent>
                      {categoriasItems.map(
                        (item) => (
                          <SelectItem
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {item.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="fechaInicio">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                    required
                  >
                    Fecha inicio
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="date"
                    max={hoy}
                    aria-invalid={
                      invalid
                    }
                    value={
                      field.state.value
                    }
                    onBlur={
                      field.handleBlur
                    }
                    onChange={(
                      event,
                    ) =>
                      field.handleChange(
                        event.target
                          .value,
                      )
                    }
                  />

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="fechaFin">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                    required
                  >
                    Fecha fin
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="date"
                    max={hoy}
                    aria-invalid={
                      invalid
                    }
                    value={
                      field.state.value
                    }
                    onBlur={
                      field.handleBlur
                    }
                    onChange={(
                      event,
                    ) =>
                      field.handleChange(
                        event.target
                          .value,
                      )
                    }
                  />

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting ||
            reporte.isFetching
          }
        >
          {(generando) => (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  generando
                }
              >
                {generando
                  ? "Generando…"
                  : "Generar reporte"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>

      {filtrosAplicados ===
      null ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Seleccione los filtros y
          presione «Generar reporte».
        </p>
      ) : null}

      {filtrosAplicados !==
        null &&
      reporte.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {filtrosAplicados !==
        null &&
      reporte.isError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
          {getMensajeDeError(
            reporte.error,
          )}
        </p>
      ) : null}

      {filtrosAplicados !==
        null &&
      datos ? (
        datos.registros.length ===
        0 ? (
          <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
            No existen movimientos
            para los filtros
            seleccionados.
          </p>
        ) : (
          <>
            <div className="flex justify-end">
              <BotonesExportacionReporte
                reporte="inventario"
                filtros={{
                  productoId:
                    filtrosAplicados.productoId,
                  tipoProducto:
                    filtrosAplicados.tipoProducto,
                  fechaInicio:
                    filtrosAplicados.fechaInicio,
                  fechaFin:
                    filtrosAplicados.fechaFin,
                }}
              />
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>
                      Producto
                    </TableHead>

                    <TableHead>
                      Categoría
                    </TableHead>

                    <TableHead>
                      Unidad
                    </TableHead>

                    <TableHead className="text-right">
                      Entradas
                    </TableHead>

                    <TableHead className="text-right">
                      Salidas
                    </TableHead>

                    <TableHead className="text-right">
                      Existencia final
                    </TableHead>

                    <TableHead className="text-right">
                      Saldo actual
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {datos.registros.map(
                    (registro) => (
                      <TableRow
                        key={
                          registro.inventarioId
                        }
                      >
                        <TableCell className="font-medium">
                          {
                            registro.producto
                          }
                        </TableCell>

                        <TableCell>
                          {
                            ETIQUETA_TIPO_PRODUCTO[
                              registro
                                .categoria
                            ]
                          }
                        </TableCell>

                        <TableCell>
                          {
                            ETIQUETA_UNIDAD_MEDIDA[
                              registro
                                .unidadMedida
                            ]
                          }
                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {formatearCantidad(
                            registro.entradas,
                          )}
                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {formatearCantidad(
                            registro.salidas,
                          )}
                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {formatearCantidad(
                            registro.existenciaFinal,
                          )}
                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {formatearCantidad(
                            registro.saldoActual,
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )
      ) : null}
    </section>
  );
}