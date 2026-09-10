import type {
  Borders,
  Cell,
  Fill,
  Font,
  Workbook,
  Worksheet,
} from "exceljs";
import { fechaPeriodoIso } from "@/features/libro-caja/formato";
import {
  CATEGORIAS_BOVINAS,
  edadEnAnios,
  type AnimalRespuesta,
} from "@/features/pecuaria/animal/models/animal.model";

import {
  FILAS_MINIMAS_INVENTARIO,
  cantidadPorCategoria,
  observacionInventario,
  type PieInventarioMep,
  type TipoInventarioPecuaria,
} from "../models/inventario.model";

const AZUL = "FFDEEAF6";
const AMARILLO = "FFFFFF99";
const MIME_XLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const FECHA_PLANTILLA = "dd/mm/yyyy";

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

function fuente(
  opciones: {
    size?: number;
    bold?: boolean;
    name?: string;
  } = {},
): Partial<Font> {
  return {
    name: opciones.name ?? "Arial",
    family: 2,
    size: opciones.size ?? 11,
    bold: opciones.bold ?? false,
    color: { theme: 1 },
  };
}

function textoConNombre(etiqueta: string, nombre: string): string {
  const limpio = nombre.trim();
  return limpio ? `${etiqueta} ${limpio}` : etiqueta;
}

function fechaCalendario(valor: string): Date {
  const iso = fechaPeriodoIso(valor);
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, (mes ?? 1) - 1, dia ?? 1);
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

function aplicarMarcoExterno(
  hoja: Worksheet,
  ultimaFila: number,
  ultimaCol: number,
) {
  for (let fila = 1; fila <= ultimaFila; fila += 1) {
    const izquierda = hoja.getCell(fila, 1);
    const derecha = hoja.getCell(fila, ultimaCol);
    izquierda.border = { ...izquierda.border, left: MEDIO };
    derecha.border = { ...derecha.border, right: MEDIO };
  }
  for (let col = 1; col <= ultimaCol; col += 1) {
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

function insertarLogoMep(
  workbook: Workbook,
  hoja: Worksheet,
  logoBase64: string,
) {
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

function centrarTitulo(
  hoja: Worksheet,
  fila: number,
  ultimaCol: number,
  texto: string,
  size: number,
) {
  hoja.mergeCells(fila, 1, fila, ultimaCol);
  const celda = hoja.getCell(fila, 1);
  celda.value = texto;
  celda.font = fuente({ size, bold: true });
  celda.alignment = { horizontal: "center", vertical: "middle" };
  hoja.getRow(fila).height = size === 14 ? 18 : 15.75;
}

function filaDato(
  hoja: Worksheet,
  fila: number,
  ultimaCol: number,
  etiqueta: string,
  valor: string | Date,
  formatoFecha = false,
) {
  const colMitad = Math.ceil(ultimaCol / 2);
  hoja.mergeCells(fila, 1, fila, colMitad);
  hoja.mergeCells(fila, colMitad + 1, fila, ultimaCol);
  const etiquetaCelda = hoja.getCell(fila, 1);
  etiquetaCelda.value = etiqueta;
  etiquetaCelda.font = fuente({ bold: true });
  etiquetaCelda.alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };
  const valorCelda = hoja.getCell(fila, colMitad + 1);
  valorCelda.value = valor;
  if (formatoFecha) valorCelda.numFmt = FECHA_PLANTILLA;
  valorCelda.font = fuente();
  valorCelda.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  pintarRango(hoja, fila, 1, ultimaCol, (celda) => {
    celda.border = BORDE_FINO;
  });
}

function pintarEncabezadoTabla(
  hoja: Worksheet,
  fila: number,
  textos: string[],
) {
  textos.forEach((texto, indice) => {
    const celda = hoja.getCell(fila, indice + 1);
    celda.value = texto;
    celda.font = fuente({ bold: true, size: 10 });
    celda.fill = relleno(AZUL);
    celda.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    celda.border = BORDE_FINO;
  });
  hoja.getRow(fila).height = 28;
}

function pintarCeldaDato(
  hoja: Worksheet,
  fila: number,
  col: number,
  valor: string | number | Date | null,
  alineacion: "center" | "left" = "center",
) {
  const celda = hoja.getCell(fila, col);
  if (valor !== null && valor !== "") celda.value = valor;
  celda.font = fuente({ size: 10 });
  celda.alignment = {
    horizontal: alineacion,
    vertical: "middle",
    wrapText: true,
  };
  celda.border = BORDE_FINO;
}

function pintarPie(
  hoja: Worksheet,
  filaInicio: number,
  ultimaCol: number,
  pie: PieInventarioMep,
): number {
  const colMitad = Math.ceil(ultimaCol / 2);
  const filas = [
    {
      izquierda: textoConNombre("Nombre y apellidos:", pie.director),
      derecha: textoConNombre("Nombre y apellidos:", pie.presidente),
    },
    {
      izquierda: "Director (a)",
      derecha: "Presidente Junta Administrativa",
    },
    {
      izquierda: textoConNombre("Firma:", pie.firmaDirector),
      derecha: textoConNombre("Firma:", pie.firmaPresidente),
    },
  ];

  filas.forEach((filaPie, indice) => {
    const fila = filaInicio + indice;
    hoja.mergeCells(fila, 1, fila, colMitad);
    hoja.mergeCells(fila, colMitad + 1, fila, ultimaCol);
    const izquierda = hoja.getCell(fila, 1);
    const derecha = hoja.getCell(fila, colMitad + 1);
    izquierda.value = filaPie.izquierda;
    derecha.value = filaPie.derecha;
    for (const celda of [izquierda, derecha]) {
      celda.font = fuente({ size: 9 });
      celda.alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };
    }
    pintarRango(hoja, fila, 1, ultimaCol, (celda) => {
      celda.border = BORDE_FINO;
    });
    hoja.getRow(fila).height = 18;
  });

  const filaCoord = filaInicio + 3;
  hoja.mergeCells(filaCoord, 1, filaCoord, ultimaCol);
  const coord = hoja.getCell(filaCoord, 1);
  coord.value = textoConNombre(
    "Elaborado por Coordinador Técnico:",
    pie.coordinador,
  );
  coord.font = fuente({ size: 9, bold: true });
  coord.alignment = { horizontal: "center", vertical: "middle" };
  pintarRango(hoja, filaCoord, 1, ultimaCol, (celda) => {
    celda.border = BORDE_FINO;
  });

  return filaCoord;
}

function crearHoja(
  workbook: Workbook,
  nombre: string,
  anchos: number[],
  orientacion: "portrait" | "landscape",
): Worksheet {
  const hoja = workbook.addWorksheet(nombre, {
    views: [{ showGridLines: true, zoomScale: 90 }],
    pageSetup: {
      orientation: orientacion,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.5,
        bottom: 0.5,
        header: 0.3,
        footer: 0.3,
      },
    },
  });
  hoja.properties.defaultRowHeight = 15;
  hoja.columns = anchos.map((width) => ({ width }));
  return hoja;
}

function pintarMembrete(
  workbook: Workbook,
  hoja: Worksheet,
  ultimaCol: number,
  logoBase64: string,
  titulo: string,
  pie: PieInventarioMep,
) {
  insertarLogoMep(workbook, hoja, logoBase64);
  hoja.getRow(1).height = 54;
  centrarTitulo(hoja, 2, ultimaCol, "MINISTERIO DE EDUCACIÓN PÚBLICA", 12);
  centrarTitulo(
    hoja,
    3,
    ultimaCol,
    "DEPARTAMENTO DE  ESPECIALIDADES TÉCNICAS",
    12,
  );
  centrarTitulo(
    hoja,
    4,
    ultimaCol,
    "UNIDAD DE FINANCIAMIENTO Y COORDINACIÓN TÉCNICA",
    12,
  );
  centrarTitulo(hoja, 6, ultimaCol, titulo, 14);
  filaDato(hoja, 8, ultimaCol, "Centro Educativo", pie.centroEducativo);
  filaDato(hoja, 9, ultimaCol, "Fecha", fechaCalendario(pie.fecha), true);
  filaDato(hoja, 10, ultimaCol, "Nombre de la Unidad", pie.nombreUnidad);
}

function dispararDescarga(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

async function crearWorkbook(): Promise<Workbook> {
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
  return workbook;
}

function construirEspeciesMenores(
  workbook: Workbook,
  animales: AnimalRespuesta[],
  pie: PieInventarioMep,
  logoBase64: string,
) {
  const ultimaCol = 5;
  const hoja = crearHoja(
    workbook,
    "Inventario",
    [12, 32, 14, 22, 36],
    "portrait",
  );
  pintarMembrete(
    workbook,
    hoja,
    ultimaCol,
    logoBase64,
    "Inventario Especies Menores",
    pie,
  );

  const filaEncabezado = 12;
  pintarEncabezadoTabla(hoja, filaEncabezado, [
    "Asiento",
    "Identificación del Animal",
    "Edad (años)",
    "Raza",
    "Observaciones",
  ]);

  const filasVacias = Math.max(
    0,
    FILAS_MINIMAS_INVENTARIO - animales.length,
  );
  const totalFilas = animales.length + filasVacias;

  for (let indice = 0; indice < totalFilas; indice += 1) {
    const fila = filaEncabezado + 1 + indice;
    const animal = animales[indice];
    pintarCeldaDato(hoja, fila, 1, indice + 1);
    if (animal) {
      pintarCeldaDato(hoja, fila, 2, animal.nombre);
      const edad = edadEnAnios(animal.fechaNacimiento);
      pintarCeldaDato(hoja, fila, 3, edad);
      hoja.getCell(fila, 3).numFmt = "0.0";
      pintarCeldaDato(hoja, fila, 4, animal.raza);
      pintarCeldaDato(hoja, fila, 5, observacionInventario(animal), "left");
    } else {
      pintarCeldaDato(hoja, fila, 2, null);
      pintarCeldaDato(hoja, fila, 3, null);
      pintarCeldaDato(hoja, fila, 4, null);
      pintarCeldaDato(hoja, fila, 5, null);
    }
  }

  const ultimaFila = pintarPie(
    hoja,
    filaEncabezado + 1 + totalFilas + 1,
    ultimaCol,
    pie,
  );
  aplicarMarcoExterno(hoja, ultimaFila, ultimaCol);
}

function construirGanadoBovino(
  workbook: Workbook,
  animales: AnimalRespuesta[],
  pie: PieInventarioMep,
  logoBase64: string,
) {
  const ultimaCol = 9;
  const hoja = crearHoja(
    workbook,
    "Inventario",
    [10, 22, 10, 12, 10, 12, 10, 18, 28],
    "landscape",
  );
  pintarMembrete(
    workbook,
    hoja,
    ultimaCol,
    logoBase64,
    "Inventario Ganado Bovino-UDP",
    pie,
  );

  const filaGrupo = 12;
  const filaSub = 13;
  hoja.mergeCells(filaGrupo, 1, filaSub, 1);
  hoja.mergeCells(filaGrupo, 2, filaSub, 2);
  hoja.mergeCells(filaGrupo, 3, filaGrupo, 7);
  hoja.mergeCells(filaGrupo, 8, filaSub, 8);
  hoja.mergeCells(filaGrupo, 9, filaSub, 9);

  const encabezadosGrupo = [
    "Asiento",
    "N° de identificación",
    "Cantidad de animales",
    "",
    "",
    "",
    "",
    "Raza",
    "Observaciones",
  ];
  encabezadosGrupo.forEach((texto, indice) => {
    const celda = hoja.getCell(filaGrupo, indice + 1);
    if (texto) celda.value = texto;
    celda.font = fuente({ bold: true, size: 10 });
    celda.fill = relleno(AZUL);
    celda.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    celda.border = BORDE_FINO;
  });
  pintarRango(hoja, filaGrupo, 3, 7, (celda) => {
    celda.fill = relleno(AZUL);
    celda.border = BORDE_FINO;
  });

  const subtitulos = ["Toro", "Novilla", "Vaca", "Ternero/a", "Torete"];
  subtitulos.forEach((texto, indice) => {
    const celda = hoja.getCell(filaSub, 3 + indice);
    celda.value = texto;
    celda.font = fuente({ bold: true, size: 9 });
    celda.fill = relleno(AZUL);
    celda.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    celda.border = BORDE_FINO;
  });
  pintarRango(hoja, filaSub, 1, ultimaCol, (celda) => {
    celda.fill = relleno(AZUL);
    celda.border = BORDE_FINO;
  });
  hoja.getRow(filaGrupo).height = 18;
  hoja.getRow(filaSub).height = 22;

  const filasVacias = Math.max(
    0,
    FILAS_MINIMAS_INVENTARIO - animales.length,
  );
  const totalFilas = animales.length + filasVacias;
  const totales = {
    TORO: 0,
    NOVILLA: 0,
    VACA: 0,
    TERNERO: 0,
    TORETE: 0,
  };

  for (let indice = 0; indice < totalFilas; indice += 1) {
    const fila = filaSub + 1 + indice;
    const animal = animales[indice];
    pintarCeldaDato(hoja, fila, 1, indice + 1);
    if (animal) {
      pintarCeldaDato(hoja, fila, 2, animal.nombre);
      CATEGORIAS_BOVINAS.forEach((categoria, colIndice) => {
        const cantidad = cantidadPorCategoria(animal, categoria);
        totales[categoria] += cantidad;
        pintarCeldaDato(hoja, fila, 3 + colIndice, cantidad > 0 ? cantidad : null);
      });
      pintarCeldaDato(hoja, fila, 8, animal.raza);
      pintarCeldaDato(hoja, fila, 9, observacionInventario(animal), "left");
    } else {
      for (let col = 2; col <= ultimaCol; col += 1) {
        pintarCeldaDato(hoja, fila, col, null);
      }
    }
  }

  const filaTotales = filaSub + 1 + totalFilas;
  hoja.mergeCells(filaTotales, 1, filaTotales, 2);
  const etiquetaTotales = hoja.getCell(filaTotales, 1);
  etiquetaTotales.value = "TOTALES";
  etiquetaTotales.font = fuente({ bold: true, size: 10 });
  etiquetaTotales.alignment = { horizontal: "center", vertical: "middle" };
  pintarRango(hoja, filaTotales, 1, ultimaCol, (celda) => {
    celda.fill = relleno(AMARILLO);
    celda.border = BORDE_FINO;
    celda.font = fuente({ bold: true, size: 10 });
  });
  CATEGORIAS_BOVINAS.forEach((categoria, colIndice) => {
    const celda = hoja.getCell(filaTotales, 3 + colIndice);
    if (totales[categoria] > 0) celda.value = totales[categoria];
    celda.alignment = { horizontal: "center", vertical: "middle" };
  });

  const filaGeneral = filaTotales + 1;
  hoja.mergeCells(filaGeneral, 1, filaGeneral, 2);
  hoja.mergeCells(filaGeneral, 3, filaGeneral, ultimaCol);
  const etiquetaGeneral = hoja.getCell(filaGeneral, 1);
  etiquetaGeneral.value = "Total General";
  etiquetaGeneral.font = fuente({ bold: true, size: 10 });
  etiquetaGeneral.alignment = { horizontal: "center", vertical: "middle" };
  const valorGeneral = hoja.getCell(filaGeneral, 3);
  valorGeneral.value =
    totales.TORO +
    totales.NOVILLA +
    totales.VACA +
    totales.TERNERO +
    totales.TORETE;
  valorGeneral.font = fuente({ bold: true, size: 10 });
  valorGeneral.alignment = { horizontal: "center", vertical: "middle" };
  pintarRango(hoja, filaGeneral, 1, ultimaCol, (celda) => {
    celda.border = BORDE_FINO;
  });

  const ultimaFila = pintarPie(hoja, filaGeneral + 2, ultimaCol, pie);
  aplicarMarcoExterno(hoja, ultimaFila, ultimaCol);
}

export function nombreArchivoInventario(
  tipo: TipoInventarioPecuaria,
  fecha: string,
): string {
  const base =
    tipo === "ganado-bovino"
      ? "Inventario-Ganado-Bovino-UDP"
      : "Inventario-Especies-Menores";
  const fechaIso = fechaPeriodoIso(fecha);
  return `${base} ${fechaIso}.xlsx`.replace(/[\\/:*?"<>|]+/g, "-");
}

export async function descargarInventarioExcel(
  tipo: TipoInventarioPecuaria,
  animales: AnimalRespuesta[],
  pie: PieInventarioMep,
): Promise<void> {
  const workbook = await crearWorkbook();
  const logoBase64 = await cargarLogoMep();
  if (tipo === "ganado-bovino") {
    construirGanadoBovino(workbook, animales, pie, logoBase64);
  } else {
    construirEspeciesMenores(workbook, animales, pie, logoBase64);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], { type: MIME_XLSX });
  dispararDescarga(blob, nombreArchivoInventario(tipo, pie.fecha));
}
