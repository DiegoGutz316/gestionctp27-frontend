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

import { useSiembras } from "@/features/agricola/siembra/hooks/siembra-hooks";
import { formatearFecha as formatearFechaSiembra } from "@/features/agricola/siembra/models/siembra.model";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarTratamiento } from "../hooks/tratamiento-hooks";
import {
  fechaHoyLocal,
  registrarTratamientoSchema,
} from "../models/tratamiento.model";
import { getMensajeDeError } from "../servicios/tratamiento.service";

export function TratamientoForm() {
  const router = useRouter();

  const siembras = useSiembras();
  const registrar = useRegistrarTratamiento();

  const siembrasItems = (siembras.data ?? []).map(
    (siembra) => ({
      value: String(siembra.id),
      label: `${siembra.tipoCultivo} — ${siembra.cama.codigo} — ${formatearFechaSiembra(
        siembra.fechaSiembra,
      )}`,
    }),
  );

  const siembraDe = (
    siembraId: string,
  ) =>
    (siembras.data ?? []).find(
      (siembra) =>
        String(siembra.id) ===
        siembraId,
    );

  const form = useForm({
    defaultValues: {
      siembraId: "",
      producto: "",
      fecha: "",
      cantidad: "",
      observaciones: "",
    },

    validators: {
      onSubmit: ({ value }) => {
        const errores = zodValidator(
          registrarTratamientoSchema,
        )({ value });

        if (errores) return errores;

        // El esquema no puede comprobarlo por su cuenta: el minimo depende de
        // la siembra elegida. Sin esto se registran tratamientos anteriores a
        // la siembra, que el backend tambien rechaza.
        const siembra = siembraDe(
          value.siembraId,
        );

        if (
          siembra &&
          value.fecha <
            siembra.fechaSiembra
        ) {
          return {
            fields: {
              fecha: `El tratamiento no puede ser anterior a la siembra (${formatearFechaSiembra(
                siembra.fechaSiembra,
              )}).`,
            },
          };
        }

        return undefined;
      },
    },

    onSubmit: async ({ value }) => {
      try {
        const datos =
          registrarTratamientoSchema.parse(
            value,
          );

        await registrar.mutateAsync(datos);

        toast.success(
          "Tratamiento registrado correctamente.",
        );

        router.push(
          "/dashboard/agricola/tratamientos",
        );
      } catch (error) {
        toast.error(
          getMensajeDeError(error),
        );
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
        <form.Field name="siembraId">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );

            const invalid =
              errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Siembra
                </FieldLabel>

                <Select
                  items={siembrasItems}
                  value={
                    field.state.value === ""
                      ? null
                      : field.state.value
                  }
                  onValueChange={(valor) =>
                    field.handleChange(
                      (valor as
                        | string
                        | null) ?? "",
                    )
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                    disabled={
                      siembras.isLoading ||
                      siembrasItems.length ===
                        0
                    }
                  >
                    <SelectValue
                      placeholder={
                        siembras.isLoading
                          ? "Cargando siembras…"
                          : "Seleccione una siembra"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {siembrasItems.map(
                      (item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                {siembras.isError ? (
                  <p className="text-sm text-destructive">
                    No se pudieron cargar
                    las siembras.
                  </p>
                ) : null}

                {!siembras.isLoading &&
                !siembras.isError &&
                siembrasItems.length ===
                  0 ? (
                  <p className="text-sm text-muted-foreground">
                    Debe registrar una
                    siembra antes de
                    registrar un
                    tratamiento.
                  </p>
                ) : null}

                <FieldError
                  errors={errors}
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="producto">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );

            const invalid =
              errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                >
                  Producto aplicado
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Fertilizante NPK 10-30-10"
                  maxLength={120}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={
                    field.handleBlur
                  }
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError
                  errors={errors}
                />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                    required
                  >
                    Fecha del tratamiento
                  </FieldLabel>

                  <form.Subscribe
                    selector={(
                      estado,
                    ) =>
                      estado.values
                        .siembraId
                    }
                  >
                    {(siembraId) => (
                      <Input
                        id={field.name}
                        type="date"
                        min={
                          siembraDe(
                            siembraId,
                          )?.fechaSiembra
                        }
                        max={fechaHoyLocal()}
                        aria-invalid={
                          invalid
                        }
                        value={
                          field.state
                            .value
                        }
                        onBlur={
                          field.handleBlur
                        }
                        onChange={(
                          event,
                        ) =>
                          field.handleChange(
                            event.target
                              .value,
                          )
                        }
                      />
                    )}
                  </form.Subscribe>

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="cantidad">
            {(field) => {
              const errors =
                fieldErrors(
                  field.state.meta
                    .errors,
                );

              const invalid =
                errors.length > 0;

              return (
                <Field
                  data-invalid={
                    invalid
                  }
                >
                  <FieldLabel
                    htmlFor={
                      field.name
                    }
                    required
                  >
                    Cantidad aplicada
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="number"
                    min="0.01"
                    max="9999999999.99"
                    step="0.01"
                    placeholder="Ej: 2.5"
                    aria-invalid={
                      invalid
                    }
                    value={
                      field.state.value
                    }
                    onBlur={
                      field.handleBlur
                    }
                    onChange={(
                      event,
                    ) =>
                      field.handleChange(
                        event.target
                          .value,
                      )
                    }
                  />

                  <FieldError
                    errors={errors}
                  />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );

            const invalid =
              errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                >
                  Observaciones
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Aplicado después del riego"
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={
                    field.handleBlur
                  }
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <FieldError
                  errors={errors}
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting ||
            registrar.isPending
          }
        >
          {(guardando) => (
            <Button
              type="submit"
              disabled={
                guardando ||
                siembrasItems.length ===
                  0
              }
            >
              {guardando
                ? "Guardando…"
                : "Registrar tratamiento"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}