import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CamaCultivoNueva } from "@/features/agricola/components/cama-cultivo-nueva";

export const metadata: Metadata = {
  title: "Registrar cama de cultivo | GestiónCTP27",
};

export default function NuevaCamaCultivoPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <CamaCultivoNueva />
    </RequerirPermiso>
  );
}
