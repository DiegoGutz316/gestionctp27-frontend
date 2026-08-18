"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  editarConfiguracionStockSchema,
  type ConfiguracionStockRespuesta,
} from "../validacion/stock.validacion";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useEditarConfiguracionStock } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

export function StockEditarForm({
  configuracion,
}: {
  configuracion: ConfiguracionStockRespuesta;
}) {
  const router = useRouter();
  const editarConfiguracion = useEditarConfiguracionStock(configuracion.id);

  const form = useForm({
    defaultValues: {
      stockMinimo: String(configuracion.stockMinimo) as string | number,
      precio: String(configuracion.precio) as string | number,
    },
    validators: {
      onSubmit: zodValidator(editarConfiguracionStockSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        await editarConfiguracion.mutateAsync(
          editarConfiguracionStockSchema.parse(value),
        );
        toast.success("Configuración de stock actualizada correctamente.");
        router.push("/dashboard/inventario");
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
        <form.Field name="stockMinimo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Stock mínimo
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldDescription>
                  Cuando la existencia sea menor o igual a este nivel, el
                  sistema mostrará una alerta de bajo inventario.
                </FieldDescription>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="precio">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Precio unitario
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
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

      </FieldGroup>

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting || editarConfiguracion.isPending
        }
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={<Link href="/dashboard/inventario" />}
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
