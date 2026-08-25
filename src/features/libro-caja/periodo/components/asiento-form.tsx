"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  fechaHoyLocal,
  fechaPeriodoIso,
} from "@/features/libro-caja/formato";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { VALOR_MAXIMO_FONDO_TEXTO } from "../models/periodo.model";
import {
  crearAsientoSchema,
  type CrearAsientoInput,
  type LibroDepartamentoRespuesta,
} from "../validacion/asiento.validacion";
import { useCrearAsiento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";

function fechaInicial(inicio: string, fin: string): string {
  const hoy = fechaHoyLocal();
  if (hoy >= inicio && hoy <= fin) return hoy;
  return inicio;
}

export function AsientoForm({
  libro,
}: {
  libro: LibroDepartamentoRespuesta;
}) {
  const crear = useCrearAsiento(libro.periodo.id, libro.fondo.id);
  const inicio = fechaPeriodoIso(libro.periodo.fechaInicio);
  const fin = fechaPeriodoIso(libro.periodo.fechaFin);

  const valoresIniciales: CrearAsientoInput = {
    fecha: fechaInicial(inicio, fin),
    numeroFactura: "",
    descripcion: "",
    ingresos: "",
    egresos: "",
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(crearAsientoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        await crear.mutateAsync(crearAsientoSchema.parse(value));
        toast.success("Asiento registrado.");
        form.reset();
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
      className="space-y-4 rounded-xl border bg-card p-4 shadow-xs"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Nuevo asiento
        </h2>
        <FieldDescription>
          Llene ingresos o egresos, no ambos. Tope {VALOR_MAXIMO_FONDO_TEXTO}.
        </FieldDescription>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="date"
                    min={inicio}
                    max={fin}
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

          <form.Field name="numeroFactura">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>N.º factura</FieldLabel>
                  <Input
                    id={field.name}
                    maxLength={40}
                    placeholder="Opcional"
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

        <form.Field name="descripcion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Descripción
                </FieldLabel>
                <Input
                  id={field.name}
                  maxLength={250}
                  placeholder="Ej: Venta de carne en canal"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="ingresos">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Ingresos</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    placeholder="0.00"
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

          <form.Field name="egresos">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Egresos</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    placeholder="0.00"
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
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting || crear.isPending}
      >
        {(guardando) => (
          <div className="flex justify-end">
            <Button type="submit" disabled={guardando}>
              {guardando ? "Registrando…" : "Registrar asiento"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
