"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import {
  crearCategoriaInsumoSchema,
  type CategoriaInsumoRespuesta,
  type CrearCategoriaInsumo,
} from "@/schemas";
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
import { getMensajeDeError } from "../api";
import { useCrearCategoria } from "../hooks";

type NuevaCategoriaDialogProps = {
  onCreated?: (categoria: CategoriaInsumoRespuesta) => void;
};

export function NuevaCategoriaDialog({ onCreated }: NuevaCategoriaDialogProps) {
  const [open, setOpen] = useState(false);
  const crearCategoria = useCrearCategoria();

  const form = useForm<CrearCategoriaInsumo>({
    resolver: zodResolver(crearCategoriaInsumoSchema),
    defaultValues: { nombre: "" },
  });

  const onSubmit = form.handleSubmit((datos) => {
    crearCategoria.mutate(datos, {
      onSuccess: (categoria) => {
        toast.success(`Categoría "${categoria.nombre}" creada correctamente.`);
        form.reset();
        setOpen(false);
        onCreated?.(categoria);
      },
      onError: (error) => {
        toast.error(getMensajeDeError(error));
      },
    });
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
            // Evita que el submit burbujee al formulario de insumo.
            evento.stopPropagation();
            void onSubmit(evento);
          }}
          noValidate
        >
          <Field data-invalid={!!form.formState.errors.nombre}>
            <FieldLabel htmlFor="nombre-categoria">
              Nombre de la categoría
            </FieldLabel>
            <Input
              id="nombre-categoria"
              placeholder="Ej: Semillas"
              aria-invalid={!!form.formState.errors.nombre}
              {...form.register("nombre")}
            />
            <FieldError errors={[form.formState.errors.nombre]} />
          </Field>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={crearCategoria.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crearCategoria.isPending}>
              {crearCategoria.isPending ? "Guardando…" : "Guardar categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
