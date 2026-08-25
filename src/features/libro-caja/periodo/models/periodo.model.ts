export const ESTADOS_PERIODO = ["ABIERTO", "CERRADO"] as const;

export type EstadoPeriodo = (typeof ESTADOS_PERIODO)[number];

export const ETIQUETA_ESTADO_PERIODO: Record<EstadoPeriodo, string> = {
  ABIERTO: "Abierto",
  CERRADO: "Cerrado",
};

export const ESTADOS_FONDO = ["PENDIENTE", "SOLICITADO"] as const;

export type EstadoFondo = (typeof ESTADOS_FONDO)[number];

export const ETIQUETA_ESTADO_FONDO: Record<EstadoFondo, string> = {
  PENDIENTE: "Pendiente",
  SOLICITADO: "Registrado",
};

export const VALOR_MAXIMO_FONDO = 9999999999.99;

export const VALOR_MAXIMO_FONDO_TEXTO = VALOR_MAXIMO_FONDO.toLocaleString(
  "es-CR",
  { minimumFractionDigits: 2 },
);

export type {
  AbrirPeriodo,
  AbrirPeriodoInput,
  CerrarPeriodo,
  CerrarPeriodoInput,
  EditarPeriodo,
  EditarPeriodoInput,
  FiltrarPeriodos,
  FondoRespuesta,
  PeriodoDetalleRespuesta,
  PeriodoRespuesta,
  SolicitarFondo,
  SolicitarFondoInput,
} from "../validacion/periodo.validacion";
