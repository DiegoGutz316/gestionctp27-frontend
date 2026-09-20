import { fechaHoyCR } from "@/lib/fechas";

export type RangoFechas = {
  desde: string;
  hasta: string;
};

/**
 * La semana empieza el lunes (ISO 8601). Poniendo 0 empezaría el domingo, sin
 * tocar nada más: los atajos de semana salen de aquí.
 */
const DIA_INICIO_SEMANA = 1;

/**
 * Suma (o resta) días a una fecha AAAA-MM-DD.
 *
 * La cuenta se hace en UTC a propósito: construir la fecha en la zona del
 * navegador haría que, según dónde esté el usuario, el resultado cayera un
 * día antes o después. Aquí la fecha es un dato de calendario, no un instante.
 */
function sumarDias(fecha: string, dias: number): string {
  const base = new Date(`${fecha}T00:00:00.000Z`);

  base.setUTCDate(base.getUTCDate() + dias);

  return base.toISOString().slice(0, 10);
}

/** Primer día de la semana a la que pertenece la fecha. */
function inicioDeSemana(fecha: string): string {
  const base = new Date(`${fecha}T00:00:00.000Z`);

  const diferencia = (base.getUTCDay() - DIA_INICIO_SEMANA + 7) % 7;

  return sumarDias(fecha, -diferencia);
}

/**
 * Primer y último día de un mes. El día 0 del mes siguiente es el último del
 * mes pedido, así que el calendario resuelve solo los meses de 28, 30 y 31.
 */
function limitesDelMes(anio: number, mes: number): RangoFechas {
  return {
    desde: `${anio}-${String(mes).padStart(2, "0")}-01`,
    hasta: new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10),
  };
}

/**
 * Atajos del filtro de fechas del historial de cosechas.
 *
 * Son los períodos que se consultan de verdad —lo de esta semana, lo del mes
 * pasado—, y con un clic evitan tener que abrir dos calendarios.
 *
 * Los períodos en curso terminan hoy y no el domingo o el día 31, porque una
 * cosecha futura no puede existir: el registro ya rechaza esas fechas y el
 * filtro las rechazaría igual.
 */
export const rangosRapidos = [
  {
    id: "hoy",
    etiqueta: "Hoy",
    calcular: (): RangoFechas => {
      const hoy = fechaHoyCR();

      return { desde: hoy, hasta: hoy };
    },
  },
  {
    id: "semana-actual",
    etiqueta: "Semana actual",
    calcular: (): RangoFechas => {
      const hoy = fechaHoyCR();

      return { desde: inicioDeSemana(hoy), hasta: hoy };
    },
  },
  {
    id: "semana-pasada",
    etiqueta: "Semana pasada",
    // La semana completa anterior a la actual, de lunes a domingo: los dos
    // extremos ya pasaron, así que esta sí llega hasta su último día.
    calcular: (): RangoFechas => {
      const inicio = sumarDias(inicioDeSemana(fechaHoyCR()), -7);

      return { desde: inicio, hasta: sumarDias(inicio, 6) };
    },
  },
  {
    id: "mes-actual",
    etiqueta: "Mes actual",
    calcular: (): RangoFechas => {
      const hoy = fechaHoyCR();

      return { desde: `${hoy.slice(0, 7)}-01`, hasta: hoy };
    },
  },
  {
    id: "mes-pasado",
    etiqueta: "Mes pasado",
    calcular: (): RangoFechas => {
      const hoy = fechaHoyCR();
      const anio = Number(hoy.slice(0, 4));
      const mes = Number(hoy.slice(5, 7));

      // En enero el mes pasado es diciembre del año anterior.
      return mes === 1 ? limitesDelMes(anio - 1, 12) : limitesDelMes(anio, mes - 1);
    },
  },
  {
    id: "este-anio",
    etiqueta: "Este año",
    calcular: (): RangoFechas => {
      const hoy = fechaHoyCR();

      return { desde: `${hoy.slice(0, 4)}-01-01`, hasta: hoy };
    },
  },
] as const;

/** Identifica si el rango escrito coincide con alguno de los atajos. */
export function rangoRapidoActivo(desde: string, hasta: string): string | null {
  if (!desde || !hasta) return null;

  const coincide = rangosRapidos.find((rango) => {
    const valores = rango.calcular();

    return valores.desde === desde && valores.hasta === hasta;
  });

  return coincide?.id ?? null;
}
