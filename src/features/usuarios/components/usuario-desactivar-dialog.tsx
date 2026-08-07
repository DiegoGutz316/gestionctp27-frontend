"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  desactivarUsuarioSchema,
  type DesactivarUsuarioInput,
  type UsuarioRespuesta,
} from "../validacion/usuario.validacion";
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
import { useDesactivarUsuario } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/usuarios.service";

type UsuarioDesactivarDialogProps = {
  usuario: UsuarioRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const valoresIniciales: DesactivarUsuarioInput = {
  confirmar: false,
};

export function UsuarioDesactivarDialog({
  usuario,
  open,
  onOpenChange,
}: UsuarioDesactivarDialogProps) {
  const desactivar = useDesactivarUsuario();

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(desactivarUsuarioSchema),
    },
    onSubmit: async ({ value }) => {
      if (!usuario) return;

      try {
        desactivarUsuarioSchema.parse(value);
        const actualizado = await desactivar.mutateAsync(usuario.id);
        toast.success(
          `Usuario "${actualizado.nombre}" desactivado correctamente.`,
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
          <DialogTitle>Desactivar usuario</DialogTitle>
          <DialogDescription>
            {usuario
              ? `Va a desactivar a "${usuario.nombre}". No podrá iniciar sesión hasta que se reactive la cuenta.`
              : "Seleccione un usuario para desactivar."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
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
                    <FieldLabel htmlFor={field.name}>
                      Confirmar desactivación
                    </FieldLabel>
                    <FieldDescription>
                      El registro se conserva; solo se bloquea el acceso.
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
                  disabled={guardando || !usuario}
                >
                  {guardando ? "Desactivando…" : "Desactivar usuario"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
