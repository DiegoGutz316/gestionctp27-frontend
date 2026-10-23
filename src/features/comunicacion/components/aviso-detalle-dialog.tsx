"use client";

import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import { formatearFechaPublicacion } from "../fecha-aviso";
import { useSrcFlyer } from "../hooks/aviso-hooks";
import {
  ETIQUETA_CATEGORIA_AVISO,
  ETIQUETA_ESTADO_AVISO,
  type AvisoRespuesta,
} from "../validacion/aviso.validacion";

type Props = {
  aviso: AvisoRespuesta | null;
  onCerrar: () => void;
};

export function AvisoDetalleDialog({ aviso, onCerrar }: Props) {
  const srcFlyer = useSrcFlyer(aviso?.tieneFlyer ? aviso : null);

  return (
    <Dialog
      open={aviso !== null}
      onOpenChange={(abierto) => {
        if (!abierto) onCerrar();
      }}
    >
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {aviso ? (
          <>
            {srcFlyer ? (
              <div className="flex items-center justify-center bg-muted/40 px-4 py-6 sm:px-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcFlyer}
                  alt={`Flyer de ${aviso.titulo}`}
                  className="max-h-[58vh] w-full object-contain"
                />
              </div>
            ) : null}

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <DialogHeader className="gap-2 text-left">
                <Badge
                  variant="secondary"
                  className={
                    aviso.estado === "ACTIVO"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {ETIQUETA_ESTADO_AVISO[aviso.estado]}
                </Badge>
                <DialogTitle className="text-xl tracking-tight">
                  {aviso.titulo}
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                {aviso.descripcion}
              </DialogDescription>

              <dl className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="font-medium text-foreground">Categoría</dt>
                  <dd>
                    {aviso.categoria
                      ? ETIQUETA_CATEGORIA_AVISO[aviso.categoria]
                      : "Sin categoría"}
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <dt className="font-medium text-foreground">Fecha del aviso</dt>
                  <dd>{formatearFecha(aviso.fecha)}</dd>
                </div>
                {aviso.creadoEn ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    <dt className="font-medium text-foreground">
                      Fecha de publicación
                    </dt>
                    <dd>{formatearFechaPublicacion(aviso.creadoEn)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onCerrar}>
                  Cerrar
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
