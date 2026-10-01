"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  descargarReporte,
  type FiltrosExportacion,
  type FormatoExportacion,
  type TipoReporteExportable,
} from "../servicios/exportacion-reportes.service";

type BotonesExportacionReporteProps = {
  reporte: TipoReporteExportable;
  filtros: FiltrosExportacion;
  disabled?: boolean;
};

export function BotonesExportacionReporte({
  reporte,
  filtros,
  disabled = false,
}: BotonesExportacionReporteProps) {
  const [
    exportando,
    setExportando,
  ] =
    useState<FormatoExportacion | null>(
      null,
    );

  async function exportar(
    formato: FormatoExportacion,
  ) {
    try {
      setExportando(formato);

      await descargarReporte(
        reporte,
        formato,
        filtros,
      );

      toast.success(
        formato === "pdf"
          ? "Reporte PDF descargado correctamente."
          : "Reporte Excel descargado correctamente.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo exportar el reporte.",
      );
    } finally {
      setExportando(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={
          disabled ||
          exportando !== null
        }
        onClick={() =>
          void exportar("pdf")
        }
      >
        <Download data-icon="inline-start" />

        {exportando === "pdf"
          ? "Exportando PDF…"
          : "Exportar PDF"}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={
          disabled ||
          exportando !== null
        }
        onClick={() =>
          void exportar("excel")
        }
      >
        <FileSpreadsheet data-icon="inline-start" />

        {exportando === "excel"
          ? "Exportando Excel…"
          : "Exportar Excel"}
      </Button>
    </div>
  );
}