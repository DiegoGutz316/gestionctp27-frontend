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

import { useCrearCamaCultivo } from "../hooks/cama-cultivo-hooks";
import { getMensajeDeError } from "../servicios/cama-cultivo.service";
import {
  crearCamaCultivoSchema,
  ESTADOS_CAMA_CULTIVO,
  ETIQUETA_ESTADO_CAMA_CULTIVO,
} from "../validacion/cama-cultivo.validacion";

const itemsEstado = ESTADOS_CAMA_CULTIVO.map((valor) => ({
  value: valor,
  label: ETIQUETA_ESTADO_CAMA_CULTIVO[valor],
}));

export function CamaCultivoForm() {
  const router = useRouter();
  const crearCamaCultivo = useCrearCamaCultivo();

  const form = useForm({
    defaultValues: {
      codigo: "",
      ubicacion: "",
      estado: "",
      observaciones: "",
    },

    validators: {
      onSubmit: zodValidator(crearCamaCultivoSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const cama = await crearCamaCultivo.mutateAsync(
          crearCamaCultivoSchema.parse(value),
        );

        toast.success(
          `Cama de cultivo "${cama.codigo}" registrada correctamente.`,
        );

        router.push("/dashboard/agricola");
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
                  Código
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: CAMA-001"
                  maxLength={50}
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

        <form.Field name="ubicacion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Ubicación
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Invernadero 1"
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
                  items={itemsEstado}
                  value={
                    field.state.value === "" ? null : field.state.value
                  }
                  onValueChange={(valor) =>
                    field.handleChange((valor as string | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>

                  <SelectContent>
                    {itemsEstado.map((item) => (
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
                  placeholder="Ej: Requiere revisión de riego"
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
            state.isSubmitting || crearCamaCultivo.isPending
          }
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar cama"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
