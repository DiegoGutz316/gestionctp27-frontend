"use client";

import { useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api";
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

function esClaveYaUsada(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 409 &&
    error.message.includes("Idempotency-Key")
  );
}

function fechaInicial(inicio: string, fin: string): string {
  const hoy = fechaHoyLocal();
  if (hoy >= inicio && hoy <= fin) return hoy;
  return inicio;
}

const TIPOS = [
  { value: "INGRESO", label: "Ingreso (entra dinero)" },
  { value: "EGRESO", label: "Egreso (sale dinero)" },
] as const;

export function AsientoForm({
  libro,
}: {
  libro: LibroDepartamentoRespuesta;
}) {
  const crear = useCrearAsiento(libro.periodo.id, libro.fondo.id);
  const inicio = fechaPeriodoIso(libro.periodo.fechaInicio);
  const fin = fechaPeriodoIso(libro.periodo.fechaFin);
  const idempotencyKey = useRef<string | null>(null);

  function rotarClave() {
    idempotencyKey.current = globalThis.crypto.randomUUID();
  }

  const valoresIniciales: CrearAsientoInput = {
    fecha: fechaInicial(inicio, fin),
    numeroFactura: "",
    descripcion: "",
    tipoMovimiento: "INGRESO",
    monto: "",
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(crearAsientoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        idempotencyKey.current ??= globalThis.crypto.randomUUID();
        await crear.mutateAsync({
          datos: crearAsientoSchema.parse(value),
          idempotencyKey: idempotencyKey.current,
        });
        toast.success("Asiento registrado.");
        rotarClave();
        form.reset();
      } catch (error) {
        if (esClaveYaUsada(error)) {
          rotarClave();
          toast.error(
            "El envío anterior ya se había guardado. Revise el libro y, si estos datos son otro asiento, envíelo otra vez.",
          );
          return;
        }
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
          Elija si el movimiento es un ingreso o un egreso. Tope{" "}
          {VALOR_MAXIMO_FONDO_TEXTO}.
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
                  <FieldLabel htmlFor={field.name}>
                    N<sup>o</sup> factura / N<sup>0</sup> depósito
                  </FieldLabel>
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
          <form.Field name="tipoMovimiento">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Tipo de movimiento
                  </FieldLabel>
                  <Select
                    items={[...TIPOS]}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(
                        (valor as "INGRESO" | "EGRESO" | null) ?? "INGRESO",
                      )
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Seleccione ingreso o egreso" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="monto">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Monto (₡)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    inputMode="decimal"
                    placeholder="Ej: 85000 o 1.250,50"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldDescription>
                    Use punto o coma para miles o decimales. Ejemplos: 85000,
                    85.000, 85,000, 1250,50.
                  </FieldDescription>
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
