import { z } from "zod";
import { paginarSchema, type ResultadoPaginado } from "@/lib/paginacion";
import { UNIDADES_MEDIDA, type UnidadMedida } from "../../producto/models/producto.model";
import { productoSchema } from "../../producto/validacion/producto.validacion";

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
 * Límites de las columnas numeric(12,2) del stock (deben coincidir con
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

// El stock nace en cantidad 0 (default del backend); solo cambia registrando
// entradas/salidas (ver crearEntradaSchema/crearSalidaSchema).
export const crearInventarioSchema = z.object({
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

export type CrearInventario = z.output<typeof crearInventarioSchema>;
export type CrearInventarioInput = z.input<typeof crearInventarioSchema>;

// La cantidad no se edita directo: solo cambia registrando entradas/salidas
// (ver crearEntradaSchema/crearSalidaSchema), que quedan en el historial.
export const editarInventarioSchema = z.object({
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

export type EditarInventario = z.output<typeof editarInventarioSchema>;
export type EditarInventarioInput = z.input<typeof editarInventarioSchema>;

const stockSchema = z.object({
  id: z.number(),
  producto: productoSchema,
  cantidad: z.number(),
  stockMinimo: z.number(),
  precio: z.number(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type StockRespuesta = z.infer<typeof stockSchema>;

const fechaMovimiento = z
  .string({ error: "La fecha es obligatoria" })
  .min(1, "La fecha es obligatoria")
  .pipe(z.iso.date({ error: "Ingrese una fecha válida" }));

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
      .string()
      .trim()
      .max(150, "El origen no puede superar 150 caracteres")
      .optional(),
  });
}

export type CrearEntrada = z.output<ReturnType<typeof crearEntradaSchema>>;
export type CrearEntradaInput = z.input<ReturnType<typeof crearEntradaSchema>>;

export function crearSalidaSchema(unidadMedida: UnidadMedida) {
  return z.object({
    cantidad: campoCantidadMovimiento(unidadMedida),
    fecha: fechaMovimiento,
    motivo: z
      .string()
      .trim()
      .max(200, "El motivo no puede superar 200 caracteres")
      .optional(),
  });
}

export type CrearSalida = z.output<ReturnType<typeof crearSalidaSchema>>;
export type CrearSalidaInput = z.input<ReturnType<typeof crearSalidaSchema>>;

/**
 * Respuesta de `POST /inventario/stock/:id/entradas` y `/salidas`: el
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
  responsableId: z.string(),
  creadoEn: z.string(),
  inventario: stockSchema,
});

export type MovimientoCreadoRespuesta = z.infer<typeof movimientoCreadoSchema>;

export const movimientoSchema = z.object({
  id: z.number(),
  tipo: z.enum(["ENTRADA", "SALIDA"]),
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
  responsable: z.object({ id: z.string(), nombre: z.string() }),
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
