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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useEditarAnimal } from "../hooks/hooks";
import {
  CATEGORIAS_BOVINAS,
  ESPECIES_ANIMAL,
  ESTADOS_ANIMAL,
  ETIQUETA_CATEGORIA_BOVINA,
  ETIQUETA_ESPECIE_ANIMAL,
  ETIQUETA_ESTADO_ANIMAL,
  ETIQUETA_TIPO_INVENTARIO_ANIMAL,
  TIPOS_INVENTARIO_ANIMAL,
  especiesDeInventario,
  tipoInventarioDeEspecie,
  type CategoriaBovina,
  type EspecieAnimal,
  type EstadoAnimal,
  type TipoInventarioAnimal,
} from "../models/animal.model";
import { getMensajeDeError } from "../servicios/animal.service";
import {
  crearAnimalSchema,
  type AnimalRespuesta,
} from "../validacion/animal.validacion";

const tiposInventarioItems = TIPOS_INVENTARIO_ANIMAL.map((tipo) => ({
  value: tipo,
  label: ETIQUETA_TIPO_INVENTARIO_ANIMAL[tipo],
}));

const estadosItems = ESTADOS_ANIMAL.map((estado) => ({
  value: estado,
  label: ETIQUETA_ESTADO_ANIMAL[estado],
}));

export function AnimalEditarForm({
  animal,
}: {
  animal: AnimalRespuesta;
}) {
  const router = useRouter();
  const editarAnimal = useEditarAnimal(animal.id);

  const valoresIniciales = {
    codigo: animal.codigo,
    nombre: animal.nombre,
    tipoInventario: tipoInventarioDeEspecie(animal.especie),
    especie: ESPECIES_ANIMAL.includes(animal.especie as EspecieAnimal)
      ? (animal.especie as EspecieAnimal)
      : "",
    categoriaBovina: CATEGORIAS_BOVINAS.includes(
      animal.categoriaBovina as CategoriaBovina,
    )
      ? (animal.categoriaBovina as CategoriaBovina)
      : "",
    raza: animal.raza,
    fechaNacimiento: animal.fechaNacimiento,
    estado: ESTADOS_ANIMAL.includes(animal.estado as EstadoAnimal)
      ? (animal.estado as EstadoAnimal)
      : "",
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

        <form.Field name="tipoInventario">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de inventario
                </FieldLabel>

                <Select
                  items={tiposInventarioItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) => {
                    const siguiente =
                      (valor as TipoInventarioAnimal | null) ?? "";
                    field.handleChange(siguiente);
                    if (siguiente === "GANADO_BOVINO") {
                      form.setFieldValue("especie", "VACA");
                    } else if (siguiente === "ESPECIES_MENORES") {
                      if (form.getFieldValue("especie") === "VACA") {
                        form.setFieldValue("especie", "");
                      }
                      form.setFieldValue("categoriaBovina", "");
                    } else {
                      form.setFieldValue("especie", "");
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
                    <SelectValue placeholder="Bovinos o especies menores" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposInventarioItems.map((item) => (
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

        <form.Subscribe selector={(state) => state.values.tipoInventario}>
          {(tipoInventario) => {
            if (tipoInventario === "GANADO_BOVINO") {
              return (
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
              );
            }

            if (tipoInventario === "ESPECIES_MENORES") {
              const especiesItems = especiesDeInventario(tipoInventario).map(
                (especie) => ({
                  value: especie,
                  label: ETIQUETA_ESPECIE_ANIMAL[especie],
                }),
              );

              return (
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
                          value={
                            field.state.value === "" ? null : field.state.value
                          }
                          onValueChange={(valor) =>
                            field.handleChange(
                              (valor as EspecieAnimal | null) ?? "",
                            )
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            className="w-full"
                            aria-invalid={invalid}
                            onBlur={field.handleBlur}
                          >
                            <SelectValue placeholder="Chancho, gallina, pollo o cabra" />
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
              );
            }

            return null;
          }}
        </form.Subscribe>

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