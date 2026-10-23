"use client";

import { useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
              className="h-11 rounded-lg bg-white pl-9 shadow-none md:h-9 dark:bg-card"
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

        <Dialog open={abierto} onOpenChange={setAbierto}>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-11 shrink-0 rounded-lg bg-white px-3 shadow-none md:h-9 dark:bg-card",
                  cantidad > 0 && "border-primary/40",
                )}
              />
            }
          >
            <SlidersHorizontal data-icon="inline-start" />
            Filtros
            {cantidad > 0 ? (
              <Badge
                variant="secondary"
                className="h-5 min-w-5 justify-center rounded-full px-1.5"
              >
                {cantidad}
              </Badge>
            ) : null}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros</DialogTitle>
              <DialogDescription>
                Ajuste el listado. La búsqueda de arriba se mantiene.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">{children}</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onLimpiar}>
                Limpiar
              </Button>
              <DialogClose render={<Button type="button" />}>
                Ver resultados
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cantidad > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {etiquetas.map((item) => (
            <li key={item.id}>
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border bg-white px-2.5 py-0.5 text-xs text-muted-foreground dark:bg-card">
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

      {aviso ? <div className="mt-3">{aviso}</div> : null}
    </div>
  );
}
