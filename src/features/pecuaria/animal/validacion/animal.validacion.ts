import { z } from "zod";

import { fechaHoyCR } from "@/lib/fechas";

import {
  CATEGORIAS_BOVINAS,
  ESPECIES_ANIMAL,
  ESPECIES_MENORES,
  ESTADOS_ANIMAL,
  TIPOS_INVENTARIO_ANIMAL,
} from "../models/animal.model";

/** Criterios de orden del listado. Replica `OrdenAnimales` del backend. */
export const ORDENES_ANIMALES = ["NOMBRE", "CODIGO", "ESTADO"] as const;

export type OrdenAnimales = (typeof ORDENES_ANIMALES)[number];

export const ETIQUETA_ORDEN_ANIMALES: Record<OrdenAnimales, string> = {
  NOMBRE: "Nombre",
  CODIGO: "Código",
  ESTADO: "Estado",
};

/**
 * Filtros del listado. `q` busca en código, nombre y estado; `incluirInactivos`
 * permite ver animales dados de baja, que por defecto quedan fuera.
 */
export const filtrarAnimalesSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(120, "La búsqueda no puede superar 120 caracteres")
    .optional(),
  incluirInactivos: z.boolean().optional(),
  orden: z.enum(ORDENES_ANIMALES).optional(),
});

export type FiltrarAnimales = z.output<typeof filtrarAnimalesSchema>;

export const crearAnimalSchema = z
  .object({
    codigo: z
      .string({ error: "El código del animal es obligatorio" })
      .trim()
      .min(1, "El código del animal es obligatorio")
      .max(50, "El código no puede superar 50 caracteres"),

    nombre: z
      .string({ error: "El nombre del animal es obligatorio" })
      .trim()
      .min(1, "El nombre del animal es obligatorio")
      .max(120, "El nombre no puede superar 120 caracteres"),

    tipoInventario: z.enum(TIPOS_INVENTARIO_ANIMAL, {
      error: "Seleccione si pertenece al inventario de bovinos o a especies menores",
    }),

    especie: z.enum(ESPECIES_ANIMAL, {
      error: "Seleccione una especie",
    }),

    categoriaBovina: z
      .union([z.enum(CATEGORIAS_BOVINAS), z.literal("")])
      .optional(),

    raza: z
      .string({ error: "La raza del animal es obligatoria" })
      .trim()
      .min(1, "La raza del animal es obligatoria")
      .max(100, "La raza no puede superar 100 caracteres"),

    // `z.iso.date()` y no una expresión regular: la regular dejaba pasar fechas
    // que no existen (2026-02-31). Mismo patrón que Vacuna y Desparasitación.
    fechaNacimiento: z
      .string({ error: "La fecha de nacimiento es obligatoria" })
      .min(1, "La fecha de nacimiento es obligatoria")
      .pipe(z.iso.date({ error: "Ingrese una fecha válida" }))
      .refine(
        (valor) => valor <= fechaHoyCR(),
        "La fecha de nacimiento no puede ser futura",
      ),

    estado: z.enum(ESTADOS_ANIMAL, {
      error: "Seleccione un estado",
    }),

    observaciones: z.string().trim().optional(),
  })
  .superRefine((datos, contexto) => {
    if (datos.tipoInventario === "GANADO_BOVINO") {
      if (datos.especie !== "VACA") {
        contexto.addIssue({
          code: "custom",
          path: ["especie"],
          message: "El inventario de bovinos corresponde a ganado bovino",
        });
      }
      if (!datos.categoriaBovina) {
        contexto.addIssue({
          code: "custom",
          path: ["categoriaBovina"],
          message: "Seleccione si es toro, novilla, vaca, ternero/a o torete",
        });
      }
    }

    if (
      datos.tipoInventario === "ESPECIES_MENORES" &&
      !(ESPECIES_MENORES as readonly string[]).includes(datos.especie)
    ) {
      contexto.addIssue({
        code: "custom",
        path: ["especie"],
        message: "Seleccione chancho, gallina, pollo o cabra",
      });
    }
  })
  .transform(({ tipoInventario: _tipoInventario, ...datos }) => ({
    ...datos,
    categoriaBovina:
      datos.especie === "VACA" && datos.categoriaBovina
        ? datos.categoriaBovina
        : undefined,
    observaciones: datos.observaciones || undefined,
  }));

export type CrearAnimal = z.output<typeof crearAnimalSchema>;
export type CrearAnimalInput = z.input<typeof crearAnimalSchema>;

export const animalSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nombre: z.string(),
  especie: z.string(),
  categoriaBovina: z.string().nullable().optional(),
  raza: z.string(),
  fechaNacimiento: z.string(),
  estado: z.string(),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
  actualizadoEn: z.string(),
  actualizadoPor: z.uuid().nullable(),
});

export type AnimalRespuesta = z.infer<typeof animalSchema>;
