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
import { zodValidator } from "@/lib/zod-form";

import { useCrearAnimal } from "../hooks/hooks";
import {
  CATEGORIAS_BOVINAS,
  ESPECIES_ANIMAL,
  ESTADOS_ANIMAL,
  ETIQUETA_CATEGORIA_BOVINA,
  ETIQUETA_ESPECIE_ANIMAL,
  ETIQUETA_ESTADO_ANIMAL,
  type CategoriaBovina,
  type EspecieAnimal,
  type EstadoAnimal,
} from "../models/animal.model";
import { getMensajeDeError } from "../servicios/animal.service";
import { crearAnimalSchema } from "../validacion/animal.validacion";

const especiesItems = ESPECIES_ANIMAL.map((especie) => ({
  value: especie,
  label: ETIQUETA_ESPECIE_ANIMAL[especie],
}));

const estadosItems = ESTADOS_ANIMAL.map((estado) => ({
  value: estado,
  label: ETIQUETA_ESTADO_ANIMAL[estado],
}));

export function AnimalForm() {
  const router = useRouter();
  const crearAnimal = useCrearAnimal();

  const form = useForm({
    defaultValues: {
      codigo: "",
      nombre: "",
      especie: "" as EspecieAnimal | "",
      categoriaBovina: "" as CategoriaBovina | "",
      raza: "",
      fechaNacimiento: "",
      estado: "ACTIVO" as EstadoAnimal | "",
      observaciones: "",
    },

    validators: {
      onSubmit: zodValidator(crearAnimalSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const animal = await crearAnimal.mutateAsync(
          crearAnimalSchema.parse(value),
        );

        toast.success(
          `Animal "${animal.nombre}" registrado correctamente.`,
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
    >
      <FieldGroup>
        <form.Field name="codigo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Código del animal
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: BOV-001"
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

        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nombre del animal
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Luna"
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

        <form.Field name="especie">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Especie
                </FieldLabel>

                <Select
                  items={especiesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) => {
                    const siguiente = (valor as EspecieAnimal | null) ?? "";
                    field.handleChange(siguiente);
                    if (siguiente !== "VACA") {
                      form.setFieldValue("categoriaBovina", "");
                    }
                  }}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione la especie" />
                  </SelectTrigger>
                  <SelectContent>
                    {especiesItems.map((item) => (
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

        <form.Subscribe selector={(state) => state.values.especie}>
          {(especie) =>
            especie === "VACA" ? (
              <form.Field name="categoriaBovina">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  const items = CATEGORIAS_BOVINAS.map((categoria) => ({
                    value: categoria,
                    label: ETIQUETA_CATEGORIA_BOVINA[categoria],
                  }));

                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Categoría (ganado bovino)
                      </FieldLabel>

                      <Select
                        items={items}
                        value={
                          field.state.value === "" ? null : field.state.value
                        }
                        onValueChange={(valor) =>
                          field.handleChange(
                            (valor as CategoriaBovina | null) ?? "",
                          )
                        }
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={invalid}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Toro, novilla, vaca, ternero/a o torete" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((item) => (
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
            ) : null
          }
        </form.Subscribe>

        <form.Field name="raza">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Raza
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Holstein"
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

        <form.Field name="fechaNacimiento">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Fecha de nacimiento
                </FieldLabel>

                <Input
                  id={field.name}
                  type="date"
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

        <form.Field name="estado">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Estado
                </FieldLabel>

                <Select
                  items={estadosItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as EstadoAnimal | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosItems.map((item) => (
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
                  placeholder="Ej: Animal en buenas condiciones"
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
            state.isSubmitting || crearAnimal.isPending
          }
        >
          {(guardando) => (
            <Button
              type="submit"
              disabled={guardando}
            >
              {guardando
                ? "Guardando…"
                : "Registrar animal"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}