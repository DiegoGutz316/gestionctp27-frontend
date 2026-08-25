"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  cerrarPeriodoSchema,
  type CerrarPeriodoInput,
  type PeriodoDetalleRespuesta,
  type PeriodoRespuesta,
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useCerrarPeriodo } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";

type PeriodoCerrarDialogProps = {
  periodo: PeriodoRespuesta | PeriodoDetalleRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const valoresIniciales: CerrarPeriodoInput = {
  confirmar: false,
};

export function PeriodoCerrarDialog({
  periodo,
  open,
  onOpenChange,
}: PeriodoCerrarDialogProps) {
  const cerrar = useCerrarPeriodo();

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(cerrarPeriodoSchema),
    },
    onSubmit: async ({ value }) => {
      if (!periodo) return;

      try {
        cerrarPeriodoSchema.parse(value);
        const actualizado = await cerrar.mutateAsync(periodo.id);
        toast.success(`Periodo "${actualizado.nombre}" cerrado correctamente.`);
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
          <DialogTitle>Cerrar periodo</DialogTitle>
          <DialogDescription>
            {periodo
              ? `Va a cerrar "${periodo.nombre}". No se podrán editar sus datos ni solicitar fondos.`
              : "Seleccione un periodo para cerrar."}
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
          <form.Field name="confirmar">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field orientation="horizontal" data-invalid={invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name} required>
                      Confirmar cierre
                    </FieldLabel>
                    <FieldDescription>
                      El periodo quedará en estado cerrado de forma permanente.
                    </FieldDescription>
                    {invalid ? <FieldError errors={errors} /> : null}
                  </FieldContent>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    aria-invalid={invalid}
                  />
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={cerrar.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => state.isSubmitting || cerrar.isPending}
            >
              {(guardando) => (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={guardando || !periodo}
                >
                  {guardando ? "Cerrando…" : "Cerrar periodo"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
