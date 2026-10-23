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
import type { AsientoRespuesta } from "../validacion/asiento.validacion";
import { useEliminarAsiento } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";

export function AsientoAnularDialog({
  periodoId,
  fondoId,
  asiento,
  open,
  onOpenChange,
}: {
  periodoId: number;
  fondoId: number;
  asiento: AsientoRespuesta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const eliminar = useEliminarAsiento(periodoId, fondoId);

  async function confirmar() {
    if (!asiento) return;

    try {
      await eliminar.mutateAsync(asiento.id);
      toast.success(`Asiento ${asiento.numero} anulado.`);
      onOpenChange(false);
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anular asiento {asiento?.numero ?? ""}</DialogTitle>
          <DialogDescription>
            {asiento
              ? `Se quita "${asiento.descripcion}" y el saldo del libro se vuelve a calcular.`
              : "Seleccione un asiento para anular."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={eliminar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void confirmar()}
            disabled={eliminar.isPending || !asiento}
          >
            {eliminar.isPending ? "Anulando…" : "Anular asiento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
