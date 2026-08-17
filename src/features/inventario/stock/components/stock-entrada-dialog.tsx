"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { crearEntradaSchema, type StockRespuesta } from "../validacion/stock.validacion";
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
import { useRegistrarEntrada } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

/** Fecha de hoy en formato AAAA-MM-DD, en la zona horaria del navegador. */
function hoy(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

type StockEntradaDialogProps = {
  stock: StockRespuesta | null;
  unidadMedida: UnidadMedida;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StockEntradaDialog({
  stock,
  unidadMedida,
  open,
  onOpenChange,
}: StockEntradaDialogProps) {
  const registrarEntrada = useRegistrarEntrada(stock?.id ?? 0);
  const schema = crearEntradaSchema(unidadMedida);
  const step = unidadMedida === "UNIDAD" ? "1" : "0.01";

  const form = useForm({
    defaultValues: { cantidad: "" as string | number, fecha: hoy(), origen: "" },
    validators: { onSubmit: zodValidator(schema) },
    onSubmit: async ({ value }) => {
      if (!stock) return;

      try {
        const movimiento = await registrarEntrada.mutateAsync(
          schema.parse(value),
        );
        toast.success(
          `Entrada registrada. Existencia actual: ${movimiento.inventario.cantidad}.`,
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
          <DialogTitle>Registrar entrada</DialogTitle>
          <DialogDescription>
            {stock
              ? `Suma existencia al stock de "${stock.producto.nombre}".`
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
                    <FieldLabel htmlFor={field.name}>
                      Cantidad que ingresa
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
                    <FieldLabel htmlFor={field.name}>
                      Fecha de la entrada
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

            <form.Field name="origen">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Origen (opcional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Ej: Compra, donación, proveedor…"
                      maxLength={150}
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldDescription>
                      De dónde proviene el stock. Queda en el historial.
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
              disabled={registrarEntrada.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => state.isSubmitting || registrarEntrada.isPending}
            >
              {(guardando) => (
                <Button type="submit" disabled={guardando || !stock}>
                  {guardando ? "Guardando…" : "Registrar entrada"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
