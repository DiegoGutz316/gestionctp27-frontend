"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
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
import { Textarea } from "@/components/ui/textarea";

import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarAviso } from "../hooks/aviso-hooks";
import { getMensajeDeError } from "../servicios/aviso.service";
import {
  DESCRIPCION_ESTADO_AVISO,
  ESTADOS_AVISO,
  ETIQUETA_ESTADO_AVISO,
  registrarAvisoSchema,
  type EstadoAviso,
} from "../validacion/aviso.validacion";

const estadosItems = ESTADOS_AVISO.map((estado) => ({
  value: estado,
  label: ETIQUETA_ESTADO_AVISO[estado],
}));

export function AvisoForm() {
  const router = useRouter();
  const registrar = useRegistrarAviso();

  const form = useForm({
    defaultValues: {
      titulo: "",
      descripcion: "",
      fecha: "",
      estado: "ACTIVO" as EstadoAviso,
    },

    validators: {
      onSubmit: zodValidator(registrarAvisoSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const datos = registrarAvisoSchema.parse(value);

        const aviso = await registrar.mutateAsync(datos);

        toast.success(
          aviso.estado === "ACTIVO"
            ? `Aviso "${aviso.titulo}" publicado correctamente.`
            : `Aviso "${aviso.titulo}" guardado como inactivo.`,
        );

        router.push("/dashboard");
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
        <form.Field name="titulo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Título
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Feria agrícola institucional"
                  maxLength={150}
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

        <form.Field name="descripcion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Descripción
                </FieldLabel>

                <Textarea
                  id={field.name}
                  rows={5}
                  placeholder="Detalle de la actividad, el lugar y la hora."
                  maxLength={2000}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha del aviso
                  </FieldLabel>

                  {/* Sin `max`: un aviso anuncia algo que todavía no ocurrió,
                      así que las fechas futuras son lo normal aquí. */}
                  <Input
                    id={field.name}
                    type="date"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldDescription>
                    La fecha de la actividad que se anuncia.
                  </FieldDescription>

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
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(
                        (valor as EstadoAviso | null) ?? "ACTIVO",
                      )
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {estadosItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <form.Subscribe selector={(estado) => estado.values.estado}>
                    {(estado) => (
                      <FieldDescription>
                        {DESCRIPCION_ESTADO_AVISO[estado]}
                      </FieldDescription>
                    )}
                  </form.Subscribe>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(estado) => estado.isSubmitting || registrar.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Publicando…" : "Publicar aviso"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
