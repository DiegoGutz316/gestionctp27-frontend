"use client";

import { useState } from "react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
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
  const [motivo, setMotivo] = useState("");
  const [errorMotivo, setErrorMotivo] = useState<string | null>(null);

  function cerrar(abierto: boolean) {
    if (!abierto) {
      setMotivo("");
      setErrorMotivo(null);
    }
    onOpenChange(abierto);
  }

  async function confirmar() {
    if (!asiento) return;
    const limpio = motivo.trim();
    if (limpio.length < 5) {
      setErrorMotivo("Indique el motivo con al menos 5 caracteres.");
      return;
    }

    try {
      await eliminar.mutateAsync({ asientoId: asiento.id, motivo: limpio });
      toast.success(
        `Asiento ${asiento.numero} anulado. Queda en el historial como ANULADO y ya no afecta el saldo.`,
      );
      cerrar(false);
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anular asiento {asiento?.numero ?? ""}</DialogTitle>
          <DialogDescription>
            {asiento
              ? `El movimiento "${asiento.descripcion}" se conservará marcado como ANULADO. No se borra del historial, pero deja de contar en el saldo vigente.`
              : "Seleccione un asiento para anular."}
          </DialogDescription>
        </DialogHeader>

        <Field data-invalid={Boolean(errorMotivo)}>
          <FieldLabel htmlFor="motivo-anulacion" required>
            Motivo de la anulación
          </FieldLabel>
          <Textarea
            id="motivo-anulacion"
            value={motivo}
            maxLength={250}
            placeholder="Explique por qué se anula este movimiento…"
            onChange={(event) => {
              setMotivo(event.target.value);
              if (errorMotivo) setErrorMotivo(null);
            }}
            disabled={eliminar.isPending || !asiento}
          />
          {errorMotivo ? <FieldError>{errorMotivo}</FieldError> : null}
        </Field>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => cerrar(false)}
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
            {eliminar.isPending ? "Anulando…" : "Confirmar anulación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
