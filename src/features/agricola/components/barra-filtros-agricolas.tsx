"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type EtiquetaFiltro = {
  id: string;
  etiqueta: string;
  onQuitar: () => void;
};

type BusquedaFiltro = {
  id: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder: string;
  maxLength?: number;
};

type Props = {
  busqueda?: BusquedaFiltro;
  etiquetas: EtiquetaFiltro[];
  onLimpiar: () => void;
  children: ReactNode;
  aviso?: ReactNode;
};

/**
 * Buscador visible y filtros avanzados en un panel. Cerrar el panel no
 * borra lo elegido: las etiquetas siguen debajo del buscador.
 */
export function BarraFiltrosAgricolas({
  busqueda,
  etiquetas,
  onLimpiar,
  children,
  aviso,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const cantidad = etiquetas.length;

  return (
    <div>
      <div className="flex items-center gap-2">
        {busqueda ? (
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={busqueda.id}
              value={busqueda.value}
              onChange={(event) => busqueda.onChange(event.target.value)}
              placeholder={busqueda.placeholder}
              maxLength={busqueda.maxLength}
              className="h-9 rounded-lg bg-white pl-9 shadow-none"
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

        <Button
          type="button"
          variant="outline"
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => setAbierto((actual) => !actual)}
          className={cn(
            "h-9 shrink-0 rounded-lg bg-white px-3 shadow-none",
            cantidad > 0 && "border-primary/40",
          )}
        >
          <SlidersHorizontal data-icon="inline-start" />
          {cantidad > 0 ? `Filtros (${cantidad})` : "Filtros"}
          <ChevronDown
            data-icon="inline-end"
            className={cn(
              "transition-transform duration-200",
              abierto && "rotate-180",
            )}
          />
        </Button>
      </div>

      {cantidad > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {etiquetas.map((item) => (
            <li key={item.id}>
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border bg-white px-2.5 py-0.5 text-xs text-muted-foreground">
                <span className="truncate">{item.etiqueta}</span>
                <button
                  type="button"
                  aria-label={`Quitar filtro ${item.etiqueta}`}
                  onClick={item.onQuitar}
                  className="rounded-full hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,margin-top] duration-200 ease-out",
          abierto ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div
          inert={!abierto}
          className={cn("min-h-0", abierto ? "overflow-visible" : "overflow-hidden")}
        >
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children}
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={onLimpiar}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {aviso ? <div className="mt-3">{aviso}</div> : null}
    </div>
  );
}
