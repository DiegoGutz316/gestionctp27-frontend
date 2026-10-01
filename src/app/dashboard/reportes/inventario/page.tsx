import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ReporteInventario } from "@/features/reportes/components/reporte-inventario";

export const metadata: Metadata = {
  title: "Reporte de inventario | GestiónCTP27",
};

export default function ReporteInventarioPage() {
  return (
    <RequerirPermiso
      modulo="REPORTES"
      nivel="LECTURA"
    >
      <ReporteInventario />
    </RequerirPermiso>
  );
}