import { z } from "zod";
import {
  VALOR_MAXIMO_FONDO,
  VALOR_MAXIMO_FONDO_TEXTO,
} from "../models/periodo.model";
import { fondoSchema, periodoSchema } from "./periodo.validacion";
import { normalizarMontoColones } from "./monto-colones";

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

const montoPositivoSchema = z
  .string({ error: "Indique el monto en colones" })
  .trim()
  .min(1, "Indique el monto en colones")
  .transform((valor, contexto) => {
    const numero = normalizarMontoColones(valor);
    if (numero === null) {
      contexto.addIssue({
        code: "custom",
        message:
          "Escriba el monto en colones. Ejemplos válidos: 85000, 85.000, 85,000 o 1250,50",
      });
      return z.NEVER;
    }
    return numero;
  })
  .refine((valor) => valor > 0, {
    error: "El monto debe ser mayor que cero",
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
    tipoMovimiento: z.enum(["INGRESO", "EGRESO"], {
      error: "Seleccione si es un ingreso o un egreso",
    }),
    monto: montoPositivoSchema,
  })
  .transform((datos) => ({
    fecha: datos.fecha,
    numeroFactura: datos.numeroFactura,
    descripcion: datos.descripcion,
    ingresos: datos.tipoMovimiento === "INGRESO" ? datos.monto : 0,
    egresos: datos.tipoMovimiento === "EGRESO" ? datos.monto : 0,
  }));

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
  estado: z.enum(["VIGENTE", "ANULADO"]).default("VIGENTE"),
  motivoAnulacion: z.string().nullable().optional(),
  anuladoEn: z.string().nullable().optional(),
  anuladoPor: z.string().nullable().optional(),
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
