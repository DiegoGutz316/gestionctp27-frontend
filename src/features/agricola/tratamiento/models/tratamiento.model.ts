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

export const registrarTratamientoSchema =
  z.object({
    siembraId: z
      .string({
        error: "Seleccione una siembra",
      })
      .min(
        1,
        "Seleccione una siembra",
      )
      .regex(
        /^\d+$/,
        "Seleccione una siembra válida",
      )
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .positive(
            "Seleccione una siembra válida",
          ),
      ),

    producto: z
      .string({
        error:
          "El producto aplicado es obligatorio",
      })
      .trim()
      .min(
        1,
        "El producto aplicado es obligatorio",
      )
      .max(
        120,
        "El producto aplicado no puede superar 120 caracteres",
      ),

    fecha: fechaTratamientoSchema,

    cantidad: cantidadSchema,

    observaciones: z
      .string()
      .trim()
      .optional(),
  });

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
  }),

  producto: z.string(),

  fecha: z.string(),

  cantidad: z.number(),

  observaciones: z
    .string()
    .nullable(),

  creadoEn: z.string(),

  creadoPor: z.uuid(),
});

export type TratamientoRespuesta =
  z.infer<typeof tratamientoSchema>;

export type ConsultarTratamientos = {
  cultivo: string;
};

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