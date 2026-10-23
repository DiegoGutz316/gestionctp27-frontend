"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { fechaPeriodoIso } from "@/features/libro-caja/formato";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import {
  crearAsientoSchema,
  type AsientoRespuesta,
  type CrearAsientoInput,
  type LibroDepartamentoRespuesta,
} from "../validacion/asiento.validacion";
import { useActualizarAsiento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";

function montoInicial(valor: number): string {
  return valor > 0 ? String(valor) : "";
}

export function AsientoEditarDialog({
  libro,
  asiento,
  open,
  onOpenChange,
}: {
  libro: LibroDepartamentoRespuesta;
  asiento: AsientoRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const actualizar = useActualizarAsiento(libro.periodo.id, libro.fondo.id);
  const inicio = fechaPeriodoIso(libro.periodo.fechaInicio);
  const fin = fechaPeriodoIso(libro.periodo.fechaFin);

  const valoresIniciales: CrearAsientoInput = {
    fecha: asiento ? fechaPeriodoIso(asiento.fecha) : inicio,
    numeroFactura: asiento?.numeroFactura ?? "",
    descripcion: asiento?.descripcion ?? "",
    ingresos: asiento ? montoInicial(asiento.ingresos) : "",
    egresos: asiento ? montoInicial(asiento.egresos) : "",
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(crearAsientoSchema),
    },
    onSubmit: async ({ value }) => {
      if (!asiento) return;

      try {
        await actualizar.mutateAsync({
          asientoId: asiento.id,
          datos: crearAsientoSchema.parse(value),
        });
        toast.success(`Asiento ${asiento.numero} corregido.`);
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Corregir asiento {asiento?.numero ?? ""}
          </DialogTitle>
          <DialogDescription>
            El libro se reordena por fecha y el saldo se vuelve a calcular.
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
            <form.Field name="fecha">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`} required>
                      Fecha
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      type="date"
                      min={inicio}
                      max={fin}
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

            <form.Field name="numeroFactura">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`}>
                      N<sup>o</sup> factura / N<sup>0</sup> depósito
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      maxLength={40}
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

            <form.Field name="descripcion">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`} required>
                      Descripción
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      maxLength={250}
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

            <form.Field name="ingresos">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`}>
                      Ingresos
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      type="number"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
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

            <form.Field name="egresos">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`}>
                      Egresos
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      type="number"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
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

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={actualizar.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => state.isSubmitting || actualizar.isPending}
            >
              {(guardando) => (
                <Button type="submit" disabled={guardando || !asiento}>
                  {guardando ? "Guardando…" : "Guardar corrección"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
