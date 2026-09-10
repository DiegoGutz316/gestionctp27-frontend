import type { Metadata } from "next";
import { Suspense } from "react";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ProduccionConsulta } from "@/features/pecuaria/produccion/components/produccion-consulta";

export const metadata: Metadata = {
  title: "Producción pecuaria | GestiónCTP27",
};

export default function ProduccionPecuariaPage() {
  return (
    <RequerirPermiso modulo="PECUARIA" nivel="LECTURA">
      <Suspense>
        <ProduccionConsulta />
      </Suspense>
    </RequerirPermiso>
  );
}
