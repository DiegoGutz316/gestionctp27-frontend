"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import type { CategoriaInsumoRespuesta } from "../models/inventario.model";
import { crearCategoriaInsumoSchema } from "../validacion/inventario.validacion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { getMensajeDeError } from "../api";
import { useCrearCategoria } from "../hooks";

type NuevaCategoriaDialogProps = {
  onCreated?: (categoria: CategoriaInsumoRespuesta) => void;
};

export function NuevaCategoriaDialog({ onCreated }: NuevaCategoriaDialogProps) {
  const [open, setOpen] = useState(false);
  const crearCategoria = useCrearCategoria();

  const form = useForm({
    defaultValues: { nombre: "" },
    validators: {
      onSubmit: zodValidator(crearCategoriaInsumoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const categoria = await crearCategoria.mutateAsync(
          crearCategoriaInsumoSchema.parse(value),
        );
        toast.success(`Categoría "${categoria.nombre}" creada correctamente.`);
        form.reset();
        setOpen(false);
        onCreated?.(categoria);
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(abierto) => {
        setOpen(abierto);
        if (!abierto) form.reset();
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <PlusIcon />
            Nueva categoría
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva categoría de insumo</DialogTitle>
          <DialogDescription>
            Cree una categoría para clasificar los insumos del inventario.
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
          <form.Field name="nombre">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor="nombre-categoria">
                    Nombre de la categoría
                  </FieldLabel>
                  <Input
                    id="nombre-categoria"
                    placeholder="Ej: Semillas"
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
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={crearCategoria.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) =>
                state.isSubmitting || crearCategoria.isPending
              }
            >
              {(guardando) => (
                <Button type="submit" disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar categoría"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
