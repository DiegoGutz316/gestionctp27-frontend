import { z } from "zod";
import {
  VALOR_MAXIMO_FONDO,
  VALOR_MAXIMO_FONDO_TEXTO,
} from "../models/periodo.model";
import { fondoSchema, periodoSchema } from "./periodo.validacion";

const fechaAsientoSchema = z
  .string({ error: "La fecha del asiento es obligatoria" })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingrese una fecha válida en formato AAAA-MM-DD")
  .refine((valor) => {
    const fecha = new Date(`${valor}T00:00:00.000Z`);
    return (
      !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
    );
  }, "Ingrese una fecha válida en formato AAAA-MM-DD");

const tieneDosDecimalesComoMucho = (valor: number) =>
  Number(valor.toFixed(2)) === valor;

const montoAsientoSchema = z
  .string({ error: "El monto debe ser un número válido" })
  .trim()
  .transform((valor) => (valor === "" ? 0 : Number(valor)))
  .refine((valor) => Number.isFinite(valor), "El monto debe ser un número válido")
  .refine((valor) => valor >= 0, {
    error: "El monto no puede ser negativo",
  })
  .refine((valor) => valor <= VALOR_MAXIMO_FONDO, {
    error: `El monto no puede superar ${VALOR_MAXIMO_FONDO_TEXTO}`,
  })
  .refine(tieneDosDecimalesComoMucho, {
    error: "El monto admite como máximo 2 decimales",
  });

export const crearAsientoSchema = z
  .object({
    fecha: fechaAsientoSchema,
    numeroFactura: z
      .string()
      .trim()
      .max(40, "El número de factura no puede superar 40 caracteres"),
    descripcion: z
      .string({ error: "La descripción es obligatoria" })
      .trim()
      .min(1, "La descripción es obligatoria")
      .max(250, "La descripción no puede superar 250 caracteres"),
    ingresos: montoAsientoSchema,
    egresos: montoAsientoSchema,
  })
  .superRefine((datos, contexto) => {
    const hayIngreso = datos.ingresos > 0;
    const hayEgreso = datos.egresos > 0;
    if (hayIngreso === hayEgreso) {
      const mensaje =
        "Indique un ingreso o un egreso, no ambos. El otro queda en 0.";
      contexto.addIssue({
        code: "custom",
        message: mensaje,
        path: ["ingresos"],
      });
      contexto.addIssue({
        code: "custom",
        message: mensaje,
        path: ["egresos"],
      });
    }
  });

export type CrearAsiento = z.output<typeof crearAsientoSchema>;
export type CrearAsientoInput = z.input<typeof crearAsientoSchema>;

export const asientoSchema = z.object({
  id: z.number(),
  numero: z.number(),
  fecha: z.string(),
  numeroFactura: z.string(),
  descripcion: z.string(),
  ingresos: z.number(),
  egresos: z.number(),
  saldo: z.number(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type AsientoRespuesta = z.infer<typeof asientoSchema>;

export const libroDepartamentoSchema = z.object({
  periodo: periodoSchema,
  fondo: fondoSchema,
  fondoInicial: z.number(),
  asientos: z.array(asientoSchema),
  totales: z.object({
    ingresos: z.number(),
    egresos: z.number(),
    saldo: z.number(),
  }),
});

export type LibroDepartamentoRespuesta = z.infer<
  typeof libroDepartamentoSchema
>;
