import { z } from "zod";

function esFechaReal(valor: string): boolean {
  const fecha = new Date(`${valor}T00:00:00.000Z`);

  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.toISOString().slice(0, 10) === valor
  );
}

export function fechaHoyLocal(): string {
  const ahora = new Date();

  const anio = ahora.getFullYear();
  const mes = String(
    ahora.getMonth() + 1,
  ).padStart(2, "0");
  const dia = String(
    ahora.getDate(),
  ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

const fechaTratamientoSchema = z
  .string({
    error:
      "La fecha del tratamiento es obligatoria",
  })
  .min(
    1,
    "La fecha del tratamiento es obligatoria",
  )
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Ingrese una fecha de tratamiento válida",
  )
  .refine(
    esFechaReal,
    "Ingrese una fecha de tratamiento válida",
  )
  .refine(
    (fecha) => fecha <= fechaHoyLocal(),
    "La fecha del tratamiento no puede ser futura",
  );

const cantidadSchema = z
  .string({
    error: "La cantidad aplicada es obligatoria",
  })
  .trim()
  .min(
    1,
    "La cantidad aplicada es obligatoria",
  )
  .transform((valor) =>
    Number(valor.replace(",", ".")),
  )
  .pipe(
    z
      .number({
        error:
          "La cantidad aplicada debe ser un número válido",
      })
      .refine(
        Number.isFinite,
        "La cantidad aplicada debe ser un número válido",
      )
      .positive(
        "La cantidad aplicada debe ser mayor a cero",
      )
      .max(
        9_999_999_999.99,
        "La cantidad aplicada supera el máximo permitido",
      )
      .refine(
        (valor) =>
          Number(valor.toFixed(2)) === valor,
        "La cantidad aplicada admite como máximo 2 decimales",
      ),
  );

export const TIPOS_TRATAMIENTO = [
  "FERTILIZANTE",
  "FUNGICIDA",
  "INSECTICIDA",
  "HERBICIDA",
  "OTRO",
] as const;

export type TipoTratamiento = (typeof TIPOS_TRATAMIENTO)[number];

export const ETIQUETA_TIPO_TRATAMIENTO: Record<TipoTratamiento, string> = {
  FERTILIZANTE: "Fertilizante",
  FUNGICIDA: "Fungicida",
  INSECTICIDA: "Insecticida",
  HERBICIDA: "Herbicida",
  OTRO: "Otro",
};

export const UNIDADES_TRATAMIENTO = ["KG", "G", "L", "ML", "UNIDADES"] as const;

export type UnidadTratamiento = (typeof UNIDADES_TRATAMIENTO)[number];

export const ETIQUETA_UNIDAD_TRATAMIENTO: Record<UnidadTratamiento, string> = {
  KG: "kg",
  G: "g",
  L: "L",
  ML: "ml",
  UNIDADES: "unidades",
};

export const ACTIVIDADES_AGRICOLAS = [
  "RIEGO",
  "LIMPIEZA",
  "FERTILIZACION",
  "TRATAMIENTO",
] as const;

export type ActividadAgricola = (typeof ACTIVIDADES_AGRICOLAS)[number];

export const ETIQUETA_ACTIVIDAD: Record<ActividadAgricola, string> = {
  RIEGO: "Riego",
  LIMPIEZA: "Limpieza",
  FERTILIZACION: "Fertilización",
  TRATAMIENTO: "Tratamiento",
};

/** Las labores en las que se aplica un producto. */
export function usaProducto(actividad: string): boolean {
  return actividad === "FERTILIZACION" || actividad === "TRATAMIENTO";
}

export const registrarTratamientoSchema = z.object({
  siembraId: z
    .string({ error: "Seleccione una cama con siembra activa" })
    .min(1, "Seleccione una cama con siembra activa")
    .regex(/^\d+$/, "Seleccione una cama con siembra activa")
    .transform(Number)
    .pipe(z.number().int().positive("Seleccione una cama con siembra activa")),

  actividad: z.enum(ACTIVIDADES_AGRICOLAS, {
    error: "Seleccione la actividad realizada",
  }),

  tipo: z.enum(TIPOS_TRATAMIENTO).optional(),

  producto: z
    .string()
    .trim()
    .max(120, "El producto aplicado no puede superar 120 caracteres")
    .optional(),

  fecha: fechaTratamientoSchema,

  cantidad: cantidadSchema.optional(),

  unidad: z.enum(UNIDADES_TRATAMIENTO).optional(),

  observaciones: z.string().trim().optional(),
});

/**
 * El producto depende de la actividad: regar y limpiar no lo llevan;
 * fertilizar y tratar lo exigen con su cantidad y su unidad. La misma regla
 * vive en el backend; aquí evita el viaje.
 */
export const cuidadoSchema = registrarTratamientoSchema.superRefine(
  (valor, ctx) => {
    if (!usaProducto(valor.actividad)) return;

    for (const [campo, mensaje] of [
      ["tipo", "Seleccione un tipo de tratamiento"],
      ["producto", "El producto aplicado es obligatorio"],
      ["cantidad", "La cantidad aplicada es obligatoria"],
      ["unidad", "Seleccione una unidad"],
    ] as const) {
      const dato = valor[campo];

      if (dato === undefined || dato === "") {
        ctx.addIssue({ code: "custom", path: [campo], message: mensaje });
      }
    }
  },
);

export type RegistrarTratamiento =
  z.output<
    typeof registrarTratamientoSchema
  >;

export type RegistrarTratamientoInput =
  z.input<
    typeof registrarTratamientoSchema
  >;

export const tratamientoSchema = z.object({
  id: z.number(),

  siembra: z.object({
    id: z.number(),
    tipoCultivo: z.string(),
    cama: z.object({
      id: z.number(),
      codigo: z.string(),
      ubicacion: z.string(),
    }),
  }),

  actividad: z.enum(ACTIVIDADES_AGRICOLAS),

  tipo: z.enum(TIPOS_TRATAMIENTO).nullable(),

  producto: z.string().nullable(),

  fecha: z.string(),

  cantidad: z.number().nullable(),

  unidad: z.enum(UNIDADES_TRATAMIENTO).nullable(),

  observaciones: z
    .string()
    .nullable(),

  creadoEn: z.string(),

  creadoPor: z.uuid(),
});

export type TratamientoRespuesta =
  z.infer<typeof tratamientoSchema>;

export type ConsultarTratamientos = {
  ubicacion?: string;
  camaId?: number;
  tipo?: TipoTratamiento;
  cultivo?: string;
};

export function nombreDeCama(codigo: string): string {
  return /^cama\b/i.test(codigo.trim()) ? codigo.trim() : `Cama ${codigo.trim()}`;
}

export function formatearFecha(
  valor: string,
): string {
  const [anio, mes, dia] = valor
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!anio || !mes || !dia) {
    return valor;
  }

  return new Date(
    anio,
    mes - 1,
    dia,
  ).toLocaleDateString("es-CR");
}

export function formatearCantidad(
  valor: number,
): string {
  return valor.toLocaleString(
    "es-CR",
    {
      maximumFractionDigits: 2,
    },
  );
}