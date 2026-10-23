"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SelectorTemaProps = {
  variante?: "landing" | "admin";
};

function marcarTransicion() {
  const raiz = document.documentElement;
  raiz.classList.add("transicion-tema");
  window.setTimeout(() => raiz.classList.remove("transicion-tema"), 220);
}

function suscribirNada() {
  return () => {};
}

export function SelectorTema({ variante = "admin" }: SelectorTemaProps) {
  const { setTheme, resolvedTheme } = useTheme();
  // El tema real solo se conoce en el cliente; antes se usa la etiqueta genérica.
  const montado = useSyncExternalStore(suscribirNada, () => true, () => false);
  const etiqueta = montado
    ? `Cambiar apariencia: activar tema ${resolvedTheme === "dark" ? "claro" : "oscuro"}`
    : "Cambiar apariencia";

  function alternar() {
    const oscuro = document.documentElement.classList.contains("dark");
    marcarTransicion();
    setTheme(oscuro ? "light" : "dark");
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          type="button"
          onClick={alternar}
          aria-label={etiqueta}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 md:size-9",
            variante === "landing"
              ? "text-tinta hover:bg-tinta/5 focus-visible:ring-oliva/40"
              : "text-foreground hover:bg-accent focus-visible:ring-ring",
          )}
        >
          <Sun className="icono-tema-sol size-4" aria-hidden />
          <Moon className="icono-tema-luna size-4" aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="bottom">Cambiar apariencia</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
