import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ReporteProduccionPecuaria } from "@/features/reportes/components/reporte-produccion-pecuaria";

export const metadata: Metadata = {
  title: "Reporte de producción pecuaria | GestiónCTP27",
};

export default function ReporteProduccionPecuariaPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="LECTURA">
      <ReporteProduccionPecuaria />
    </RequerirPermiso>
  );
}
