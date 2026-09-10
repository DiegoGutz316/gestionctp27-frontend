"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDesactivarAnimal } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/animal.service";
import type { AnimalRespuesta } from "../validacion/animal.validacion";

type AnimalDesactivarDialogProps = {
  animal: AnimalRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnimalDesactivarDialog({
  animal,
  open,
  onOpenChange,
}: AnimalDesactivarDialogProps) {
  const desactivar = useDesactivarAnimal();

  async function confirmar() {
    if (!animal) return;

    try {
      const actualizado =
        await desactivar.mutateAsync(
          animal.id,
        );

      toast.success(
        `Animal "${actualizado.nombre}" desactivado correctamente.`,
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        getMensajeDeError(error),
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Desactivar animal
          </DialogTitle>

          <DialogDescription>
            {animal
              ? `¿Desea desactivar al animal "${animal.nombre}"? El registro se conservará en el sistema.`
              : "Seleccione un animal para desactivar."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={desactivar.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => void confirmar()}
            disabled={
              desactivar.isPending ||
              !animal
            }
          >
            {desactivar.isPending
              ? "Desactivando…"
              : "Desactivar animal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}