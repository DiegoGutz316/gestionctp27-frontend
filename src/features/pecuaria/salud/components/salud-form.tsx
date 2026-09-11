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
import {
  esAnimalActivo,
  etiquetaEspecie,
} from "@/features/pecuaria/animal/models/animal.model";
import { useRegistrarSalud } from "../hooks/hooks";
import {
  CONDICIONES_SALUD,
  ETIQUETA_CONDICION_SALUD,
  fechaHoyLocal,
  type CondicionSalud,
} from "../models/salud.model";
import { getMensajeDeError } from "../servicios/salud.service";
import { registrarSaludSchema } from "../validacion/salud.validacion";

const condicionesItems = CONDICIONES_SALUD.map((condicion) => ({
  value: condicion,
  label: ETIQUETA_CONDICION_SALUD[condicion],
}));

export function SaludForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const animales = useAnimales();
  const registrar = useRegistrarSalud();

  const animalInicial = searchParams.get("animalId") ?? "";
  const activos = (animales.data ?? []).filter((animal) =>
    esAnimalActivo(animal.estado),
  );
  const animalesItems = activos.map((animal) => ({
    value: String(animal.id),
    label: `${animal.codigo} — ${animal.nombre} (${etiquetaEspecie(animal.especie)})`,
  }));
  const animalPreseleccionado = activos.find(
    (animal) => String(animal.id) === animalInicial,
  );
  const etiquetaAnimalPreseleccionado = animalPreseleccionado
    ? `${animalPreseleccionado.codigo} — ${animalPreseleccionado.nombre} (${etiquetaEspecie(animalPreseleccionado.especie)})`
    : "";

  const form = useForm({
    defaultValues: {
      animalId: animalInicial,
      fecha: fechaHoyLocal(),
      condicionObservada: "" as CondicionSalud | "",
      diagnostico: "",
      observaciones: "",
    },
    validators: {
      onSubmit: zodValidator(registrarSaludSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const registro = await registrar.mutateAsync(
          registrarSaludSchema.parse(value),
        );

        toast.success("Estado de salud registrado correctamente.");
        router.push(`/dashboard/pecuaria/${registro.animalId}`);
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

        <form.Field name="fecha">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Fecha
                </FieldLabel>

                <Input
                  id={field.name}
                  type="date"
                  max={fechaHoyLocal()}
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

        <form.Field name="condicionObservada">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Condición observada
                </FieldLabel>

                <Select
                  items={condicionesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as CondicionSalud | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione la condición" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicionesItems.map((item) => (
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

        <form.Field name="diagnostico">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Diagnóstico</FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Mastitis, cólicos, herida superficial"
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

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Notas del docente o tratamiento aplicado"
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
          selector={(state) => state.isSubmitting || registrar.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar salud"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
