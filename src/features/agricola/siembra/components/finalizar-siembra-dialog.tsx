"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFinalizarSiembra } from "../hooks/siembra-hooks";
import {
  ETIQUETA_MOTIVO_FINALIZACION,
  MOTIVOS_FINALIZACION,
  type MotivoFinalizacion,
  type SiembraRespuesta,
} from "../models/siembra.model";
import { getMensajeDeError } from "../servicios/siembra.service";

type Props = {
  siembra: SiembraRespuesta | null;
  open: boolean;
  onOpenChange: (abierto: boolean) => void;
};

export function FinalizarSiembraDialog({ siembra, open, onOpenChange }: Props) {
  const router = useRouter();
  const finalizar = useFinalizarSiembra();
  const [paso, setPaso] = useState<"opciones" | "motivo">("opciones");
  const [motivo, setMotivo] = useState<MotivoFinalizacion | "">("");
  const [detalle, setDetalle] = useState("");

  const cerrar = (abierto: boolean) => {
    if (!abierto) {
      setPaso("opciones");
      setMotivo("");
      setDetalle("");
    }

    onOpenChange(abierto);
  };

  const confirmarSinCosecha = async () => {
    if (!siembra || !motivo) return;

    if (motivo === "OTRO" && detalle.trim() === "") {
      toast.error("Describa el motivo de finalización.");
      return;
    }

    try {
      await finalizar.mutateAsync({
        id: siembra.id,
        datos: {
          motivo,
          detalle: detalle.trim() || undefined,
        },
      });
      toast.success("La siembra finalizó y la cama volvió a estar disponible.");
      cerrar(false);
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  };

  const motivos = MOTIVOS_FINALIZACION.map((valor) => ({
    value: valor,
    label: ETIQUETA_MOTIVO_FINALIZACION[valor],
  }));

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar ciclo</DialogTitle>
          <DialogDescription>
            {siembra
              ? `${siembra.tipoCultivo} en ${siembra.cama.ubicacion}. La cama queda disponible y el historial se conserva.`
              : "Cierre el ciclo de la siembra."}
          </DialogDescription>
        </DialogHeader>

        {paso === "opciones" ? (
          <div className="grid gap-2">
            <Button
              type="button"
              onClick={() => {
                if (!siembra) return;
                cerrar(false);
                router.push(
                  `/dashboard/agricola/cosechas/nueva?siembraId=${siembra.id}&cerrarCiclo=1`,
                );
              }}
            >
              Registrar cosecha
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaso("motivo")}
            >
              Finalizar sin cosecha
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="motivo-finalizacion">Motivo</Label>
              <Select
                items={motivos}
                value={motivo === "" ? null : motivo}
                onValueChange={(valor) =>
                  setMotivo((valor as MotivoFinalizacion | null) ?? "")
                }
              >
                <SelectTrigger id="motivo-finalizacion" className="w-full">
                  <SelectValue placeholder="Seleccione un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {motivos.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {motivo === "OTRO" ? (
              <div className="space-y-2">
                <Label htmlFor="detalle-finalizacion">Observación</Label>
                <Input
                  id="detalle-finalizacion"
                  value={detalle}
                  maxLength={500}
                  placeholder="Describa el motivo"
                  onChange={(event) => setDetalle(event.target.value)}
                />
              </div>
            ) : null}
          </div>
        )}

        <DialogFooter>
          {paso === "motivo" ? (
            <Button
              type="button"
              disabled={!motivo || finalizar.isPending}
              onClick={() => void confirmarSinCosecha()}
            >
              {finalizar.isPending ? "Guardando…" : "Confirmar"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
