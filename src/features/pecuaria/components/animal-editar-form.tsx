"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

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

import { useEditarAnimal } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/animal.service";
import {
  crearAnimalSchema,
  type AnimalRespuesta,
  type CrearAnimalInput,
} from "../validacion/animal.validacion";

export function AnimalEditarForm({
  animal,
}: {
  animal: AnimalRespuesta;
}) {
  const router = useRouter();
  const editarAnimal = useEditarAnimal(animal.id);

  const valoresIniciales: CrearAnimalInput = {
    codigo: animal.codigo,
    nombre: animal.nombre,
    especie: animal.especie,
    raza: animal.raza,
    fechaNacimiento: animal.fechaNacimiento,
    estado: animal.estado,
    observaciones: animal.observaciones ?? "",
  };

  const form = useForm({
    defaultValues: valoresIniciales,

    validators: {
      onSubmit: zodValidator(crearAnimalSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarAnimal.mutateAsync(
          crearAnimalSchema.parse(value),
        );

        toast.success(
          `Animal "${actualizado.nombre}" actualizado correctamente.`,
        );

        router.push("/dashboard/pecuaria");
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
        <form.Field name="codigo">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Código del animal
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Nombre del animal
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="especie">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Especie
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="raza">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Raza
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="fechaNacimiento">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Fecha de nacimiento
                </FieldLabel>

                <Input
                  id={field.name}
                  type="date"
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="estado">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Estado
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  Observaciones
                </FieldLabel>

                <Input
                  id={field.name}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting ||
          editarAnimal.isPending
        }
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={
                <Link href="/dashboard/pecuaria" />
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={guardando}
            >
              {guardando
                ? "Guardando…"
                : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}