"use client";

import { Moon, Sun } from "lucide-react";
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

export function SelectorTema({ variante = "admin" }: SelectorTemaProps) {
  const { setTheme } = useTheme();

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
          aria-label="Cambiar apariencia"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2",
            variante === "landing"
              ? "text-tinta hover:bg-tinta/5 focus-visible:ring-oliva/40"
              : "text-foreground hover:bg-accent focus-visible:ring-ring",
          )}
        >
          <Sun className="icono-tema-sol size-4" aria-hidden />
          <Moon className="icono-tema-luna size-4" aria-hidden />
          <span className="sr-only">Cambiar apariencia</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">Cambiar apariencia</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
