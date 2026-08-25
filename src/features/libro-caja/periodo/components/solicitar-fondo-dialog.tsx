"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { formatearColones } from "@/features/libro-caja/formato";
import { VALOR_MAXIMO_FONDO_TEXTO } from "../models/periodo.model";
import {
  solicitarFondoSchema,
  type FondoRespuesta,
  type SolicitarFondoInput,
} from "../validacion/periodo.validacion";
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
import { useSolicitarFondo } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";

type SolicitarFondoDialogProps = {
  periodoId: number;
  fondo: FondoRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const valoresIniciales: SolicitarFondoInput = {
  montoSolicitado: "",
};

export function SolicitarFondoDialog({
  periodoId,
  fondo,
  open,
  onOpenChange,
}: SolicitarFondoDialogProps) {
  const solicitar = useSolicitarFondo(periodoId);

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(solicitarFondoSchema),
    },
    onSubmit: async ({ value }) => {
      if (!fondo) return;

      try {
        const actualizado = await solicitar.mutateAsync({
          fondoId: fondo.id,
          datos: solicitarFondoSchema.parse(value),
        });
        const monto = actualizado.montoSolicitado ?? 0;
        toast.success(
          `Fondo de "${actualizado.departamento.nombreUnidad}" solicitado por ${formatearColones(monto)}.`,
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar fondo de caja</DialogTitle>
          <DialogDescription>
            {fondo
              ? `Indique el monto inicial de "${fondo.departamento.nombreUnidad}".`
              : "Seleccione un fondo para solicitar."}
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
            <form.Field name="montoSolicitado">
              {(field) => {
                const errors = fieldErrors(field.state.meta.errors);
                const invalid = errors.length > 0;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Monto solicitado
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0.01"
                      inputMode="decimal"
                      aria-invalid={invalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldDescription>
                      Colones, máximo 2 decimales. Tope {VALOR_MAXIMO_FONDO_TEXTO}.
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
              disabled={solicitar.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) =>
                state.isSubmitting || solicitar.isPending
              }
            >
              {(guardando) => (
                <Button type="submit" disabled={guardando || !fondo}>
                  {guardando ? "Solicitando…" : "Solicitar fondo"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
