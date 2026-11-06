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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const TIPOS = [
  { value: "INGRESO", label: "Ingreso (entra dinero)" },
  { value: "EGRESO", label: "Egreso (sale dinero)" },
] as const;

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
    tipoMovimiento:
      asiento && asiento.egresos > 0 ? "EGRESO" : "INGRESO",
    monto: asiento
      ? montoInicial(
          asiento.ingresos > 0 ? asiento.ingresos : asiento.egresos,
        )
      : "",
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

            <form.Field name="tipoMovimiento">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`} required>
                      Tipo de movimiento
                    </FieldLabel>
                    <Select
                      items={[...TIPOS]}
                      value={field.state.value}
                      onValueChange={(valor) =>
                        field.handleChange(
                          (valor as "INGRESO" | "EGRESO" | null) ?? "INGRESO",
                        )
                      }
                    >
                      <SelectTrigger
                        id={`editar-${field.name}`}
                        className="w-full"
                        aria-invalid={invalid}
                        onBlur={field.handleBlur}
                      >
                        <SelectValue placeholder="Seleccione ingreso o egreso" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS.map((item) => (
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

            <form.Field name="monto">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={`editar-${field.name}`} required>
                      Monto (₡)
                    </FieldLabel>
                    <Input
                      id={`editar-${field.name}`}
                      inputMode="decimal"
                      placeholder="Ej: 85000 o 1.250,50"
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
