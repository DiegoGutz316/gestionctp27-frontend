import { z } from "zod";

import { formatearCantidad } from "@/features/agricola/siembra/models/siembra.model";
import { fechaHoyCR } from "@/lib/fechas";

/**
 * En qué se midió la cosecha. Va por cosecha y no por siembra: del mismo
 * cultivo se puede pesar un corte y contar otro.
 */
export const UNIDADES_MEDIDA = ["KG", "UNIDADES"] as const;

export type UnidadMedida = (typeof UNIDADES_MEDIDA)[number];

export const ETIQUETA_UNIDAD_MEDIDA: Record<UnidadMedida, string> = {
  KG: "Kilogramos",
  UNIDADES: "Unidades",
};

/** Cómo se lee una cantidad con su unidad: «12,5 kg», «1 unidad», «120 unidades». */
export function formatearCantidadConUnidad(
  valor: number,
  unidad: UnidadMedida,
): string {
  const cantidad = formatearCantidad(valor);

  if (unidad === "KG") return `${cantidad} kg`;

  return `${cantidad} ${valor === 1 ? "unidad" : "unidades"}`;
}

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

export const registrarCosechaSchema = z
  .object({
    siembraId: z
      .string({ error: "Seleccione una siembra" })
      .min(1, "Seleccione una siembra")
      .regex(/^\d+$/, "Seleccione una siembra válida")
      .transform(Number)
      .pipe(z.number().int().positive("Seleccione una siembra válida")),

    fecha: fechaCosechaSchema,

    cantidadObtenida: cantidadObtenidaSchema,

    unidadMedida: z.enum(UNIDADES_MEDIDA, {
      error: "Seleccione la unidad de medida",
    }),

    observaciones: z
      .string()
      .trim()
      .max(500, "Las observaciones no pueden superar 500 caracteres")
      .optional(),
  })
  // Los decimales dependen de la unidad, así que la regla no cabe en el campo:
  // media lechuga no se cosecha, pero medio kilo de tomate sí. El backend
  // valida lo mismo, y la base lo garantiza con un CHECK.
  .superRefine((valores, ctx) => {
    if (
      valores.unidadMedida === "UNIDADES" &&
      !Number.isInteger(valores.cantidadObtenida)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["cantidadObtenida"],
        message: "Medida en unidades, la cantidad debe ser un número entero",
      });
    }
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
  unidadMedida: z.enum(UNIDADES_MEDIDA),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type CosechaRespuesta = z.infer<typeof cosechaSchema>;

/**
 * Backlog 3.7: los filtros son opcionales y se combinan. La consulta va
 * paginada, porque el historial solo crece.
 *
 * La fecha se filtra por rango; `desde` y `hasta` son inclusivos y se pueden
 * usar por separado. Un día exacto es el mismo valor en los dos.
 */
export type ConsultarCosechas = {
  cultivo?: string;
  desde?: string;
  hasta?: string;
  pagina?: number;
  limite?: number;
};
