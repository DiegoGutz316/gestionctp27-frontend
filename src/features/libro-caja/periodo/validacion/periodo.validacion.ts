import { z } from "zod";
import { paginarSchema, type ResultadoPaginado } from "@/lib/paginacion";
import { departamentoSchema } from "../../departamento/validacion/departamento.validacion";
import {
  ESTADOS_FONDO,
  ESTADOS_PERIODO,
  VALOR_MAXIMO_FONDO,
  VALOR_MAXIMO_FONDO_TEXTO,
} from "../models/periodo.model";

const fechaPeriodoSchema = z
  .string({ error: "La fecha es obligatoria" })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingrese una fecha válida en formato AAAA-MM-DD")
  .refine((valor) => {
    const fecha = new Date(`${valor}T00:00:00.000Z`);
    return (
      !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
    );
  }, "Ingrese una fecha válida en formato AAAA-MM-DD");

const datosPeriodoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del periodo es obligatorio" })
    .trim()
    .min(1, "El nombre del periodo es obligatorio")
    .max(120, "El nombre del periodo no puede superar 120 caracteres"),
  fechaInicio: fechaPeriodoSchema,
  fechaFin: fechaPeriodoSchema,
});

function conRangoValido<T extends z.ZodType>(schema: T) {
  return schema.refine(
    (valor) => {
      const datos = valor as { fechaInicio?: string; fechaFin?: string };
      return (
        !datos.fechaInicio ||
        !datos.fechaFin ||
        datos.fechaInicio <= datos.fechaFin
      );
    },
    {
      error: "La fecha de inicio no puede ser posterior a la fecha de fin",
      path: ["fechaFin"],
    },
  );
}

const tieneDosDecimalesComoMucho = (valor: number) =>
  Number(valor.toFixed(2)) === valor;

export const fondoInicialSchema = z.object({
  departamentoId: z
    .number({ error: "El departamento es obligatorio" })
    .int("El departamento es inválido")
    .positive("El departamento es inválido"),
  monto: z
    .string({ error: "El fondo del departamento es obligatorio" })
    .trim()
    .min(1, "El fondo del departamento es obligatorio")
    .refine(
      (valor) => Number.isFinite(Number(valor)),
      "El fondo debe ser un número válido",
    )
    .transform((valor) => Number(valor))
    .refine((valor) => valor >= 0, {
      error: "El fondo no puede ser negativo",
    })
    .refine((valor) => valor <= VALOR_MAXIMO_FONDO, {
      error: `El fondo no puede superar ${VALOR_MAXIMO_FONDO_TEXTO}`,
    })
    .refine(tieneDosDecimalesComoMucho, {
      error: "El fondo admite como máximo 2 decimales",
    }),
});

export type FondoInicial = z.output<typeof fondoInicialSchema>;
export type FondoInicialInput = z.input<typeof fondoInicialSchema>;

export const abrirPeriodoSchema = conRangoValido(
  datosPeriodoSchema.extend({
    fondos: z
      .array(fondoInicialSchema)
      .min(1, "Debe indicar el fondo de cada departamento"),
  }),
);
export const editarPeriodoSchema = conRangoValido(datosPeriodoSchema);

export type AbrirPeriodo = z.output<typeof abrirPeriodoSchema>;
export type AbrirPeriodoInput = z.input<typeof abrirPeriodoSchema>;
export type EditarPeriodo = z.output<typeof editarPeriodoSchema>;
export type EditarPeriodoInput = z.input<typeof editarPeriodoSchema>;

export const cerrarPeriodoSchema = z.object({
  confirmar: z.boolean().refine((valor) => valor === true, {
    error: "Debe confirmar que desea cerrar el periodo",
  }),
});

export type CerrarPeriodo = z.output<typeof cerrarPeriodoSchema>;
export type CerrarPeriodoInput = z.input<typeof cerrarPeriodoSchema>;

export const solicitarFondoSchema = z.object({
  montoSolicitado: z
    .string({ error: "El monto solicitado es obligatorio" })
    .trim()
    .min(1, "El monto solicitado es obligatorio")
    .refine(
      (valor) => Number.isFinite(Number(valor)),
      "El monto solicitado debe ser un número válido",
    )
    .transform((valor) => Number(valor))
    .refine((valor) => valor > 0, {
      error: "El monto solicitado debe ser mayor que 0",
    })
    .refine((valor) => valor <= VALOR_MAXIMO_FONDO, {
      error: `El monto solicitado no puede superar ${VALOR_MAXIMO_FONDO_TEXTO}`,
    })
    .refine(tieneDosDecimalesComoMucho, {
      error: "El monto admite como máximo 2 decimales",
    }),
});

export type SolicitarFondo = z.output<typeof solicitarFondoSchema>;
export type SolicitarFondoInput = z.input<typeof solicitarFondoSchema>;

export const fondoSchema = z.object({
  id: z.number(),
  montoSolicitado: z.number().nullable(),
  estado: z.enum(ESTADOS_FONDO),
  solicitadoEn: z.string().nullable(),
  departamento: departamentoSchema,
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type FondoRespuesta = z.infer<typeof fondoSchema>;

export const periodoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  estado: z.enum(ESTADOS_PERIODO),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type PeriodoRespuesta = z.infer<typeof periodoSchema>;

export const periodoDetalleSchema = periodoSchema.extend({
  fondos: z.array(fondoSchema),
});

export type PeriodoDetalleRespuesta = z.infer<typeof periodoDetalleSchema>;

export const filtrarPeriodosSchema = paginarSchema.extend({
  estado: z.enum(ESTADOS_PERIODO).optional(),
});

export type FiltrarPeriodos = z.output<typeof filtrarPeriodosSchema>;

export type ResultadoPaginadoPeriodos = ResultadoPaginado<PeriodoRespuesta>;
