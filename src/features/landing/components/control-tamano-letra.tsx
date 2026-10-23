"use client";

import { RotateCcw } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  cambiarEscala,
  huboCambio,
  NIVELES_ESCALA,
  useEscalaTexto,
} from "../hooks/use-escala-texto";

/** Mismas clases que el botón "Cambiar apariencia" de la landing. */
const BOTON =
  "inline-flex items-center justify-center rounded-full text-sm font-semibold text-tinta transition hover:bg-tinta/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent";
const CUADRADO = "size-11 md:size-9";

type Accion = "reducir" | "aumentar" | "restablecer";

/**
 * Al cruzar la escala 1 el control puede pasar del menú al header (o al revés)
 * y el botón pulsado queda oculto: el foco se mueve al mismo botón visible.
 */
function conservarFoco(boton: HTMLElement, accion: Accion) {
  requestAnimationFrame(() => {
    if (boton.getClientRects().length > 0) return;
    const visible = [
      ...document.querySelectorAll<HTMLElement>(`[data-accion-tamano="${accion}"]`),
    ].find((el) => el.getClientRects().length > 0);
    const destino =
      visible ?? document.querySelector<HTMLElement>("[data-boton-menu]");
    destino?.focus();
  });
}

export function ControlTamanoLetra({
  className,
  textoRestablecer = false,
}: {
  className?: string;
  /** En el menú móvil se muestra la palabra "Restablecer" en vez del icono. */
  textoRestablecer?: boolean;
}) {
  const escala = useEscalaTexto();
  const indice = NIVELES_ESCALA.indexOf(escala as (typeof NIVELES_ESCALA)[number]);
  const enMinimo = indice <= 0;
  const enMaximo = indice === NIVELES_ESCALA.length - 1;
  const enNormal = escala === 1;

  function alPulsar(
    evento: React.MouseEvent<HTMLButtonElement>,
    accion: Accion,
    bloqueado: boolean,
  ) {
    if (bloqueado) return;
    const siguiente =
      accion === "restablecer"
        ? 1
        : NIVELES_ESCALA[indice + (accion === "aumentar" ? 1 : -1)];
    cambiarEscala(siguiente);
    conservarFoco(evento.currentTarget, accion);
  }

  const botonRestablecer = (
    <button
      type="button"
      data-accion-tamano="restablecer"
      aria-disabled={enNormal || undefined}
      onClick={(evento) => alPulsar(evento, "restablecer", enNormal)}
      className={cn(BOTON, textoRestablecer ? "h-11 px-4 md:h-9" : CUADRADO)}
    >
      {textoRestablecer ? (
        "Restablecer"
      ) : (
        <>
          <RotateCcw className="size-4" aria-hidden="true" />
          <span className="sr-only">Restablecer tamaño de letra</span>
        </>
      )}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Tamaño de letra"
      className={cn("items-center gap-1", className)}
    >
      <button
        type="button"
        data-accion-tamano="reducir"
        aria-label="Reducir tamaño de letra"
        aria-disabled={enMinimo || undefined}
        onClick={(evento) => alPulsar(evento, "reducir", enMinimo)}
        className={cn(BOTON, CUADRADO)}
      >
        A−
      </button>
      <button
        type="button"
        data-accion-tamano="aumentar"
        aria-label="Aumentar tamaño de letra"
        aria-disabled={enMaximo || undefined}
        onClick={(evento) => alPulsar(evento, "aumentar", enMaximo)}
        className={cn(BOTON, CUADRADO)}
      >
        A+
      </button>
      {textoRestablecer ? (
        botonRestablecer
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={botonRestablecer} />
            <TooltipContent side="bottom">Restablecer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <span role="status" className="sr-only">
        {huboCambio() ? `Tamaño de letra: ${Math.round(escala * 100)} %` : ""}
      </span>
    </div>
  );
}
