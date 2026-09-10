import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { DesparasitacionNueva } from "@/features/pecuaria/components/desparasitacion-nueva";

export const metadata: Metadata = {
  title: "Registrar desparasitación | GestiónCTP27",
};

export default function NuevaDesparasitacionPage() {
  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="COMPLETO"
    >
      <DesparasitacionNueva />
    </RequerirPermiso>
  );
}
