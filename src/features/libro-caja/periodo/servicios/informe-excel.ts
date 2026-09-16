import type {
  Borders,
  Cell,
  Fill,
  Font,
  Workbook,
  Worksheet,
} from "exceljs";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";
import {
  fechaPeriodoIso,
  formatearFechaTotalesInforme,
} from "@/features/libro-caja/formato";
import type { PieInformeUdp } from "../components/informe-economico-udp";
import type { LibroDepartamentoRespuesta } from "../validacion/asiento.validacion";

function textoConNombre(etiqueta: string, nombre: string): string {
  const limpio = nombre.trim();
  return limpio ? `${etiqueta} ${limpio}` : etiqueta;
}

const AZUL = "FFDEEAF6";
const AMARILLO = "FFFFFF99";
const COLONES = '"₡"#,##0.00';
const FECHA_PLANTILLA = "dd/mm/yyyy";
const MIME_XLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const FINO = { style: "thin" as const, color: { argb: "FF000000" } };
const MEDIO = { style: "medium" as const, color: { argb: "FF000000" } };

const BORDE_FINO: Partial<Borders> = {
  top: FINO,
  left: FINO,
  bottom: FINO,
  right: FINO,
};

function relleno(argb: string): Fill {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb },
    bgColor: { argb },
  };
}

function fuente(opciones: {
  size?: number;
  bold?: boolean;
  name?: string;
  color?: string;
} = {}): Partial<Font> {
  return {
    name: opciones.name ?? "Arial",
    family: 2,
    size: opciones.size ?? 11,
    bold: opciones.bold ?? false,
    color: opciones.color ? { argb: opciones.color } : { theme: 1 },
  };
}

function cuentaYEntidad(colegio: ColegioRespuesta): string {
  const cuenta = colegio.numeroCuentaBancaria.trim();
  const entidad = colegio.entidadDeposito.trim();
  if (cuenta && entidad) return `${cuenta}  ${entidad}`;
  return cuenta || entidad || "";
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

function pintarRango(
  hoja: Worksheet,
  fila: number,
  colInicio: number,
  colFin: number,
  aplicar: (celda: Cell) => void,
) {
  for (let col = colInicio; col <= colFin; col += 1) {
    aplicar(hoja.getCell(fila, col));
  }
}

function centrarTitulo(hoja: Worksheet, fila: number, texto: string, size: number) {
  hoja.mergeCells(fila, 1, fila, 7);
  const celda = hoja.getCell(fila, 1);
  celda.value = texto;
  celda.font = fuente({ size, bold: true });
  celda.alignment = { horizontal: "center", vertical: "middle" };
  hoja.getRow(fila).height = size === 14 ? 18 : 15.75;
}

function filaDato(
  hoja: Worksheet,
  fila: number,
  etiqueta: string,
  valor: string,
  altura?: number,
) {
  hoja.mergeCells(fila, 1, fila, 3);
  hoja.mergeCells(fila, 4, fila, 7);
  const etiquetaCelda = hoja.getCell(fila, 1);
  etiquetaCelda.value = etiqueta;
  etiquetaCelda.font = fuente({ bold: true });
  etiquetaCelda.alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };
  const valorCelda = hoja.getCell(fila, 4);
  valorCelda.value = valor;
  valorCelda.font = fuente();
  valorCelda.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  pintarRango(hoja, fila, 1, 7, (celda) => {
    celda.border = BORDE_FINO;
  });
  if (altura) hoja.getRow(fila).height = altura;
}

function aplicarMarcoExterno(hoja: Worksheet, ultimaFila: number) {
  for (let fila = 1; fila <= ultimaFila; fila += 1) {
    const izquierda = hoja.getCell(fila, 1);
    const derecha = hoja.getCell(fila, 7);
    izquierda.border = { ...izquierda.border, left: MEDIO };
    derecha.border = { ...derecha.border, right: MEDIO };
  }
  for (let col = 1; col <= 7; col += 1) {
    const arriba = hoja.getCell(1, col);
    const abajo = hoja.getCell(ultimaFila, col);
    arriba.border = { ...arriba.border, top: MEDIO };
    abajo.border = { ...abajo.border, bottom: MEDIO };
  }
}

async function cargarLogoMep(): Promise<string> {
  const respuesta = await fetch("/logo-mep.jpg");
  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el logo del MEP.");
  }
  const bytes = new Uint8Array(await respuesta.arrayBuffer());
  let binario = "";
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario);
}

function insertarLogoMep(workbook: Workbook, hoja: Worksheet, logoBase64: string) {
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: "jpeg",
  });
  hoja.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 254, height: 69 },
    editAs: "oneCell",
  });
}

function construirInforme(
  workbook: Workbook,
  colegio: ColegioRespuesta,
  libro: LibroDepartamentoRespuesta,
  logoBase64: string,
  pie: PieInformeUdp,
) {
  const hoja = workbook.addWorksheet("Hoja1", {
    views: [{ showGridLines: true, zoomScale: 69 }],
    pageSetup: {
      // 9 = A4. Carta (1) no aparece en el tipo PaperSize que declara exceljs.
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    },
  });

  hoja.properties.defaultRowHeight = 15;
  hoja.columns = [
    { width: 8.43 },
    { width: 16 },
    { width: 12.43 },
    { width: 58.43 },
    { width: 17.29 },
    { width: 21.86 },
    { width: 29.43 },
  ];

  insertarLogoMep(workbook, hoja, logoBase64);

  centrarTitulo(hoja, 4, "MINISTERIO DE EDUCACIÓN PÚBLICA", 12);
  centrarTitulo(hoja, 5, "DEPARTAMENTO DE  ESPECIALIDADES TÉCNICAS", 12);
  centrarTitulo(
    hoja,
    6,
    "UNIDAD DE FINANCIAMIENTO Y COORDINACIÓN TÉCNICA",
    12,
  );
  centrarTitulo(hoja, 8, "Informe Económico-UDP", 14);

  hoja.mergeCells("A9:G9");
  hoja.getRow(9).height = 17.25;

  filaDato(hoja, 10, "Nombre Centro Educativo", colegio.nombre);
  filaDato(hoja, 11, "Nombre de la Unidad ", libro.fondo.departamento.nombreUnidad);
  filaDato(hoja, 12, "Periodo del Informe", libro.periodo.nombre);
  filaDato(hoja, 13, "Tipo de Actividad", libro.fondo.departamento.tipoActividad);
  filaDato(
    hoja,
    14,
    "N° Cuenta Bancaria y Entidad en que se depositaron los fondos ",
    cuentaYEntidad(colegio),
    37.15,
  );
  for (const fila of [10, 11, 12, 13, 14]) {
    hoja.getCell(fila, 1).border = { ...hoja.getCell(fila, 1).border, left: MEDIO };
    hoja.getCell(fila, 7).border = { ...hoja.getCell(fila, 7).border, right: MEDIO };
  }
  pintarRango(hoja, 10, 1, 7, (celda) => {
    celda.border = { ...celda.border, top: MEDIO };
  });
  pintarRango(hoja, 14, 1, 7, (celda) => {
    celda.border = { ...celda.border, bottom: MEDIO };
  });
  hoja.getRow(15).height = 15.75;

  const filaFondo = 16;
  hoja.mergeCells(`A${filaFondo}:F${filaFondo}`);
  const fechaFondo = hoja.getCell(`A${filaFondo}`);
  fechaFondo.value = fechaSaldoAnterior(libro);
  fechaFondo.numFmt = FECHA_PLANTILLA;
  fechaFondo.font = fuente({ bold: true });
  fechaFondo.alignment = {
    horizontal: "right",
    vertical: "middle",
    wrapText: true,
  };
  pintarRango(hoja, filaFondo, 1, 6, (celda) => {
    celda.fill = relleno(AMARILLO);
    celda.border = { top: MEDIO, bottom: MEDIO, left: FINO, right: FINO };
  });
  hoja.getCell(`A${filaFondo}`).border = {
    top: MEDIO,
    bottom: MEDIO,
    left: MEDIO,
    right: FINO,
  };

  const montoFondo = hoja.getCell(`G${filaFondo}`);
  montoFondo.value = libro.fondoInicial;
  montoFondo.numFmt = COLONES;
  montoFondo.font = fuente({ bold: true });
  montoFondo.alignment = {
    horizontal: "right",
    vertical: "middle",
    wrapText: true,
  };
  montoFondo.fill = relleno(AMARILLO);
  montoFondo.border = {
    top: MEDIO,
    bottom: MEDIO,
    left: MEDIO,
    right: MEDIO,
  };
  hoja.getRow(filaFondo).height = 15.75;

  const filaEncabezados = filaFondo + 1;
  const encabezadoFactura = hoja.getCell(filaEncabezados, 3);
  encabezadoFactura.value = {
    richText: [
      {
        font: { name: "Arial", size: 11, bold: true, color: { theme: 1 } },
        text: "N",
      },
      {
        font: {
          name: "Arial",
          size: 11,
          bold: true,
          vertAlign: "superscript",
          color: { theme: 1 },
        },
        text: "o",
      },
      {
        font: { name: "Arial", size: 11, bold: true, color: { theme: 1 } },
        text: " Factura/ N⁰ Depósito",
      },
    ],
  };

  const encabezados = [
    "Asiento",
    "Fecha",
    null,
    "Descripción",
    "Ingresos",
    "Egresos",
    "Saldo",
  ];
  encabezados.forEach((texto, indice) => {
    const celda = hoja.getCell(filaEncabezados, indice + 1);
    if (texto) celda.value = texto;
    celda.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    if (indice === 0) {
      celda.font = fuente({ color: "FF000000" });
      celda.border = BORDE_FINO;
    } else {
      celda.font = fuente({ bold: true });
      celda.fill = relleno(AZUL);
      celda.border = { right: MEDIO, top: MEDIO, bottom: MEDIO, left: FINO };
    }
  });
  hoja.getRow(filaEncabezados).height = 48;

  const primeraAsiento = filaEncabezados + 1;
  const asientos = libro.asientos;
  asientos.forEach((asiento, indice) => {
    const fila = primeraAsiento + indice;
    const filaAnterior = indice === 0 ? filaFondo : fila - 1;

    const asientoCelda = hoja.getCell(fila, 1);
    asientoCelda.value = asiento.numero;
    asientoCelda.font = fuente({ color: "FF000000" });
    asientoCelda.alignment = { horizontal: "center", vertical: "middle" };
    asientoCelda.border = BORDE_FINO;

    const fechaCelda = hoja.getCell(fila, 2);
    fechaCelda.value = fechaCalendario(asiento.fecha);
    fechaCelda.numFmt = FECHA_PLANTILLA;
    fechaCelda.font = fuente({ color: "FF000000" });
    fechaCelda.alignment = { horizontal: "center", vertical: "middle" };
    fechaCelda.border = BORDE_FINO;

    const facturaCelda = hoja.getCell(fila, 3);
    facturaCelda.value = asiento.numeroFactura;
    facturaCelda.numFmt = "@";
    facturaCelda.font = fuente({ color: "FF000000" });
    facturaCelda.alignment = { horizontal: "center", vertical: "middle" };
    facturaCelda.border = BORDE_FINO;

    const descripcionCelda = hoja.getCell(fila, 4);
    descripcionCelda.value = asiento.descripcion;
    descripcionCelda.font = fuente({ color: "FF000000" });
    descripcionCelda.alignment = { horizontal: "left", vertical: "middle" };
    descripcionCelda.border = BORDE_FINO;

    const ingresoCelda = hoja.getCell(fila, 5);
    if (asiento.ingresos > 0) ingresoCelda.value = asiento.ingresos;
    ingresoCelda.numFmt = COLONES;
    ingresoCelda.font = fuente({ color: "FF000000" });
    ingresoCelda.alignment = { vertical: "middle" };
    ingresoCelda.border = BORDE_FINO;

    const egresoCelda = hoja.getCell(fila, 6);
    if (asiento.egresos > 0) egresoCelda.value = asiento.egresos;
    egresoCelda.numFmt = COLONES;
    egresoCelda.font = fuente({ color: "FF000000" });
    egresoCelda.alignment = { vertical: "middle" };
    egresoCelda.border = BORDE_FINO;

    const saldoCelda = hoja.getCell(fila, 7);
    saldoCelda.value = { formula: `+G${filaAnterior}+E${fila}-F${fila}` };
    saldoCelda.numFmt = COLONES;
    saldoCelda.font = fuente();
    saldoCelda.alignment = { vertical: "middle" };
    saldoCelda.fill = relleno(AZUL);
    saldoCelda.border = {
      left: FINO,
      right: MEDIO,
      top: FINO,
      bottom: FINO,
    };
  });

  const filaTotales =
    asientos.length === 0 ? primeraAsiento : primeraAsiento + asientos.length;
  const ultimaAsiento =
    asientos.length === 0 ? primeraAsiento - 1 : filaTotales - 1;

  hoja.mergeCells(`A${filaTotales}:D${filaTotales}`);
  pintarRango(hoja, filaTotales, 1, 7, (celda) => {
    celda.fill = relleno(AZUL);
    celda.font = fuente({ bold: true });
    celda.border = BORDE_FINO;
  });
  const totalesEtiqueta = hoja.getCell(`A${filaTotales}`);
  totalesEtiqueta.value = `Totales al ${formatearFechaTotalesInforme(libro.periodo.fechaFin)}`;
  totalesEtiqueta.alignment = { horizontal: "center", vertical: "middle" };

  const totalIngresos = hoja.getCell(filaTotales, 5);
  totalIngresos.value =
    asientos.length === 0
      ? 0
      : { formula: `SUM(E${primeraAsiento}:E${ultimaAsiento})` };
  totalIngresos.numFmt = COLONES;
  totalIngresos.alignment = { vertical: "middle" };

  const totalEgresos = hoja.getCell(filaTotales, 6);
  totalEgresos.value =
    asientos.length === 0
      ? 0
      : { formula: `SUM(F${primeraAsiento}:F${ultimaAsiento})` };
  totalEgresos.numFmt = COLONES;
  totalEgresos.alignment = { vertical: "middle" };

  const totalSaldo = hoja.getCell(filaTotales, 7);
  totalSaldo.value = { formula: `+G${filaFondo}+E${filaTotales}-F${filaTotales}` };
  totalSaldo.numFmt = COLONES;
  totalSaldo.alignment = { vertical: "middle" };
  totalSaldo.border = {
    left: FINO,
    right: MEDIO,
    top: FINO,
    bottom: FINO,
  };
  hoja.getRow(filaTotales).height = 15.75;

  const filaObs = filaTotales + 1;
  hoja.mergeCells(`A${filaObs}:B${filaObs + 2}`);
  const obs = hoja.getCell(`A${filaObs}`);
  obs.value = "Observaciones:";
  obs.font = { name: "Calibri", size: 11, bold: true, color: { theme: 1 } };
  obs.alignment = { horizontal: "center", vertical: "middle" };

  for (let i = 0; i < 3; i += 1) {
    const fila = filaObs + i;
    hoja.mergeCells(fila, 3, fila, 7);
    const linea = hoja.getCell(fila, 3);
    linea.value = pie.observaciones[i] ?? "";
    linea.font = { name: "Calibri", size: 11, color: { theme: 1 } };
    linea.alignment = { horizontal: "left", vertical: "middle" };
    pintarRango(hoja, fila, 3, 7, (celda) => {
      celda.border = { ...celda.border, bottom: FINO };
    });
  }

  const filaFirmas = filaObs + 3;
  hoja.mergeCells(`A${filaFirmas}:C${filaFirmas}`);
  hoja.mergeCells(`E${filaFirmas}:G${filaFirmas}`);
  hoja.mergeCells(`A${filaFirmas + 1}:C${filaFirmas + 1}`);
  hoja.mergeCells(`E${filaFirmas + 1}:G${filaFirmas + 1}`);
  hoja.mergeCells(`A${filaFirmas + 2}:C${filaFirmas + 2}`);
  hoja.mergeCells(`E${filaFirmas + 2}:G${filaFirmas + 2}`);

  const firmas = [
    {
      fila: filaFirmas,
      a: textoConNombre("Nombre y apellidos:", pie.director),
      d: textoConNombre("Nombre y apellidos:", pie.presidente),
      e: textoConNombre("Nombre y apellidos:", pie.tesorera),
    },
    {
      fila: filaFirmas + 1,
      a: "Director (a)",
      d: "Presidente Junta Administrativa",
      e: "Tesorera -  Contadora",
    },
    {
      fila: filaFirmas + 2,
      a: textoConNombre("Firma:", pie.firmaDirector),
      d: textoConNombre("Firma:", pie.firmaPresidente),
      e: textoConNombre("Firma:", pie.firmaTesorera),
    },
  ];
  for (const firma of firmas) {
    const celdaA = hoja.getCell(firma.fila, 1);
    const celdaD = hoja.getCell(firma.fila, 4);
    const celdaE = hoja.getCell(firma.fila, 5);
    celdaA.value = firma.a;
    celdaD.value = firma.d;
    celdaE.value = firma.e;
    for (const celda of [celdaA, celdaD, celdaE]) {
      celda.font = fuente({ size: 9 });
      celda.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
    }
  }

  const filaCoord = filaFirmas + 3;
  hoja.mergeCells(`A${filaCoord}:G${filaCoord}`);
  const coord = hoja.getCell(`A${filaCoord}`);
  coord.value = textoConNombre(
    "Elaborado por Coordinador Técnico:",
    pie.coordinador,
  );
  coord.font = fuente({ size: 9, bold: true });
  coord.alignment = { horizontal: "center", vertical: "middle" };

  aplicarMarcoExterno(hoja, filaCoord);
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
  pie: PieInformeUdp,
): Promise<void> {
  const exceljs = await import("exceljs");
  const modulo = exceljs as unknown as {
    Workbook?: new () => Workbook;
    default?: { Workbook?: new () => Workbook };
  };
  const WorkbookCtor = modulo.Workbook ?? modulo.default?.Workbook;
  if (!WorkbookCtor) {
    throw new Error("No se pudo generar el archivo de Excel.");
  }
  const workbook = new WorkbookCtor();
  workbook.creator = "Gestión CTP 27";
  workbook.created = new Date();
  const logoBase64 = await cargarLogoMep();
  construirInforme(workbook, colegio, libro, logoBase64, pie);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], { type: MIME_XLSX });
  dispararDescarga(blob, nombreArchivoInformeExcel(libro));
}
