import { z } from "zod";

import { cosechaSchema, UNIDADES_MEDIDA } from "@/features/agricola/cosecha/models/cosecha.model";
import { siembraSchema } from "@/features/agricola/siembra/models/siembra.model";
import { tratamientoSchema } from "@/features/agricola/tratamiento/models/tratamiento.model";
import { TIPOS_PRODUCCION } from "@/features/pecuaria/produccion/models/produccion.model";
import { fechaHoyCR } from "@/lib/fechas";
import {
  TIPOS_PRODUCTO,
  UNIDADES_MEDIDA as UNIDADES_MEDIDA_INVENTARIO,
} from "@/features/inventario/producto/models/producto.model"; 
/**
 * `z.iso.date()` y no una expresión regular: la regular solo mira la forma del
 * texto y deja pasar fechas que no existen en el calendario, como 2026-02-31.
 */
function fechaReporteSchema(nombre: "inicial" | "final") {
  return z
    .string({ error: `La fecha ${nombre} es obligatoria` })
    .min(1, `La fecha ${nombre} es obligatoria`)
    .pipe(z.iso.date({ error: `Ingrese una fecha ${nombre} válida` }))
    .refine(
      (fecha) => fecha <= fechaHoyCR(),
      `La fecha ${nombre} no puede ser futura`,
    );
}

const MENSAJE_RANGO_INVERTIDO =
  "La fecha inicial no puede ser posterior a la fecha final";

/** Backlog 5.1: animal y período, los tres obligatorios. */
export const filtrosReporteProduccionPecuariaSchema = z
  .object({
    // El selector entrega texto; se convierte a número aquí.
    animalId: z
      .string({ error: "Seleccione un animal" })
      .min(1, "Seleccione un animal")
      .regex(/^\d+$/, "Seleccione un animal válido")
      .transform(Number)
      .pipe(z.number().int().positive("Seleccione un animal válido")),

    fechaInicio: fechaReporteSchema("inicial"),
    fechaFin: fechaReporteSchema("final"),
  })
  .refine(
    (valores) =>
      !valores.fechaInicio ||
      !valores.fechaFin ||
      valores.fechaInicio <= valores.fechaFin,
    { path: ["fechaFin"], message: MENSAJE_RANGO_INVERTIDO },
  );

export type FiltrosReporteProduccionPecuaria = z.output<
  typeof filtrosReporteProduccionPecuariaSchema
>;

/** Backlog 5.2: cultivo y cama opcionales; el período es obligatorio. */
export const filtrosReporteProduccionAgricolaSchema = z
  .object({
    cultivo: z
      .string()
      .trim()
      .max(120, "El cultivo no puede superar 120 caracteres")
      .transform((valor) => (valor === "" ? undefined : valor))
      .optional(),

    // Vacío significa «todas las camas».
    camaId: z
      .string()
      .transform((valor) => (valor === "" ? undefined : Number(valor)))
      .pipe(
        z
          .number()
          .int("Seleccione una cama válida")
          .positive("Seleccione una cama válida")
          .optional(),
      ),

    fechaInicio: fechaReporteSchema("inicial"),
    fechaFin: fechaReporteSchema("final"),
  })
  .refine(
    (valores) =>
      !valores.fechaInicio ||
      !valores.fechaFin ||
      valores.fechaInicio <= valores.fechaFin,
    { path: ["fechaFin"], message: MENSAJE_RANGO_INVERTIDO },
  );

export type FiltrosReporteProduccionAgricola = z.output<
  typeof filtrosReporteProduccionAgricolaSchema
>;

/** Reporte de inventario: producto y categoría opcionales; período obligatorio. */
export const filtrosReporteInventarioSchema = z
  .object({
    productoId: z
      .string()
      .transform((valor) =>
        valor === ""
          ? undefined
          : Number(valor),
      )
      .pipe(
        z
          .number()
          .int(
            "Seleccione un producto válido",
          )
          .positive(
            "Seleccione un producto válido",
          )
          .optional(),
      ),

    tipoProducto: z
      .union([
        z.literal(""),
        z.enum(TIPOS_PRODUCTO),
      ])
      .transform((valor) =>
        valor === ""
          ? undefined
          : valor,
      ),

    fechaInicio:
      fechaReporteSchema("inicial"),

    fechaFin:
      fechaReporteSchema("final"),
  })
  .refine(
    (valores) =>
      !valores.fechaInicio ||
      !valores.fechaFin ||
      valores.fechaInicio <=
        valores.fechaFin,
    {
      path: ["fechaFin"],
      message:
        MENSAJE_RANGO_INVERTIDO,
    },
  );

export type FiltrosReporteInventario =
  z.output<
    typeof filtrosReporteInventarioSchema
  >;

/**
 * Respuesta de GET /reportes/produccion-pecuaria. Es propia del reporte: los
 * registros no traen animalId ni auditoría, así que no sirve `produccionSchema`.
 */
export const reporteProduccionPecuariaSchema = z.object({
  animal: z.object({
    id: z.number(),
    codigo: z.string(),
    nombre: z.string(),
    especie: z.string(),
    estado: z.string(),
  }),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  registros: z.array(
    z.object({
      id: z.number(),
      tipoProduccion: z.enum(TIPOS_PRODUCCION),
      cantidad: z.number(),
      fecha: z.string(),
    }),
  ),
  totales: z.array(
    z.object({
      tipoProduccion: z.enum(TIPOS_PRODUCCION),
      cantidad: z.number(),
    }),
  ),
});

export type ReporteProduccionPecuariaRespuesta = z.infer<
  typeof reporteProduccionPecuariaSchema
>;

/**
 * Respuesta de GET /reportes/produccion-agricola. Las tres listas salen de los
 * mismos mappers que los módulos de siembra, cosecha y tratamiento, así que se
 * reutilizan sus schemas. Solo se totalizan las cosechas, por unidad.
 */
export const reporteProduccionAgricolaSchema = z.object({
  siembras: z.array(siembraSchema),
  cosechas: z.array(cosechaSchema),
  tratamientos: z.array(tratamientoSchema),
  totales: z.object({
    cosechas: z.array(
      z.object({
        unidadMedida: z.enum(UNIDADES_MEDIDA),
        cantidad: z.number(),
      }),
    ),
  }),
});

export type ReporteProduccionAgricolaRespuesta = z.infer<
  typeof reporteProduccionAgricolaSchema
>;


/**
 * Respuesta de GET /reportes/inventario.
 */
export const reporteInventarioSchema =
  z.object({
    fechaInicio: z.string(),
    fechaFin: z.string(),

    registros: z.array(
      z.object({
        inventarioId: z.number(),
        productoId: z.number(),
        producto: z.string(),

        categoria:
          z.enum(TIPOS_PRODUCTO),

        unidadMedida:
          z.enum(
            UNIDADES_MEDIDA_INVENTARIO,
          ),

        entradas: z.number(),
        salidas: z.number(),
        existenciaFinal: z.number(),
        saldoActual: z.number(),
      }),
    ),
  });

export type ReporteInventarioRespuesta =
  z.infer<
    typeof reporteInventarioSchema
  >;