export const CONDICIONES_SALUD = [
  "SANO",
  "ENFERMO",
  "HERIDO",
  "EN_TRATAMIENTO",
  "RECUPERACION",
] as const;

export type CondicionSalud = (typeof CONDICIONES_SALUD)[number];

export const ETIQUETA_CONDICION_SALUD: Record<CondicionSalud, string> = {
  SANO: "Sano",
  ENFERMO: "Enfermo",
  HERIDO: "Herido",
  EN_TRATAMIENTO: "En tratamiento",
  RECUPERACION: "En recuperación",
};

export function fechaHoyLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function formatearFecha(valor: string): string {
  const iso = valor.slice(0, 10);
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR");
}

export type {
  HistorialSalud,
  RegistrarSalud,
  RegistrarSaludInput,
  SaludRespuesta,
} from "../validacion/salud.validacion";
