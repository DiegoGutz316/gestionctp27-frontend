"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { crearSalidaSchema, type StockRespuesta } from "../validacion/stock.validacion";
import type { UnidadMedida } from "../../producto/models/producto.model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useRegistrarSalida } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

/** Fecha de hoy en formato AAAA-MM-DD, en la zona horaria del navegador. */
function hoy(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

type StockSalidaDialogProps = {
  stock: StockRespuesta | null;
  unidadMedida: UnidadMedida;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StockSalidaDialog({
  stock,
  unidadMedida,
  open,
  onOpenChange,
}: StockSalidaDialogProps) {
  const registrarSalida = useRegistrarSalida(stock?.id ?? 0);
  const schema = crearSalidaSchema(unidadMedida);
  const step = unidadMedida === "UNIDAD" ? "1" : "0.01";

  const form = useForm({
    defaultValues: { cantidad: "" as string | number, fecha: hoy(), motivo: "" },
    validators: { onSubmit: zodValidator(schema) },
    onSubmit: async ({ value }) => {
      if (!stock) return;

      try {
        const movimiento = await registrarSalida.mutateAsync(
          schema.parse(value),
        );
        toast.success(
          `Salida registrada. Existencia actual: ${movimiento.inventario.cantidad}.`,
        );
        form.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(abierto) => {
        onOpenChange(abierto);
        if (!abierto) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar salida</DialogTitle>
          <DialogDescription>
            {stock
              ? `Resta existencia al stock de "${stock.producto.nombre}". Existencia actual: ${stock.cantidad}.`
              : "Seleccione un registro de stock."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            evento.stopPropagation();
            void form.handleSubmit();
          }}
          noValidate
        >
          <FieldGroup>
            <form.Field name="cantidad">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Cantidad que sale
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      step={step}
                      min={0}
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
                      Fecha de la salida
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
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

            <form.Field name="motivo">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Motivo</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Ej: Consumo, merma, traslado…"
                      maxLength={200}
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldDescription>
                      Por qué sale el stock. Queda en el historial.
                    </FieldDescription>
                    <FieldError errors={errors} />
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={registrarSalida.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => state.isSubmitting || registrarSalida.isPending}
            >
              {(guardando) => (
                <Button type="submit" variant="destructive" disabled={guardando || !stock}>
                  {guardando ? "Guardando…" : "Registrar salida"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
