import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { SiembraNueva } from "@/features/agricola/siembra/components/siembra-nueva";

export const metadata: Metadata = { title: "Registrar siembra | GestiónCTP27" };

export default function NuevaSiembraPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <SiembraNueva />
    </RequerirPermiso>
  );
}
