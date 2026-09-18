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
import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarCosecha } from "../hooks/cosecha-hooks";
import { registrarCosechaSchema } from "../models/cosecha.model";
import { getMensajeDeError } from "../servicios/cosecha.service";

export function CosechaForm() {
  const router = useRouter();

  const siembras = useSiembras();
  const registrar = useRegistrarCosecha();

  const lista = siembras.data ?? [];

  const siembrasItems = lista.map((siembra) => ({
    value: String(siembra.id),
    label: `${siembra.tipoCultivo} — ${siembra.cama.codigo} — ${formatearFechaSiembra(
      siembra.fechaSiembra,
    )}`,
  }));

  const siembraDe = (siembraId: string) =>
    lista.find((siembra) => String(siembra.id) === siembraId);

  // Un fallo de red también deja la lista vacía. Si no se distinguen, la
  // pantalla diría que no hay siembras cuando el problema es del servidor.
  const cargaFallo = siembras.isError;

  const sinSiembras = !siembras.isLoading && !cargaFallo && lista.length === 0;

  const sinSeleccionPosible = siembras.isLoading || cargaFallo || sinSiembras;

  const form = useForm({
    defaultValues: {
      siembraId: "",
      fecha: "",
      cantidadObtenida: "",
      observaciones: "",
    },

    validators: {
      onSubmit: ({ value }) => {
        const errores = zodValidator(registrarCosechaSchema)({ value });

        if (errores) return errores;

        // El esquema no puede comprobarlo por su cuenta: el mínimo depende de
        // la siembra elegida. Es el criterio que dice que la fecha de cosecha
        // no puede ser anterior a la de siembra, y el backend lo valida igual.
        const siembra = siembraDe(value.siembraId);

        if (siembra && value.fecha < siembra.fechaSiembra) {
          return {
            fields: {
              fecha: `La cosecha no puede ser anterior a la siembra (${formatearFechaSiembra(
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
        const datos = registrarCosechaSchema.parse(value);

        const cosecha = await registrar.mutateAsync(datos);

        toast.success(
          `Cosecha de ${cosecha.siembra.tipoCultivo} registrada correctamente.`,
        );

        router.push("/dashboard/agricola/siembras");
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
        <form.Field name="siembraId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Siembra
                </FieldLabel>

                <Select
                  items={siembrasItems}
                  value={field.state.value === "" ? null : field.state.value}
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
                        siembras.isLoading
                          ? "Cargando siembras…"
                          : cargaFallo
                            ? "No se pudo cargar"
                            : "Seleccione una siembra"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {siembrasItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {sinSiembras ? (
                  <p className="text-sm text-muted-foreground">
                    No hay siembras registradas.
                  </p>
                ) : null}

                {cargaFallo ? (
                  <p className="text-sm text-destructive">
                    {getMensajeDeError(siembras.error)}
                  </p>
                ) : null}

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha de cosecha
                  </FieldLabel>

                  <form.Subscribe
                    selector={(estado) => estado.values.siembraId}
                  >
                    {(siembraId) => (
                      <Input
                        id={field.name}
                        type="date"
                        min={siembraDe(siembraId)?.fechaSiembra}
                        max={fechaHoyCR()}
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    )}
                  </form.Subscribe>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="cantidadObtenida">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Cantidad obtenida
                  </FieldLabel>

                  <Input
                    id={field.name}
                    inputMode="decimal"
                    placeholder="Ej: 12.5"
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
        </div>

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Cosecha de primera calidad"
                  maxLength={500}
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
          selector={(estado) => estado.isSubmitting || registrar.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando || sinSeleccionPosible}>
              {guardando ? "Guardando…" : "Registrar cosecha"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
