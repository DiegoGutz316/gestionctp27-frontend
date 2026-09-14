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

import { useEditarCamaCultivo } from "../hooks/cama-cultivo-hooks";
import { getMensajeDeError } from "../servicios/cama-cultivo.service";
import {
  crearCamaCultivoSchema,
  ESTADOS_CAMA_CULTIVO,
  ETIQUETA_ESTADO_CAMA_CULTIVO,
  type CamaCultivoRespuesta,
  type CrearCamaCultivoInput,
} from "../validacion/cama-cultivo.validacion";

const itemsEstado = ESTADOS_CAMA_CULTIVO.map((valor) => ({
  value: valor,
  label: ETIQUETA_ESTADO_CAMA_CULTIVO[valor],
}));

export function CamaCultivoEditarForm({
  cama,
}: {
  cama: CamaCultivoRespuesta;
}) {
  const router = useRouter();
  const editarCamaCultivo = useEditarCamaCultivo(cama.id);

  const valoresIniciales: CrearCamaCultivoInput = {
    codigo: cama.codigo,
    ubicacion: cama.ubicacion,
    estado: cama.estado,
    observaciones: cama.observaciones ?? "",
  };

  const form = useForm({
    defaultValues: valoresIniciales,

    validators: {
      onSubmit: zodValidator(crearCamaCultivoSchema),
    },

    onSubmit: async ({ value }) => {
      try {
        const actualizada = await editarCamaCultivo.mutateAsync(
          crearCamaCultivoSchema.parse(value),
        );

        toast.success(
          `Cama de cultivo "${actualizada.codigo}" actualizada correctamente.`,
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
      className="space-y-6"
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
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(
                      valor as typeof field.state.value,
                    )
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
      </FieldGroup>

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting || editarCamaCultivo.isPending
        }
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={<Link href="/dashboard/agricola" />}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
