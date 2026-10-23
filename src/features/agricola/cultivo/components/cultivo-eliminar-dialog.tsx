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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

import { useEliminarCultivo } from "../hooks/cultivo-hooks";
import type { CultivoRespuesta } from "../models/cultivo.model";
import { getMensajeDeError } from "../servicios/cultivo.service";

type Props = {
  cultivo: CultivoRespuesta | null;
  open: boolean;
  onOpenChange: (abierto: boolean) => void;
};

/**
 * Eliminar un cultivo es definitivo, así que se pide confirmación explícita,
 * igual que al eliminar una cama.
 *
 * Solo se puede borrar un cultivo que nadie sembró: si tiene siembras, el
 * backend responde 409 y su mensaje explica por qué y qué hacer en su lugar.
 * No se adelanta aquí esa comprobación porque la pantalla no sabe cuántas
 * siembras lo usan, y adivinarlo sería peor que preguntar al servidor.
 */
export function CultivoEliminarDialog({ cultivo, open, onOpenChange }: Props) {
  const [confirmado, setConfirmado] = useState(false);
  const eliminar = useEliminarCultivo();

  const cerrar = (abierto: boolean) => {
    onOpenChange(abierto);

    if (!abierto) setConfirmado(false);
  };

  const confirmar = async () => {
    if (!cultivo) return;

    try {
      await eliminar.mutateAsync(cultivo.id);

      toast.success(`Cultivo "${cultivo.nombre}" eliminado correctamente.`);
      cerrar(false);
    } catch (error) {
      // El 409 de «tiene siembras» llega con su motivo: se muestra tal cual.
      toast.error(getMensajeDeError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar cultivo</DialogTitle>

          <DialogDescription>
            {cultivo
              ? `Va a eliminar el cultivo "${cultivo.nombre}". Esta acción no se puede deshacer.`
              : "Seleccione un cultivo para eliminar."}
          </DialogDescription>
        </DialogHeader>

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="confirmar-eliminar-cultivo" required>
              Confirmar eliminación
            </FieldLabel>

            <FieldDescription>
              Solo se pueden eliminar cultivos que ninguna siembra use. Si ya se
              sembró, desactívelo para que deje de ofrecerse sin perder el
              historial.
            </FieldDescription>
          </FieldContent>

          <Switch
            id="confirmar-eliminar-cultivo"
            checked={confirmado}
            onCheckedChange={(marcado) => setConfirmado(marcado)}
          />
        </Field>

        <DialogFooter className="mt-4">
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
            disabled={!cultivo || !confirmado || eliminar.isPending}
            onClick={() => void confirmar()}
          >
            {eliminar.isPending ? "Eliminando…" : "Eliminar cultivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
