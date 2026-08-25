"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { crearDepartamentoSchema } from "../validacion/departamento.validacion";
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
import { useCrearDepartamento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/departamento.service";

export function DepartamentoForm() {
  const router = useRouter();
  const crearDepartamento = useCrearDepartamento();

  const form = useForm({
    defaultValues: {
      nombreUnidad: "",
      tipoActividad: "",
    },
    validators: {
      onSubmit: zodValidator(crearDepartamentoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const departamento = await crearDepartamento.mutateAsync(
          crearDepartamentoSchema.parse(value),
        );
        toast.success(
          `Departamento "${departamento.nombreUnidad}" registrado correctamente.`,
        );
        router.push("/dashboard/libro-caja/departamentos");
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
    >
      <FieldGroup>
        <form.Field name="nombreUnidad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nombre de la unidad
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Unidad Agrícola"
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

        <form.Field name="tipoActividad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de actividad
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Producción agrícola"
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

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting || crearDepartamento.isPending
          }
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar departamento"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
