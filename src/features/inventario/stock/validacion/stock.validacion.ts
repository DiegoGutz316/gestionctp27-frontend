import { z } from "zod";
import { paginarSchema, type ResultadoPaginado } from "@/lib/paginacion";
import { UNIDADES_MEDIDA, type UnidadMedida } from "../../producto/models/producto.model";
import {
  configuracionStockSchema,
  inventarioSchema,
} from "../models/stock.model";

// Los formularios envían los campos numéricos como string; z.coerce los
// convierte a number y el genérico <number | string> mantiene z.input tipado.
const numeroDesdeInput = (mensaje: string) =>
  z.coerce.number<number | string>({ error: mensaje });

// z.coerce.number convierte '' (o solo espacios) en 0, ya que Number('') es 0.
// Sin esto, un campo numérico obligatorio dejado vacío pasaría los límites
// mínimos (p. ej. .min(0)) como si el usuario hubiera ingresado 0. Se
// transforma a undefined antes de coercionar para que el chequeo de
// obligatoriedad del campo lo rechace con su mensaje correspondiente.
const sinVacios = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (valor) => (typeof valor === "string" && valor.trim() === "" ? undefined : valor),
    schema,
  );

/**
 * Límites de las columnas numeric(12,2) del inventario (deben coincidir con
 * `dto/limites-numericos.ts` del backend). Si no se validan aquí, Postgres
 * redondea o desborda el valor y la API responde con un error genérico.
 */
export const VALOR_MAXIMO = 9999999999.99;
const VALOR_MAXIMO_TEXTO = VALOR_MAXIMO.toLocaleString("es-CR", {
  minimumFractionDigits: 2,
});

const tieneDosDecimalesComoMucho = (valor: number) =>
  Number(valor.toFixed(2)) === valor;

const acotarADecimal = (
  etiqueta: string,
  base: ReturnType<typeof numeroDesdeInput>,
) =>
  base
    .max(VALOR_MAXIMO, `${etiqueta} no puede superar ${VALOR_MAXIMO_TEXTO}`)
    .refine(tieneDosDecimalesComoMucho, {
      error: `${etiqueta} admite como máximo 2 decimales`,
    });

// La configuración solo define mínimo y precio; la cantidad pertenece al
// registro separado de existencias.
export const crearConfiguracionStockSchema = z.object({
  productoId: sinVacios(
    numeroDesdeInput("Seleccione un producto")
      .int("Seleccione un producto")
      .positive("Seleccione un producto"),
  ),
  stockMinimo: sinVacios(
    acotarADecimal(
      "El stock mínimo",
      numeroDesdeInput("El stock mínimo es obligatorio").min(
        0,
        "El stock mínimo debe ser 0 o mayor",
      ),
    ),
  ),
  precio: sinVacios(
    acotarADecimal(
      "El precio",
      numeroDesdeInput("El precio es obligatorio").min(
        0,
        "El precio debe ser 0 o mayor",
      ),
    ),
  ),
});

export type CrearConfiguracionStock = z.output<
  typeof crearConfiguracionStockSchema
>;
export type CrearConfiguracionStockInput = z.input<
  typeof crearConfiguracionStockSchema
>;

// Editar la configuración nunca modifica las existencias.
export const editarConfiguracionStockSchema = z.object({
  stockMinimo: sinVacios(
    acotarADecimal(
      "El stock mínimo",
      numeroDesdeInput("El stock mínimo es obligatorio").min(
        0,
        "El stock mínimo debe ser 0 o mayor",
      ),
    ),
  ),
  precio: sinVacios(
    acotarADecimal(
      "El precio",
      numeroDesdeInput("El precio es obligatorio").min(
        0,
        "El precio debe ser 0 o mayor",
      ),
    ),
  ),
});

export type EditarConfiguracionStock = z.output<
  typeof editarConfiguracionStockSchema
>;
export type EditarConfiguracionStockInput = z.input<
  typeof editarConfiguracionStockSchema
>;

export const configuracionStockRespuestaSchema = configuracionStockSchema;

export type ConfiguracionStockRespuesta = z.infer<
  typeof configuracionStockRespuestaSchema
>;

export type InventarioRespuesta = z.infer<typeof inventarioSchema>;

export function fechaLocalHoy(): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Costa_Rica",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

const fechaMovimiento = z
  .string({ error: "La fecha es obligatoria" })
  .min(1, "La fecha es obligatoria")
  .pipe(z.iso.date({ error: "Ingrese una fecha válida" }))
  .refine((fecha) => fecha <= fechaLocalHoy(), {
    error: "La fecha no puede ser futura",
  });

/**
 * El campo `cantidad` de un movimiento admite decimales cuando el producto
 * es GRANEL (ej. 12.5 kg) pero exige enteros cuando es UNIDAD (ej. 12
 * unidades) — replica `StockService.validarCantidadSegunUnidad` del backend.
 */
function campoCantidadMovimiento(unidadMedida: UnidadMedida) {
  const base = acotarADecimal(
    "La cantidad",
    numeroDesdeInput("La cantidad es obligatoria").positive(
      "La cantidad debe ser mayor que 0",
    ),
  );

  const conEntero =
    unidadMedida === "UNIDAD"
      ? base.refine((valor) => Number.isInteger(valor), {
          error:
            "La cantidad debe ser un número entero para productos por unidad",
        })
      : base;

  return sinVacios(conEntero);
}

export function crearEntradaSchema(unidadMedida: UnidadMedida) {
  return z.object({
    cantidad: campoCantidadMovimiento(unidadMedida),
    fecha: fechaMovimiento,
    origen: z
      .string({ error: "El origen es obligatorio" })
      .trim()
      .min(1, "El origen es obligatorio")
      .max(150, "El origen no puede superar 150 caracteres"),
  });
}

export type CrearEntrada = z.output<ReturnType<typeof crearEntradaSchema>>;
export type CrearEntradaInput = z.input<ReturnType<typeof crearEntradaSchema>>;

export function crearSalidaSchema(unidadMedida: UnidadMedida) {
  return z.object({
    cantidad: campoCantidadMovimiento(unidadMedida),
    fecha: fechaMovimiento,
    motivo: z
      .string({ error: "El motivo es obligatorio" })
      .trim()
      .min(1, "El motivo es obligatorio")
      .max(200, "El motivo no puede superar 200 caracteres"),
  });
}

export type CrearSalida = z.output<ReturnType<typeof crearSalidaSchema>>;
export type CrearSalidaInput = z.input<ReturnType<typeof crearSalidaSchema>>;

/**
 * Respuesta de `POST /inventario/existencias/:id/entradas` y `/salidas`: el
 * backend devuelve el movimiento con el registro de inventario ya
 * actualizado (`inventario` completo, no la forma curada del historial).
 */
export const movimientoCreadoSchema = z.object({
  id: z.number(),
  tipo: z.enum(["ENTRADA", "SALIDA"]),
  cantidad: z.number(),
  fecha: z.string(),
  origen: z.string().nullable(),
  motivo: z.string().nullable(),
  responsable: z.object({ id: z.string(), nombre: z.string() }).nullable(),
  creadoEn: z.string(),
  inventario: inventarioSchema,
});

export type MovimientoCreadoRespuesta = z.infer<typeof movimientoCreadoSchema>;

export const movimientoSchema = z.object({
  id: z.number(),
  tipo: z.enum(["APERTURA", "AJUSTE", "ENTRADA", "SALIDA"]),
  cantidad: z.number(),
  fecha: z.string(),
  origen: z.string().nullable(),
  motivo: z.string().nullable(),
  creadoEn: z.string(),
  inventario: z.object({
    id: z.number(),
    producto: z.object({
      id: z.number(),
      nombre: z.string(),
      unidadMedida: z.enum(UNIDADES_MEDIDA),
    }),
  }),
  responsable: z.object({ id: z.string(), nombre: z.string() }).nullable(),
});

export type MovimientoRespuesta = z.infer<typeof movimientoSchema>;

// Omite `q`: el historial de movimientos no admite búsqueda por texto libre,
// se filtra por registro de inventario y por fechas (igual que el backend).
export const filtrarMovimientosSchema = paginarSchema.omit({ q: true }).extend({
  inventarioId: numeroDesdeInput("Registro de inventario inválido")
    .int()
    .positive()
    .optional(),
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export type FiltrarMovimientos = z.output<typeof filtrarMovimientosSchema>;

export type ResultadoPaginadoMovimientos = ResultadoPaginado<MovimientoRespuesta>;
