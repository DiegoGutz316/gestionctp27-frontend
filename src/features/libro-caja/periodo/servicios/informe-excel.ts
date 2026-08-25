import type { Workbook, Worksheet } from "exceljs";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";
import {
  fechaPeriodoIso,
  formatearFechaLarga,
} from "@/features/libro-caja/formato";
import type { LibroDepartamentoRespuesta } from "../validacion/asiento.validacion";

const AZUL = "FFDEEAF6";
const AMARILLO = "FFFFFF99";
const COLONES = '"₡"#,##0.00';
const FECHA = "dd/mm/yyyy";
const MIME_XLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const BORDE_FINO = {
  top: { style: "thin" as const, color: { argb: "FF000000" } },
  left: { style: "thin" as const, color: { argb: "FF000000" } },
  bottom: { style: "thin" as const, color: { argb: "FF000000" } },
  right: { style: "thin" as const, color: { argb: "FF000000" } },
};

function relleno(argb: string) {
  return {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb },
  };
}

function fuente(opciones: {
  size?: number;
  bold?: boolean;
  name?: string;
} = {}) {
  return {
    name: opciones.name ?? "Arial",
    size: opciones.size ?? 11,
    bold: opciones.bold ?? false,
  };
}

function cuentaYEntidad(colegio: ColegioRespuesta): string {
  const cuenta = colegio.numeroCuentaBancaria.trim();
  const entidad = colegio.entidadDeposito.trim();
  if (cuenta && entidad) return `${cuenta}  ${entidad}`;
  return cuenta || entidad || "Sin registrar";
}

function fechaCalendario(valor: string): Date {
  const iso = fechaPeriodoIso(valor);
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, (mes ?? 1) - 1, dia ?? 1);
}

function fechaSaldoAnterior(libro: LibroDepartamentoRespuesta): Date {
  if (libro.fondo.solicitadoEn) {
    const instante = new Date(libro.fondo.solicitadoEn);
    return new Date(
      instante.getFullYear(),
      instante.getMonth(),
      instante.getDate(),
    );
  }
  return fechaCalendario(libro.periodo.fechaInicio);
}

export function nombreArchivoInformeExcel(
  libro: LibroDepartamentoRespuesta,
): string {
  const base = `Informe-Economico-UDP ${libro.fondo.departamento.nombreUnidad} ${libro.periodo.nombre}`
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return `${base}.xlsx`;
}

function centrarTitulo(hoja: Worksheet, fila: number, texto: string, size: number) {
  hoja.mergeCells(`A${fila}:G${fila}`);
  const celda = hoja.getCell(`A${fila}`);
  celda.value = texto;
  celda.font = fuente({ size, bold: true });
  celda.alignment = { horizontal: "center", vertical: "middle" };
}

function filaDato(
  hoja: Worksheet,
  fila: number,
  etiqueta: string,
  valor: string,
) {
  hoja.mergeCells(`A${fila}:C${fila}`);
  hoja.mergeCells(`D${fila}:G${fila}`);
  const etiquetaCelda = hoja.getCell(`A${fila}`);
  etiquetaCelda.value = etiqueta;
  etiquetaCelda.font = fuente({ bold: true });
  etiquetaCelda.alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };
  const valorCelda = hoja.getCell(`D${fila}`);
  valorCelda.value = valor;
  valorCelda.font = fuente();
  valorCelda.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  for (let col = 1; col <= 7; col += 1) {
    hoja.getCell(fila, col).border = BORDE_FINO;
  }
}

function aplicarBordesTabla(hoja: Worksheet, desde: number, hasta: number) {
  for (let fila = desde; fila <= hasta; fila += 1) {
    for (let col = 1; col <= 7; col += 1) {
      hoja.getCell(fila, col).border = BORDE_FINO;
    }
  }
}

function construirInforme(
  workbook: Workbook,
  colegio: ColegioRespuesta,
  libro: LibroDepartamentoRespuesta,
) {
  const hoja = workbook.addWorksheet("Informe", {
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2,
      },
    },
  });

  hoja.columns = [
    { width: 13 },
    { width: 14 },
    { width: 18 },
    { width: 36 },
    { width: 14 },
    { width: 14 },
    { width: 16 },
  ];

  centrarTitulo(hoja, 4, "MINISTERIO DE EDUCACIÓN PÚBLICA", 12);
  centrarTitulo(hoja, 5, "DEPARTAMENTO DE ESPECIALIDADES TÉCNICAS", 12);
  centrarTitulo(
    hoja,
    6,
    "UNIDAD DE FINANCIAMIENTO Y COORDINACIÓN TÉCNICA",
    12,
  );
  centrarTitulo(hoja, 8, "Informe Económico-UDP", 14);

  filaDato(hoja, 10, "Nombre Centro Educativo", colegio.nombre);
  filaDato(hoja, 11, "Nombre de la Unidad", libro.fondo.departamento.nombreUnidad);
  filaDato(hoja, 12, "Periodo del Informe", libro.periodo.nombre);
  filaDato(hoja, 13, "Tipo de Actividad", libro.fondo.departamento.tipoActividad);
  filaDato(
    hoja,
    14,
    "N° Cuenta Bancaria y Entidad en que se depositaron los fondos",
    cuentaYEntidad(colegio),
  );
  for (const fila of [10, 11, 12, 13]) {
    hoja.getRow(fila).height = 20;
  }
  hoja.getRow(14).height = 32;

  const filaFondo = 16;

  hoja.mergeCells(`A${filaFondo}:F${filaFondo}`);
  const fechaFondo = hoja.getCell(`A${filaFondo}`);
  fechaFondo.value = fechaSaldoAnterior(libro);
  fechaFondo.numFmt = FECHA;
  fechaFondo.font = fuente({ bold: true });
  fechaFondo.alignment = { horizontal: "right", vertical: "middle" };
  fechaFondo.fill = relleno(AMARILLO);

  for (const col of ["B", "C", "D", "E", "F"]) {
    hoja.getCell(`${col}${filaFondo}`).fill = relleno(AMARILLO);
  }

  const montoFondo = hoja.getCell(`G${filaFondo}`);
  montoFondo.value = libro.fondoInicial;
  montoFondo.numFmt = COLONES;
  montoFondo.font = fuente({ bold: true });
  montoFondo.alignment = { horizontal: "right", vertical: "middle" };
  montoFondo.fill = relleno(AMARILLO);

  const encabezados = [
    "Asiento",
    "Fecha",
    "No Factura / N° Depósito",
    "Descripción",
    "Ingresos",
    "Egresos",
    "Saldo",
  ];
  const filaEncabezados = filaFondo + 1;
  encabezados.forEach((texto, indice) => {
    const celda = hoja.getCell(filaEncabezados, indice + 1);
    celda.value = texto;
    celda.font = fuente({ bold: true, size: indice === 0 ? 9 : 11 });
    celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    celda.fill = relleno(AZUL);
  });
  hoja.getRow(filaEncabezados).height = 32;

  const primeraAsiento = filaEncabezados + 1;
  const asientos = libro.asientos;
  asientos.forEach((asiento, indice) => {
    const fila = primeraAsiento + indice;
    const filaAnterior = indice === 0 ? filaFondo : fila - 1;

    const asientoCelda = hoja.getCell(fila, 1);
    asientoCelda.value = asiento.numero;
    asientoCelda.font = fuente({ bold: true });
    asientoCelda.alignment = { horizontal: "center", vertical: "middle" };
    asientoCelda.fill = relleno(AZUL);

    const fechaCelda = hoja.getCell(fila, 2);
    fechaCelda.value = fechaCalendario(asiento.fecha);
    fechaCelda.numFmt = FECHA;
    fechaCelda.font = fuente();
    fechaCelda.alignment = { horizontal: "center", vertical: "middle" };

    const facturaCelda = hoja.getCell(fila, 3);
    facturaCelda.value = asiento.numeroFactura;
    facturaCelda.font = fuente();
    facturaCelda.alignment = { horizontal: "center", vertical: "middle" };

    const descripcionCelda = hoja.getCell(fila, 4);
    descripcionCelda.value = asiento.descripcion;
    descripcionCelda.font = fuente();
    descripcionCelda.alignment = { vertical: "middle", wrapText: true };

    const ingresoCelda = hoja.getCell(fila, 5);
    ingresoCelda.value = asiento.ingresos;
    ingresoCelda.numFmt = COLONES;
    ingresoCelda.font = fuente();
    ingresoCelda.alignment = { horizontal: "right", vertical: "middle" };

    const egresoCelda = hoja.getCell(fila, 6);
    egresoCelda.value = asiento.egresos;
    egresoCelda.numFmt = COLONES;
    egresoCelda.font = fuente();
    egresoCelda.alignment = { horizontal: "right", vertical: "middle" };

    const saldoCelda = hoja.getCell(fila, 7);
    saldoCelda.value = {
      formula: `G${filaAnterior}+E${fila}-F${fila}`,
    };
    saldoCelda.numFmt = COLONES;
    saldoCelda.font = fuente();
    saldoCelda.alignment = { horizontal: "right", vertical: "middle" };
    saldoCelda.fill = relleno(AZUL);

    hoja.getRow(fila).height = 22;
  });

  const filaTotales = asientos.length === 0 ? primeraAsiento : primeraAsiento + asientos.length;
  const ultimaAsiento = asientos.length === 0 ? primeraAsiento - 1 : filaTotales - 1;

  hoja.mergeCells(`A${filaTotales}:D${filaTotales}`);
  const totalesEtiqueta = hoja.getCell(`A${filaTotales}`);
  totalesEtiqueta.value = `Totales al ${formatearFechaLarga(libro.periodo.fechaFin)}`;
  totalesEtiqueta.font = fuente({ bold: true });
  totalesEtiqueta.alignment = { horizontal: "center", vertical: "middle" };
  totalesEtiqueta.fill = relleno(AZUL);

  for (const col of [2, 3, 4]) {
    hoja.getCell(filaTotales, col).fill = relleno(AZUL);
  }

  const totalIngresos = hoja.getCell(filaTotales, 5);
  totalIngresos.value =
    asientos.length === 0
      ? 0
      : { formula: `SUM(E${primeraAsiento}:E${ultimaAsiento})` };
  totalIngresos.numFmt = COLONES;
  totalIngresos.font = fuente({ bold: true });
  totalIngresos.alignment = { horizontal: "right", vertical: "middle" };
  totalIngresos.fill = relleno(AZUL);

  const totalEgresos = hoja.getCell(filaTotales, 6);
  totalEgresos.value =
    asientos.length === 0
      ? 0
      : { formula: `SUM(F${primeraAsiento}:F${ultimaAsiento})` };
  totalEgresos.numFmt = COLONES;
  totalEgresos.font = fuente({ bold: true });
  totalEgresos.alignment = { horizontal: "right", vertical: "middle" };
  totalEgresos.fill = relleno(AZUL);

  const totalSaldo = hoja.getCell(filaTotales, 7);
  totalSaldo.value = {
    formula: `G${filaFondo}+E${filaTotales}-F${filaTotales}`,
  };
  totalSaldo.numFmt = COLONES;
  totalSaldo.font = fuente({ bold: true });
  totalSaldo.alignment = { horizontal: "right", vertical: "middle" };
  totalSaldo.fill = relleno(AZUL);

  aplicarBordesTabla(hoja, filaFondo, filaTotales);

  const filaObs = filaTotales + 2;
  hoja.mergeCells(`A${filaObs}:B${filaObs + 2}`);
  const obs = hoja.getCell(`A${filaObs}`);
  obs.value = "Observaciones:";
  obs.font = fuente({ bold: true });
  obs.alignment = { horizontal: "center", vertical: "middle" };

  for (let i = 0; i < 3; i += 1) {
    const fila = filaObs + i;
    hoja.mergeCells(`C${fila}:G${fila}`);
    const linea = hoja.getCell(`C${fila}`);
    linea.value = `${i + 1}.`;
    linea.font = fuente();
    linea.alignment = { horizontal: "left", vertical: "middle" };
    linea.border = {
      bottom: { style: "thin", color: { argb: "FF000000" } },
    };
  }

  const filaFirmas = filaObs + 4;

  hoja.mergeCells(`A${filaFirmas}:C${filaFirmas}`);
  hoja.mergeCells(`A${filaFirmas + 1}:C${filaFirmas + 1}`);
  hoja.mergeCells(`A${filaFirmas + 2}:C${filaFirmas + 2}`);
  hoja.getCell(`A${filaFirmas}`).value = "Nombre y apellidos:";
  hoja.getCell(`A${filaFirmas}`).font = fuente({ size: 9 });
  hoja.getCell(`A${filaFirmas + 1}`).value = "Director (a)";
  hoja.getCell(`A${filaFirmas + 1}`).font = fuente({ size: 9 });
  hoja.getCell(`A${filaFirmas + 2}`).value = "Firma:";
  hoja.getCell(`A${filaFirmas + 2}`).font = fuente({ size: 9 });

  hoja.getCell(`D${filaFirmas}`).value = "Nombre y apellidos:";
  hoja.getCell(`D${filaFirmas}`).font = fuente({ size: 9 });
  hoja.getCell(`D${filaFirmas}`).alignment = { wrapText: true, vertical: "middle" };
  hoja.getCell(`D${filaFirmas + 1}`).value = "Presidente Junta Administrativa";
  hoja.getCell(`D${filaFirmas + 1}`).font = fuente({ size: 9 });
  hoja.getCell(`D${filaFirmas + 1}`).alignment = { wrapText: true, vertical: "middle" };
  hoja.getCell(`D${filaFirmas + 2}`).value = "Firma:";
  hoja.getCell(`D${filaFirmas + 2}`).font = fuente({ size: 9 });

  hoja.mergeCells(`E${filaFirmas}:G${filaFirmas}`);
  hoja.mergeCells(`E${filaFirmas + 1}:G${filaFirmas + 1}`);
  hoja.mergeCells(`E${filaFirmas + 2}:G${filaFirmas + 2}`);
  hoja.getCell(`E${filaFirmas}`).value = "Nombre y apellidos:";
  hoja.getCell(`E${filaFirmas}`).font = fuente({ size: 9 });
  hoja.getCell(`E${filaFirmas + 1}`).value = "Tesorera - Contadora";
  hoja.getCell(`E${filaFirmas + 1}`).font = fuente({ size: 9 });
  hoja.getCell(`E${filaFirmas + 2}`).value = "Firma:";
  hoja.getCell(`E${filaFirmas + 2}`).font = fuente({ size: 9 });

  const filaCoord = filaFirmas + 4;
  hoja.mergeCells(`A${filaCoord}:G${filaCoord}`);
  const coord = hoja.getCell(`A${filaCoord}`);
  coord.value = "Elaborado por Coordinador Técnico:";
  coord.font = fuente({ size: 9, bold: true });
  coord.alignment = { horizontal: "center", vertical: "middle" };
}

function dispararDescarga(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

export async function descargarInformeEconomicoExcel(
  colegio: ColegioRespuesta,
  libro: LibroDepartamentoRespuesta,
): Promise<void> {
  const exceljs = await import("exceljs");
  const modulo = exceljs as unknown as {
    Workbook?: new () => Workbook;
    default?: { Workbook?: new () => Workbook };
  };
  const WorkbookCtor = modulo.Workbook ?? modulo.default?.Workbook;
  if (!WorkbookCtor) {
    throw new Error("No se pudo cargar el generador de Excel.");
  }
  const workbook = new WorkbookCtor();
  workbook.creator = "Gestión CTP 27";
  workbook.created = new Date();
  construirInforme(workbook, colegio, libro);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], { type: MIME_XLSX });
  dispararDescarga(blob, nombreArchivoInformeExcel(libro));
}
