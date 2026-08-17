"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { crearInventarioSchema } from "../validacion/stock.validacion";
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
import { useCrearStock } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

type StockFormProps = {
  productoId: number;
  productoNombre: string;
};

export function StockForm({ productoId, productoNombre }: StockFormProps) {
  const router = useRouter();
  const crearStock = useCrearStock();

  const form = useForm({
    defaultValues: {
      productoId,
      stockMinimo: "0" as string | number,
      precio: "" as string | number,
    },
    validators: {
      onSubmit: zodValidator(crearInventarioSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const stock = await crearStock.mutateAsync(
          crearInventarioSchema.parse(value),
        );
        toast.success(
          `Stock de "${stock.producto.nombre}" creado. Registre una entrada para agregar existencia.`,
        );
        router.push(`/dashboard/inventario/${productoId}`);
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
        <Field>
          <FieldLabel>Producto</FieldLabel>
          <Input value={productoNombre} disabled readOnly />
        </Field>

        <form.Field name="stockMinimo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Stock mínimo</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Precio unitario</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="Ej: 1500"
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
          selector={(state) => state.isSubmitting || crearStock.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar stock"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
