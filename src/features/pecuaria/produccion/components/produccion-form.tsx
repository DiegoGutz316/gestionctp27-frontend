"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

import { useAnimales } from "@/features/pecuaria/animal/hooks/hooks";
import { useRegistrarProduccion } from "../hooks/hooks";
import {
  ETIQUETA_TIPO_PRODUCCION,
  TIPOS_PRODUCCION,
  UNIDAD_TIPO_PRODUCCION,
  esAnimalActivo,
  etiquetaEspecieProduccion,
  fechaHoyLocal,
  type TipoProduccion,
} from "../models/produccion.model";
import { getMensajeDeError } from "../servicios/produccion.service";
import { registrarProduccionSchema } from "../validacion/produccion.validacion";

export function ProduccionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const animales = useAnimales();
  const registrar = useRegistrarProduccion();

  const animalInicial = searchParams.get("animalId") ?? "";
  const activos = (animales.data ?? []).filter((animal) =>
    esAnimalActivo(animal.estado),
  );
  const animalesItems = activos.map((animal) => ({
    value: String(animal.id),
    label: `${animal.codigo} — ${animal.nombre} (${etiquetaEspecieProduccion(animal.especie)})`,
  }));
  const animalPreseleccionado = activos.find(
    (animal) => String(animal.id) === animalInicial,
  );
  const etiquetaAnimalPreseleccionado = animalPreseleccionado
    ? `${animalPreseleccionado.codigo} — ${animalPreseleccionado.nombre} (${etiquetaEspecieProduccion(animalPreseleccionado.especie)})`
    : "";
  const tiposItems = TIPOS_PRODUCCION.map((tipo) => ({
    value: tipo,
    label: `${ETIQUETA_TIPO_PRODUCCION[tipo]} (${UNIDAD_TIPO_PRODUCCION[tipo]})`,
  }));

  const form = useForm({
    defaultValues: {
      animalId: animalInicial,
      tipoProduccion: "" as TipoProduccion | "",
      cantidad: "",
      fecha: fechaHoyLocal(),
    },
    validators: {
      onSubmit: zodValidator(registrarProduccionSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const produccion = await registrar.mutateAsync(
          registrarProduccionSchema.parse(value),
        );

        toast.success("Producción registrada correctamente.");
        router.push(
          `/dashboard/pecuaria/produccion?animalId=${produccion.animalId}`,
        );
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
        <form.Field name="animalId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Animal
                </FieldLabel>

                {animalPreseleccionado ? (
                  <Input
                    id={field.name}
                    value={etiquetaAnimalPreseleccionado}
                    readOnly
                    aria-readonly="true"
                    aria-invalid={invalid}
                    className="bg-muted/40"
                  />
                ) : (
                  <Select
                    items={animalesItems}
                    value={field.state.value === "" ? null : field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange((valor as string | null) ?? "")
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      disabled={animales.isLoading}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Seleccione un animal activo" />
                    </SelectTrigger>
                    <SelectContent>
                      {animalesItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="tipoProduccion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de producción
                </FieldLabel>

                <Select
                  items={tiposItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(
                      (valor as TipoProduccion | null) ?? "",
                    )
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposItems.map((item) => (
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

        <form.Field name="cantidad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Cantidad
                </FieldLabel>

                <Input
                  id={field.name}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 12.5"
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
                  Fecha de producción
                </FieldLabel>

                <Input
                  id={field.name}
                  type="date"
                  max={fechaHoyLocal()}
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
            state.isSubmitting || registrar.isPending
          }
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar producción"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
