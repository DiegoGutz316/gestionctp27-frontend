"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { numerosDePagina, type MetaPaginacion } from "@/lib/paginacion";

type ControlesPaginacionProps = {
  meta: MetaPaginacion;
  onPaginaChange: (pagina: number) => void;
};

/**
 * Controles reutilizables de paginación alineados con MetaPaginacion del backend.
 */
export function ControlesPaginacion({
  meta,
  onPaginaChange,
}: ControlesPaginacionProps) {
  if (meta.total <= 0 || meta.totalPaginas <= 0) {
    return null;
  }

  const paginas = numerosDePagina(meta.totalPaginas);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            disabled={!meta.tieneAnterior}
            onClick={() => onPaginaChange(Math.max(1, meta.pagina - 1))}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Anterior
          </Button>
        </PaginationItem>
        {paginas.map((numero) => (
          <PaginationItem key={numero}>
            <Button
              variant={numero === meta.pagina ? "outline" : "ghost"}
              size="icon"
              className={
                numero === meta.pagina
                  ? "border-foreground/20 bg-background"
                  : undefined
              }
              onClick={() => onPaginaChange(numero)}
              aria-current={numero === meta.pagina ? "page" : undefined}
            >
              {numero}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            disabled={!meta.tieneSiguiente}
            onClick={() =>
              onPaginaChange(Math.min(meta.totalPaginas, meta.pagina + 1))
            }
          >
            Siguiente
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
