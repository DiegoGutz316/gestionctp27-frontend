"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fieldErrors } from "@/lib/form-errors";
import { fechaHoyCR } from "@/lib/fechas";
import { zodValidator } from "@/lib/zod-form";

import { useAnimales } from "@/features/pecuaria/animal/hooks/hooks";
import { useCrearDesparasitacion } from "@/features/pecuaria/animal/hooks/desparasitacion-hooks";
import { getMensajeDeError } from "@/features/pecuaria/animal/servicios/desparasitacion.service";
import { crearDesparasitacionSchema } from "@/features/pecuaria/animal/validacion/desparasitacion.validacion";

export function DesparasitacionForm() {
  const router = useRouter();
  const crearDesparasitacion = useCrearDesparasitacion();

  // Sin filtros, el listado ya devuelve solo los animales activos, que es
  // justo lo que pide el criterio: "registrar una desparasitación para un
  // animal activo".
  const animales = useAnimales();
  const lista = animales.data ?? [];

  const animalesItems = lista.map((animal) => ({
    value: String(animal.id),
    label: `${animal.codigo} · ${animal.nombre}`,
  }));

  const form = useForm({
    defaultValues: {
      animalId: "",
      producto: "",
      fecha: "",
      observaciones: "",
    },

    validators: {
      onSubmit: zodValidator(crearDesparasitacionSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const datos = crearDesparasitacionSchema.parse(value);
        await crearDesparasitacion.mutateAsync(datos);

        const animal = lista.find(
          (candidato) => candidato.id === datos.animalId,
        );

        toast.success(
          `Desparasitación registrada para "${animal?.nombre ?? "el animal"}".`,
        );

        router.push("/dashboard/pecuaria");
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  // Un fallo de red también deja la lista vacía, así que hay que excluirlo
  // expresamente: si no, la pantalla dice a la vez "no hay animales" y "no se
  // pudo cargar", que se contradicen y culpan al usuario de un fallo del
  // servidor.
  const cargaFallo = animales.isError;

  // Sin animales activos no hay nada que desparasitar: es más útil decirlo que
  // ofrecer un selector vacío.
  const sinAnimales =
    !animales.isLoading && !cargaFallo && lista.length === 0;

  // En los tres casos no hay animal que elegir, así que tampoco se puede
  // registrar nada.
  const sinSeleccionPosible =
    animales.isLoading || cargaFallo || sinAnimales;

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
                  value={
                    field.state.value === "" ? null : field.state.value
                  }
                  onValueChange={(valor) =>
                    field.handleChange((valor as string | null) ?? "")
                  }
                  disabled={sinSeleccionPosible}
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
                    No hay animales activos registrados.
                  </p>
                ) : null}

                {cargaFallo ? (
                  <p className="text-sm text-destructive">
                    No se pudo cargar la lista de animales. Revise la conexión
                    e inténtelo de nuevo.
                  </p>
                ) : null}

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="producto">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Producto aplicado
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Ivermectina 1%"
                  maxLength={120}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="fecha">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Fecha de aplicación
                </FieldLabel>

                <Input
                  id={field.name}
                  type="date"
                  max={fechaHoyCR()}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  Observaciones
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Segunda dosis del ciclo"
                  maxLength={500}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting || crearDesparasitacion.isPending
          }
        >
          {(guardando) => (
            <Button
              type="submit"
              disabled={guardando || cargaFallo || sinAnimales}
            >
              {guardando
                ? "Guardando…"
                : "Registrar desparasitación"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
