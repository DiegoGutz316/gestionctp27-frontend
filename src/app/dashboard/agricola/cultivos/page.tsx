import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CultivosGestion } from "@/features/agricola/cultivo/components/cultivos-gestion";

export const metadata: Metadata = {
  title: "Cultivos | GestiónCTP27",
};

export default function CultivosPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <CultivosGestion />
    </RequerirPermiso>
  );
}
