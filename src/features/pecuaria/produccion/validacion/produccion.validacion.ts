import { z } from "zod";

import { animalSchema } from "../../animal/validacion/animal.validacion";
import {
  TIPOS_PRODUCCION,
  tiposProduccionDeEspecie,
} from "../models/produccion.model";

const cantidadSchema = z
  .string({ error: "La cantidad es obligatoria" })
  .trim()
  .min(1, "La cantidad es obligatoria")
  .transform((valor) => Number(valor.replace(",", ".")))
  .pipe(
    z
      .number({ error: "La cantidad debe ser un número válido" })
      .refine(Number.isFinite, "La cantidad debe ser un número válido")
      .positive("La cantidad debe ser mayor a cero")
      .max(9_999_999_999.99, "La cantidad no puede superar 9 999 999 999.99")
      .refine(
        (valor) => Number(valor.toFixed(2)) === valor,
        "La cantidad admite como máximo 2 decimales",
      ),
  );

export const registrarProduccionSchema = z.object({
  animalId: z
    .string({ error: "Seleccione un animal" })
    .min(1, "Seleccione un animal")
    .regex(/^\d+$/, "Seleccione un animal válido")
    .transform((valor) => Number(valor))
    .pipe(z.number().int().positive("Seleccione un animal válido")),

  tipoProduccion: z.enum(TIPOS_PRODUCCION, {
    error: "Seleccione un tipo de producción",
  }),

  cantidad: cantidadSchema,

  fecha: z
    .string({ error: "La fecha de producción es obligatoria" })
    .min(1, "La fecha de producción es obligatoria")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La fecha de producción debe tener un formato válido",
    ),
});

/**
 * Esquema de registro que además exige que el tipo corresponda a la especie
 * del animal. La especie no viaja en el formulario, así que se recibe una
 * función que la busca por `animalId`. Si la especie no se conoce, no se marca
 * error aquí y decide el backend.
 */
export function crearRegistrarProduccionSchema(
  especieDeAnimal: (animalId: number) => string | undefined,
) {
  return registrarProduccionSchema.superRefine((datos, contexto) => {
    const permitidos = tiposProduccionDeEspecie(
      especieDeAnimal(datos.animalId),
    );

    if (
      permitidos.length > 0 &&
      !permitidos.includes(datos.tipoProduccion)
    ) {
      contexto.addIssue({
        code: "custom",
        path: ["tipoProduccion"],
        message: "El tipo de producción no corresponde a la especie del animal",
      });
    }
  });
}

export type RegistrarProduccion = z.output<typeof registrarProduccionSchema>;
export type RegistrarProduccionInput = z.input<typeof registrarProduccionSchema>;

export const produccionSchema = z.object({
  id: z.number(),
  animalId: z.number(),
  tipoProduccion: z.enum(TIPOS_PRODUCCION),
  cantidad: z.number(),
  fecha: z.string(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type ProduccionRespuesta = z.infer<typeof produccionSchema>;

const animalConsultaSchema = animalSchema.pick({
  id: true,
  codigo: true,
  nombre: true,
  especie: true,
  estado: true,
});

export const consultaProduccionSchema = z.object({
  animal: animalConsultaSchema,
  desde: z.string().nullable(),
  registros: z.array(produccionSchema),
  totales: z.array(
    z.object({
      tipoProduccion: z.enum(TIPOS_PRODUCCION),
      cantidad: z.number(),
    }),
  ),
});

export type ConsultaProduccion = z.infer<typeof consultaProduccionSchema>;

export type ConsultarProduccion = {
  animalId: number;
  desde?: string;
  tipoProduccion?: (typeof TIPOS_PRODUCCION)[number];
};
