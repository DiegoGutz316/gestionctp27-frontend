"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  crearSalidaSchema,
  fechaLocalHoy,
} from "../validacion/stock.validacion";
import type { UnidadMedida } from "../../producto/models/producto.model";
import type { Inventario } from "../models/stock.model";
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

type StockSalidaDialogProps = {
  inventario: Inventario | null;
  productoNombre: string;
  unidadMedida: UnidadMedida;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StockSalidaDialog({
  inventario,
  productoNombre,
  unidadMedida,
  open,
  onOpenChange,
}: StockSalidaDialogProps) {
  const registrarSalida = useRegistrarSalida(inventario?.id ?? 0);
  const schema = crearSalidaSchema(unidadMedida);
  const step = unidadMedida === "UNIDAD" ? "1" : "0.01";
  const idempotencyKey = useRef<string | null>(null);

  function rotarClave() {
    idempotencyKey.current = globalThis.crypto.randomUUID();
  }

  const form = useForm({
    defaultValues: {
      cantidad: "" as string | number,
      fecha: fechaLocalHoy(),
      motivo: "",
    },
    validators: { onSubmit: zodValidator(schema) },
    onSubmit: async ({ value }) => {
      if (!inventario) return;

      try {
        idempotencyKey.current ??= globalThis.crypto.randomUUID();
        const movimiento = await registrarSalida.mutateAsync({
          datos: schema.parse(value),
          idempotencyKey: idempotencyKey.current,
        });
        toast.success(
          `Salida registrada. Existencia actual: ${movimiento.inventario.cantidadActual}.`,
        );
        rotarClave();
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
        if (!abierto) {
          rotarClave();
          form.reset();
        }
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar salida de existencias</DialogTitle>
          <DialogDescription>
            {inventario
              ? `Resta existencias de "${productoNombre}". Existencia actual: ${inventario.cantidadActual}.`
              : "Seleccione un registro de existencias."}
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
                      min={step}
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        rotarClave();
                        field.handleChange(event.target.value);
                      }}
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
                      max={fechaLocalHoy()}
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        rotarClave();
                        field.handleChange(event.target.value);
                      }}
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
                    <FieldLabel htmlFor={field.name} required>
                      Motivo
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Ej: Consumo, merma, traslado…"
                      maxLength={200}
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        rotarClave();
                        field.handleChange(event.target.value);
                      }}
                    />
                    <FieldDescription>
                      Por qué salen las existencias. Queda en el historial.
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
              onClick={() => {
                rotarClave();
                form.reset();
                onOpenChange(false);
              }}
              disabled={registrarSalida.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => state.isSubmitting || registrarSalida.isPending}
            >
              {(guardando) => (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={guardando || !inventario}
                >
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
