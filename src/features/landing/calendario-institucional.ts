import type { AvisoPublico } from "@/features/comunicacion/validacion/aviso.validacion";

/**
 * El calendario usa la fecha de la actividad (`fecha`). El aviso no guarda
 * hora ni lugar, así que el panel solo muestra los campos que sí existen.
 */

export type CeldaMes = {
  clave: string;
  dia: number;
} | null;

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

export { DIAS_SEMANA };

export function claveDesdeDate(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/** Devuelve `YYYY-MM-DD` solo si el texto es una fecha de calendario real. */
export function claveFechaValida(valor: string | null | undefined): string | null {
  if (!valor) return null;
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor.trim());
  if (!coincidencia) return null;

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  const fecha = new Date(anio, mes - 1, dia);

  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  return `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}`;
}

export function avisosVisiblesEnCalendario(avisos: AvisoPublico[]): AvisoPublico[] {
  return avisos.filter((aviso) => {
    if (aviso.estado != null && aviso.estado !== "ACTIVO") return false;
    return claveFechaValida(aviso.fecha) != null;
  });
}

/**
 * Agrupa por fecha de actividad. Dentro del día, la prioridad institucional
 * va primero; si no hay prioridad, se conserva el orden del endpoint.
 */
export function agruparAvisosPorFecha(
  avisos: AvisoPublico[],
): Map<string, AvisoPublico[]> {
  const mapa = new Map<string, AvisoPublico[]>();

  for (const aviso of avisos) {
    const clave = claveFechaValida(aviso.fecha);
    if (!clave) continue;
    const lista = mapa.get(clave);
    if (lista) lista.push(aviso);
    else mapa.set(clave, [aviso]);
  }

  for (const lista of mapa.values()) {
    lista.sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0));
  }

  return mapa;
}

/**
 * Los próximos avisos, uno por día, para que la lista recorra fechas distintas
 * y no repita el mismo día que ya se puede alternar en el panel.
 */
export function proximosAvisos(
  avisos: AvisoPublico[],
  hoy: string,
  cantidad = 3,
): AvisoPublico[] {
  const porFecha = agruparAvisosPorFecha(avisos);
  const claves = [...porFecha.keys()]
    .filter((clave) => clave >= hoy)
    .sort((a, b) => a.localeCompare(b));

  const elegidos: AvisoPublico[] = [];
  for (const clave of claves) {
    const primero = porFecha.get(clave)?.[0];
    if (!primero) continue;
    elegidos.push(primero);
    if (elegidos.length >= cantidad) break;
  }
  return elegidos;
}

export function semanasDelMes(mes: Date): CeldaMes[][] {
  const anio = mes.getFullYear();
  const indice = mes.getMonth();
  const primero = new Date(anio, indice, 1);
  const offset = (primero.getDay() + 6) % 7;
  const total = new Date(anio, indice + 1, 0).getDate();

  const celdas: CeldaMes[] = Array.from({ length: offset }, () => null);
  for (let dia = 1; dia <= total; dia += 1) {
    celdas.push({
      dia,
      clave: claveDesdeDate(new Date(anio, indice, dia)),
    });
  }
  while (celdas.length % 7 !== 0) celdas.push(null);

  const semanas: CeldaMes[][] = [];
  for (let indiceCelda = 0; indiceCelda < celdas.length; indiceCelda += 7) {
    semanas.push(celdas.slice(indiceCelda, indiceCelda + 7));
  }
  return semanas;
}

export function desplazarMes(mes: Date, delta: number): Date {
  return new Date(mes.getFullYear(), mes.getMonth() + delta, 1);
}

export function mesDeClave(clave: string): Date {
  const [anio, mes] = clave.split("-").map(Number);
  return new Date(anio, mes - 1, 1);
}

export function mesTieneAvisos(
  porFecha: Map<string, AvisoPublico[]>,
  mes: Date,
): boolean {
  const prefijo = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, "0")}`;
  for (const clave of porFecha.keys()) {
    if (clave.startsWith(prefijo)) return true;
  }
  return false;
}

export function etiquetaMes(mes: Date): string {
  const texto = mes.toLocaleDateString("es-CR", {
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toLocaleUpperCase("es-CR") + texto.slice(1);
}

export function fechaLargaAviso(valor: string): string {
  const clave = claveFechaValida(valor);
  if (!clave) return valor;
  const [anio, mes, dia] = clave.split("-").map(Number);
  const texto = new Date(anio, mes - 1, dia).toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toLocaleUpperCase("es-CR") + texto.slice(1);
}

export function fechaCortaAviso(valor: string, hoy = new Date()): string {
  const clave = claveFechaValida(valor);
  if (!clave) return valor;
  const [anio, mes, dia] = clave.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
    year: anio === hoy.getFullYear() ? undefined : "numeric",
  });
}
