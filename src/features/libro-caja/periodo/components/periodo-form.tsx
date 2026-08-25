"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  abrirPeriodoSchema,
  type AbrirPeriodoInput,
} from "../validacion/periodo.validacion";
import type { DepartamentoRespuesta } from "@/features/libro-caja/departamento/validacion/departamento.validacion";
import { VALOR_MAXIMO_FONDO_TEXTO } from "../models/periodo.model";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useDepartamentos } from "@/features/libro-caja/departamento/hooks/hooks";
import { useAbrirPeriodo, usePeriodos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";

const LIMITE_DEPARTAMENTOS = 100;

export function PeriodoForm() {
  const router = useRouter();
  const departamentos = useDepartamentos({
    pagina: 1,
    limite: LIMITE_DEPARTAMENTOS,
    activo: true,
  });
  const periodosAbiertos = usePeriodos({
    estado: "ABIERTO",
    pagina: 1,
    limite: 1,
  });

  if (departamentos.isLoading || periodosAbiertos.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (departamentos.isError) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(departamentos.error)}
      </p>
    );
  }

  if (periodosAbiertos.isError) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(periodosAbiertos.error)}
      </p>
    );
  }

  const periodoAbierto = periodosAbiertos.data?.datos[0];
  if (periodoAbierto) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">
          Solo puede haber un periodo abierto. &quot;{periodoAbierto.nombre}&quot;
          sigue abierto. Cambiar el nombre no abre otro: hay que cerrar este
          primero.
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/libro-caja/periodos")}
          >
            Volver al listado
          </Button>
          <Button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/libro-caja/periodos/${periodoAbierto.id}`,
              )
            }
          >
            Ir a cerrar &quot;{periodoAbierto.nombre}&quot;
          </Button>
        </div>
      </div>
    );
  }

  const lista = departamentos.data?.datos ?? [];
  if (lista.length === 0) {
    return (
      <FieldDescription>
        No hay departamentos activos.{" "}
        <Link
          href="/dashboard/libro-caja/departamentos/nuevo"
          prefetch={false}
          className="font-medium text-color-company underline-offset-4 hover:underline"
        >
          Cree al menos uno
        </Link>{" "}
        antes de abrir un periodo.
      </FieldDescription>
    );
  }

  return <PeriodoFormCampos departamentos={lista} />;
}

function PeriodoFormCampos({
  departamentos,
}: {
  departamentos: DepartamentoRespuesta[];
}) {
  const router = useRouter();
  const abrirPeriodo = useAbrirPeriodo();

  const valoresIniciales: AbrirPeriodoInput = {
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    fondos: departamentos.map((departamento) => ({
      departamentoId: departamento.id,
      monto: "",
    })),
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(abrirPeriodoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const periodo = await abrirPeriodo.mutateAsync(
          abrirPeriodoSchema.parse(value),
        );
        toast.success(`Periodo "${periodo.nombre}" abierto correctamente.`);
        router.push(`/dashboard/libro-caja/periodos/${periodo.id}`);
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
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nombre del periodo
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: I semestre 2026"
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

        <form.Field name="fechaInicio">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Fecha de inicio
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
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
                  Fecha de fin
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
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
      </FieldGroup>

      <FieldSet>
        <FieldLegend>Fondo de cada departamento</FieldLegend>
        <FieldDescription>
          Escriba el saldo que queda de periodos anteriores. Puede ser ₡0,00.
          Tope {VALOR_MAXIMO_FONDO_TEXTO}.
        </FieldDescription>
        <FieldGroup>
          {departamentos.map((departamento, indice) => (
            <form.Field
              key={departamento.id}
              name={`fondos[${indice}].monto`}
            >
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      {departamento.nombreUnidad}
                    </FieldLabel>
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldDescription>
                      {departamento.tipoActividad}
                    </FieldDescription>
                    <FieldError errors={errors} />
                  </Field>
                );
              }}
            </form.Field>
          ))}
        </FieldGroup>
      </FieldSet>

      <form.Subscribe
        selector={(state) => state.isSubmitting || abrirPeriodo.isPending}
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              onClick={() => router.push("/dashboard/libro-caja/periodos")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Abriendo…" : "Abrir periodo"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
