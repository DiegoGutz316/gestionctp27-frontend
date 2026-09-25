import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ReporteProduccionAgricola } from "@/features/reportes/components/reporte-produccion-agricola";

export const metadata: Metadata = {
  title: "Reporte de producción agrícola | GestiónCTP27",
};

export default function ReporteProduccionAgricolaPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="LECTURA">
      <ReporteProduccionAgricola />
    </RequerirPermiso>
  );
}
