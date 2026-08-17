"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  editarInventarioSchema,
  type StockRespuesta,
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
import { useEditarStock } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

export function StockEditarForm({ stock }: { stock: StockRespuesta }) {
  const router = useRouter();
  const editarStock = useEditarStock(stock.id);

  const form = useForm({
    defaultValues: {
      stockMinimo: String(stock.stockMinimo) as string | number,
      precio: String(stock.precio) as string | number,
    },
    validators: {
      onSubmit: zodValidator(editarInventarioSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarStock.mutateAsync(
          editarInventarioSchema.parse(value),
        );
        toast.success(
          `Stock de "${actualizado.producto.nombre}" actualizado correctamente.`,
        );
        router.push(`/dashboard/inventario/${stock.producto.id}`);
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
        <Field>
          <FieldLabel>Producto</FieldLabel>
          <Input value={stock.producto.nombre} disabled readOnly />
          <FieldDescription>
            El producto no se puede cambiar desde esta pantalla.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Cantidad actual</FieldLabel>
          <Input value={stock.cantidad} disabled readOnly />
          <FieldDescription>
            La cantidad no se edita directo: registre una entrada o una
            salida desde la página del producto.
          </FieldDescription>
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
        selector={(state) => state.isSubmitting || editarStock.isPending}
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={<Link href={`/dashboard/inventario/${stock.producto.id}`} />}
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
