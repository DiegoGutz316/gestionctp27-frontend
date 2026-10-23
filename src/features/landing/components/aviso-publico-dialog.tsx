"use client";

import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { urlFlyerAviso } from "@/features/comunicacion/servicios/aviso.service";
import type { AvisoPublico } from "@/features/comunicacion/validacion/aviso.validacion";

import {
  etiquetaCategoria,
  fechasDelAviso,
  formatearFechaAviso,
} from "../aviso-publico";

type Props = {
  aviso: AvisoPublico | null;
  onCerrar: () => void;
};

export function AvisoPublicoDialog({ aviso, onCerrar }: Props) {
  const fechas = aviso ? fechasDelAviso(aviso) : null;

  return (
    <Dialog
      open={aviso !== null}
      onOpenChange={(abierto) => {
        if (!abierto) onCerrar();
      }}
    >
      <DialogContent
        className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-tarjeta/95 [&_[data-slot=dialog-close]]:shadow-sm"
      >
        {aviso && fechas ? (
          <>
            {aviso.tieneFlyer ? (
              <div className="flex items-center justify-center bg-crema px-4 py-6 sm:px-8 sm:py-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFlyerAviso(aviso.id)}
                  alt={`Flyer de ${aviso.titulo}`}
                  className="max-h-[62vh] w-full object-contain"
                />
              </div>
            ) : null}

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <DialogHeader className="gap-3 text-left">
                {etiquetaCategoria(aviso) ? (
                  <span className="w-fit rounded-full bg-oliva/10 px-3 py-1 text-xs font-medium text-oliva">
                    {etiquetaCategoria(aviso)}
                  </span>
                ) : null}
                <DialogTitle className="text-xl font-semibold tracking-tight text-tinta sm:text-2xl">
                  {aviso.titulo}
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="text-sm leading-relaxed whitespace-pre-line text-tinta/75">
                {aviso.descripcion}
              </DialogDescription>

              <dl className="grid gap-2 text-sm text-tinta/70">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-oro" aria-hidden="true" />
                  <dt className="font-medium text-tinta">
                    Fecha de la actividad
                  </dt>
                  <dd>{formatearFechaAviso(fechas.actividad)}</dd>
                </div>
                {fechas.publicacion ? (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0 text-oro" aria-hidden="true" />
                    <dt className="font-medium text-tinta">
                      Fecha de publicación
                    </dt>
                    <dd>{formatearFechaAviso(fechas.publicacion)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={onCerrar}
                >
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
