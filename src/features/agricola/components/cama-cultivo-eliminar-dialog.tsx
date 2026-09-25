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

import { useEliminarCamaCultivo } from "../hooks/cama-cultivo-hooks";
import type { CamaCultivoRespuesta } from "../models/cama-cultivo.model";
import { getMensajeDeError } from "../servicios/cama-cultivo.service";

type Props = {
  cama: CamaCultivoRespuesta | null;
  open: boolean;
  onOpenChange: (abierto: boolean) => void;
};

/**
 * Eliminar una cama es definitivo, así que se pide una confirmación explícita
 * igual que al desactivar un departamento.
 *
 * Solo se puede eliminar una cama que nunca se usó: si tiene siembras, el
 * backend responde 409 y su mensaje explica por qué. No se adelanta aquí esa
 * comprobación porque la pantalla no sabe cuántas siembras tiene la cama, y
 * adivinarlo sería peor que preguntar al servidor.
 */
export function CamaCultivoEliminarDialog({ cama, open, onOpenChange }: Props) {
  const [confirmado, setConfirmado] = useState(false);
  const eliminar = useEliminarCamaCultivo();

  const cerrar = (abierto: boolean) => {
    onOpenChange(abierto);

    if (!abierto) setConfirmado(false);
  };

  const confirmar = async () => {
    if (!cama) return;

    try {
      await eliminar.mutateAsync(cama.id);

      toast.success(`Cama ${cama.codigo} eliminada correctamente.`);
      cerrar(false);
    } catch (error) {
      // El 409 de "está en uso" llega con su motivo: se muestra tal cual.
      toast.error(getMensajeDeError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar cama de cultivo</DialogTitle>

          <DialogDescription>
            {cama
              ? `Va a eliminar la cama ${cama.codigo} de ${cama.ubicacion}. Esta acción no se puede deshacer.`
              : "Seleccione una cama para eliminar."}
          </DialogDescription>
        </DialogHeader>

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="confirmar-eliminar-cama" required>
              Confirmar eliminación
            </FieldLabel>

            <FieldDescription>
              Solo se pueden eliminar camas sin siembras registradas. Si la cama
              ya se usó, conviene cambiarle el estado en vez de borrarla.
            </FieldDescription>
          </FieldContent>

          <Switch
            id="confirmar-eliminar-cama"
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
            disabled={!cama || !confirmado || eliminar.isPending}
            onClick={() => void confirmar()}
          >
            {eliminar.isPending ? "Eliminando…" : "Eliminar cama"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
