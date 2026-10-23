import { z } from "zod";

export const configuracionStockSchema = z.object({
  id: z.number(),
  stockMinimo: z.number(),
  precio: z.number(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
  producto: z
    .object({
      id: z.number(),
      nombre: z.string(),
    })
    .optional(),
});

export type ConfiguracionStock = z.infer<typeof configuracionStockSchema>;

export const inventarioSchema = z.object({
  id: z.number(),
  cantidadActual: z.number(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type Inventario = z.infer<typeof inventarioSchema>;
