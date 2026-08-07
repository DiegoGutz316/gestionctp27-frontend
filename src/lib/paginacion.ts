import { z } from "zod";

/** Params base alineados con PaginarDto del backend. */
export const paginarSchema = z.object({
  pagina: z.number().int().min(1).optional(),
  limite: z.number().int().min(1).max(100).optional(),
  q: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(150, "La búsqueda no puede superar 150 caracteres")
    .optional(),
});

export type PaginarParams = z.output<typeof paginarSchema>;

export type MetaPaginacion = {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  tieneAnterior: boolean;
  tieneSiguiente: boolean;
};

export type ResultadoPaginado<T> = {
  datos: T[];
  meta: MetaPaginacion;
};

/** Números de página a mostrar en la barra (1-based, inclusive). */
export function numerosDePagina(totalPaginas: number): number[] {
  const total = Math.max(0, Math.trunc(totalPaginas));
  if (total === 0) return [];
  return Array.from({ length: total }, (_, index) => index + 1);
}
