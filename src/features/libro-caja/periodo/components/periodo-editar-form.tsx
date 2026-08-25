"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { fechaPeriodoIso } from "@/features/libro-caja/formato";
import {
  editarPeriodoSchema,
  type EditarPeriodoInput,
  type PeriodoDetalleRespuesta,
} from "../validacion/periodo.validacion";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useEditarPeriodo } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";

export function PeriodoEditarForm({
  periodo,
}: {
  periodo: PeriodoDetalleRespuesta;
}) {
  const router = useRouter();
  const editarPeriodo = useEditarPeriodo(periodo.id);

  const valoresIniciales: EditarPeriodoInput = {
    nombre: periodo.nombre,
    fechaInicio: fechaPeriodoIso(periodo.fechaInicio),
    fechaFin: fechaPeriodoIso(periodo.fechaFin),
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(editarPeriodoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarPeriodo.mutateAsync(
          editarPeriodoSchema.parse(value),
        );
        toast.success(
          `Periodo "${actualizado.nombre}" actualizado correctamente.`,
        );
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

      <form.Subscribe
        selector={(state) => state.isSubmitting || editarPeriodo.isPending}
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={
                <Link href={`/dashboard/libro-caja/periodos/${periodo.id}`} />
              }
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
