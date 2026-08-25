"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  editarDepartamentoSchema,
  type DepartamentoRespuesta,
  type EditarDepartamentoInput,
} from "../validacion/departamento.validacion";
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
import { useEditarDepartamento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/departamento.service";

export function DepartamentoEditarForm({
  departamento,
}: {
  departamento: DepartamentoRespuesta;
}) {
  const router = useRouter();
  const editarDepartamento = useEditarDepartamento(departamento.id);

  const valoresIniciales: EditarDepartamentoInput = {
    nombreUnidad: departamento.nombreUnidad,
    tipoActividad: departamento.tipoActividad,
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(editarDepartamentoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarDepartamento.mutateAsync(
          editarDepartamentoSchema.parse(value),
        );
        toast.success(
          `Departamento "${actualizado.nombreUnidad}" actualizado correctamente.`,
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
      className="space-y-6"
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
      </FieldGroup>

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting || editarDepartamento.isPending
        }
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={<Link href="/dashboard/libro-caja/departamentos" />}
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
