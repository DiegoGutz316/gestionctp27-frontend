import { z } from "zod";

import { fechaHoyCR } from "@/lib/fechas";

/** Limite de la columna numeric(12,2) del backend. */
const CANTIDAD_MAXIMA = 9_999_999_999.99;

/**
 * `z.iso.date()` y no una expresion regular: la regular solo mira la forma del
 * texto y deja pasar fechas que no existen en el calendario, como 2026-02-31.
 */
const fechaCosechaSchema = z
  .string({ error: "La fecha de cosecha es obligatoria" })
  .min(1, "La fecha de cosecha es obligatoria")
  .pipe(z.iso.date({ error: "Ingrese una fecha de cosecha válida" }))
  .refine(
    (fecha) => fecha <= fechaHoyCR(),
    "La fecha de cosecha no puede ser futura",
  );

const cantidadObtenidaSchema = z
  .string({ error: "La cantidad obtenida es obligatoria" })
  .trim()
  .min(1, "La cantidad obtenida es obligatoria")
  .transform((valor) => Number(valor.replace(",", ".")))
  .pipe(
    z
      .number({ error: "La cantidad obtenida debe ser un número válido" })
      .refine(
        Number.isFinite,
        "La cantidad obtenida debe ser un número válido",
      )
      .positive("La cantidad obtenida debe ser mayor a cero")
      .max(CANTIDAD_MAXIMA, "La cantidad obtenida supera el máximo permitido")
      // Con `toFixed` y no multiplicando por 100: el redondeo de coma flotante
      // hace que 8.29 * 100 de 828.9999999999999 y rechace cantidades validas.
      .refine(
        (valor) => Number(valor.toFixed(2)) === valor,
        "La cantidad obtenida admite como máximo 2 decimales",
      ),
  );

export const registrarCosechaSchema = z.object({
  siembraId: z
    .string({ error: "Seleccione una siembra" })
    .min(1, "Seleccione una siembra")
    .regex(/^\d+$/, "Seleccione una siembra válida")
    .transform(Number)
    .pipe(z.number().int().positive("Seleccione una siembra válida")),

  fecha: fechaCosechaSchema,

  cantidadObtenida: cantidadObtenidaSchema,

  observaciones: z
    .string()
    .trim()
    .max(500, "Las observaciones no pueden superar 500 caracteres")
    .optional(),
});

export type RegistrarCosecha = z.output<typeof registrarCosechaSchema>;

export const cosechaSchema = z.object({
  id: z.number(),
  siembra: z.object({
    id: z.number(),
    tipoCultivo: z.string(),
    fechaSiembra: z.string(),
  }),
  fecha: z.string(),
  cantidadObtenida: z.number(),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type CosechaRespuesta = z.infer<typeof cosechaSchema>;

/**
 * Backlog 3.7: los dos filtros son opcionales y se combinan. La consulta va
 * paginada, porque el historial solo crece.
 */
export type ConsultarCosechas = {
  cultivo?: string;
  fecha?: string;
  pagina?: number;
  limite?: number;
};
