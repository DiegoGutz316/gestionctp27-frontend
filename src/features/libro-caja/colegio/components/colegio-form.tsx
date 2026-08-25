"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  actualizarColegioSchema,
  type ActualizarColegioInput,
  type ColegioRespuesta,
} from "../validacion/colegio.validacion";
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
import { useActualizarColegio } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/colegio.service";

export function ColegioForm({ colegio }: { colegio: ColegioRespuesta }) {
  const router = useRouter();
  const actualizar = useActualizarColegio();

  const valoresIniciales: ActualizarColegioInput = {
    nombre: colegio.nombre,
    numeroCuentaBancaria: colegio.numeroCuentaBancaria,
    entidadDeposito: colegio.entidadDeposito,
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(actualizarColegioSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await actualizar.mutateAsync(
          actualizarColegioSchema.parse(value),
        );
        toast.success(
          `Información de "${actualizado.nombre}" actualizada correctamente.`,
        );
        router.push("/dashboard/libro-caja");
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
                  Nombre del colegio
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: CTP 27 de abril"
                  maxLength={150}
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

        <form.Field name="numeroCuentaBancaria">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Número de cuenta bancaria
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: 001-0001234-5"
                  maxLength={50}
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

        <form.Field name="entidadDeposito">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Entidad de depósito
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Banco Nacional de Costa Rica"
                  maxLength={150}
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
        selector={(state) => state.isSubmitting || actualizar.isPending}
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              onClick={() => router.push("/dashboard/libro-caja")}
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
