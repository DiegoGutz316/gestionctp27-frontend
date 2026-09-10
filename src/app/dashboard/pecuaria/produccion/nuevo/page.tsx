import type { Metadata } from "next";
import { Suspense } from "react";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ProduccionNueva } from "@/features/pecuaria/produccion/components/produccion-nueva";

export const metadata: Metadata = {
  title: "Registrar producción | GestiónCTP27",
};

export default function NuevaProduccionPage() {
  return (
    <RequerirPermiso modulo="PECUARIA" nivel="COMPLETO">
      <Suspense>
        <ProduccionNueva />
      </Suspense>
    </RequerirPermiso>
  );
}
