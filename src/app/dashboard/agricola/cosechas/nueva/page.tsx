import type { Metadata } from "next";

import { CosechaNueva } from "@/features/agricola/cosecha/components/cosecha-nueva";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

export const metadata: Metadata = {
  title: "Registrar cosecha | GestiónCTP27",
};

export default function NuevaCosechaPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <CosechaNueva />
    </RequerirPermiso>
  );
}
