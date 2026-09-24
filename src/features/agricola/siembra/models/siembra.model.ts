import { z } from "zod";

function esFechaReal(valor: string): boolean {
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

export function fechaHoyLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

const fechaSiembraSchema = z
  .string({ error: "La fecha de siembra es obligatoria" })
  .min(1, "La fecha de siembra es obligatoria")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingrese una fecha de siembra válida")
  .refine(esFechaReal, "Ingrese una fecha de siembra válida")
  .refine((fecha) => fecha <= fechaHoyLocal(), "La fecha de siembra no puede ser futura");

const cantidadSembradaSchema = z
  .string({ error: "La cantidad sembrada es obligatoria" })
  .trim()
  .min(1, "La cantidad sembrada es obligatoria")
  .transform((valor) => Number(valor.replace(",", ".")))
  .pipe(
    z
      .number({ error: "La cantidad sembrada debe ser un número válido" })
      .refine(Number.isFinite, "La cantidad sembrada debe ser un número válido")
      .positive("La cantidad sembrada debe ser mayor a cero")
      .max(9_999_999_999.99, "La cantidad sembrada supera el máximo permitido")
      .refine(
        (valor) => Number(valor.toFixed(2)) === valor,
        "La cantidad sembrada admite como máximo 2 decimales",
      ),
  );

export const registrarSiembraSchema = z.object({
  camaId: z
    .string({ error: "Seleccione una cama de cultivo" })
    .min(1, "Seleccione una cama de cultivo")
    .regex(/^\d+$/, "Seleccione una cama de cultivo válida")
    .transform(Number)
    .pipe(z.number().int().positive("Seleccione una cama de cultivo válida")),
  tipoCultivo: z
    .string({ error: "El tipo de cultivo es obligatorio" })
    .trim()
    .min(1, "El tipo de cultivo es obligatorio")
    .max(120, "El tipo de cultivo no puede superar 120 caracteres"),
  fechaSiembra: fechaSiembraSchema,
  cantidadSembrada: cantidadSembradaSchema,
});

export type RegistrarSiembra = z.output<typeof registrarSiembraSchema>;
export type RegistrarSiembraInput = z.input<typeof registrarSiembraSchema>;

export const siembraSchema = z.object({
  id: z.number(),
  cama: z.object({ id: z.number(), codigo: z.string(), ubicacion: z.string() }),
  tipoCultivo: z.string(),
  fechaSiembra: z.string(),
  cantidadSembrada: z.number(),
  finalizadaEn: z.string().nullable().optional(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type SiembraRespuesta = z.infer<typeof siembraSchema>;
export type ConsultarSiembras = { cultivo?: string; fecha?: string };

export function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return valor;
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR");
}

export function formatearCantidad(valor: number): string {
  return valor.toLocaleString("es-CR", { maximumFractionDigits: 2 });
}
