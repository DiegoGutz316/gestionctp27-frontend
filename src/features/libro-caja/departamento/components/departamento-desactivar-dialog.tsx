"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  desactivarDepartamentoSchema,
  type DesactivarDepartamentoInput,
  type DepartamentoRespuesta,
} from "../validacion/departamento.validacion";
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
import { useDesactivarDepartamento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/departamento.service";

type DepartamentoDesactivarDialogProps = {
  departamento: DepartamentoRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const valoresIniciales: DesactivarDepartamentoInput = {
  confirmar: false,
};

export function DepartamentoDesactivarDialog({
  departamento,
  open,
  onOpenChange,
}: DepartamentoDesactivarDialogProps) {
  const desactivar = useDesactivarDepartamento();

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(desactivarDepartamentoSchema),
    },
    onSubmit: async ({ value }) => {
      if (!departamento) return;

      try {
        desactivarDepartamentoSchema.parse(value);
        const actualizado = await desactivar.mutateAsync(departamento.id);
        toast.success(
          `Departamento "${actualizado.nombreUnidad}" desactivado correctamente.`,
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
          <DialogTitle>Desactivar departamento</DialogTitle>
          <DialogDescription>
            {departamento
              ? `Va a desactivar "${departamento.nombreUnidad}". Dejará de aparecer en el catálogo activo y no se cargará en periodos nuevos.`
              : "Seleccione un departamento para desactivar."}
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
                      Confirmar desactivación
                    </FieldLabel>
                    <FieldDescription>
                      El registro se conserva; solo se oculta de los listados activos.
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
              disabled={desactivar.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) =>
                state.isSubmitting || desactivar.isPending
              }
            >
              {(guardando) => (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={guardando || !departamento}
                >
                  {guardando ? "Desactivando…" : "Desactivar departamento"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
