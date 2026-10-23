"use client";

import { useId } from "react";
import { Square, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { useLecturaVoz } from "../hooks/use-lectura-voz";

/** Mismas clases que el botón "Cambiar apariencia" de la landing. */
const BOTON =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-tinta transition hover:bg-tinta/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 md:size-9";

/**
 * Texto visible de un elemento, en orden, sin los nodos marcados con
 * `data-no-leer`, ocultos o con `aria-hidden`. Cada bloque termina en pausa.
 */
function textoLegible(raiz: HTMLElement): string {
  const bloques: string[] = [];
  let actual = "";

  function cerrarBloque() {
    const limpio = actual.replace(/\s+/g, " ").trim();
    if (limpio) bloques.push(/[.!?:;]$/.test(limpio) ? limpio : `${limpio}.`);
    actual = "";
  }

  function recorrer(nodo: Node) {
    if (nodo.nodeType === Node.TEXT_NODE) {
      actual += nodo.nodeValue ?? "";
      return;
    }
    if (!(nodo instanceof HTMLElement)) return;
    if (
      nodo.hasAttribute("data-no-leer") ||
      nodo.getAttribute("aria-hidden") === "true" ||
      nodo.getClientRects().length === 0
    ) {
      return;
    }
    const enLinea = getComputedStyle(nodo).display.startsWith("inline");
    if (!enLinea) cerrarBloque();
    nodo.childNodes.forEach(recorrer);
    if (!enLinea) cerrarBloque();
  }

  recorrer(raiz);
  cerrarBloque();
  return bloques.join(" ");
}

type Props = {
  /** Nombre de la sección, para la etiqueta "Escuchar: <etiqueta>". */
  etiqueta: string;
  /** id del elemento cuyo texto visible se lee. */
  objetivo?: string;
  /** Texto a leer cuando no basta con el visible (por ejemplo, el calendario). */
  obtenerTexto?: () => string;
  className?: string;
};

export function BotonEscuchar({ etiqueta, objetivo, obtenerTexto, className }: Props) {
  const id = useId();
  const { disponible, leyendo, leer, detener } = useLecturaVoz(id);

  if (!disponible) return null;

  function alternar() {
    if (leyendo) {
      detener();
      return;
    }
    const elemento = objetivo ? document.getElementById(objetivo) : null;
    const texto = obtenerTexto ? obtenerTexto() : elemento ? textoLegible(elemento) : "";
    leer(texto);
  }

  return (
    <button
      type="button"
      data-no-leer
      onClick={alternar}
      aria-pressed={leyendo}
      aria-label={`Escuchar: ${etiqueta}`}
      className={cn(BOTON, className)}
    >
      {leyendo ? (
        <Square className="size-4" aria-hidden="true" />
      ) : (
        <Volume2 className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
