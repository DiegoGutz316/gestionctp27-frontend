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

import { useDesactivarAviso } from "../hooks/aviso-hooks";
import { getMensajeDeError } from "../servicios/aviso.service";
import type { AvisoRespuesta } from "../validacion/aviso.validacion";

type Props = {
  aviso: AvisoRespuesta | null;
  open: boolean;
  onOpenChange: (abierto: boolean) => void;
};

export function AvisoDesactivarDialog({ aviso, open, onOpenChange }: Props) {
  const desactivar = useDesactivarAviso();

  const confirmar = async () => {
    if (!aviso) return;

    try {
      const actualizado = await desactivar.mutateAsync(aviso.id);

      toast.success(
        `Aviso "${actualizado.titulo}" desactivado correctamente.`,
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar aviso</DialogTitle>
          <DialogDescription>
            {aviso
              ? `Va a desactivar "${aviso.titulo}". Dejará de mostrarse, pero el registro se conserva.`
              : "Seleccione un aviso para desactivar."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={desactivar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void confirmar()}
            disabled={desactivar.isPending || !aviso}
          >
            {desactivar.isPending ? "Desactivando…" : "Desactivar aviso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
