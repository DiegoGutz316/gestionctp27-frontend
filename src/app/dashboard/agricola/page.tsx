import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CamasCultivoGestion } from "@/features/agricola/components/camas-cultivo-gestion";

export const metadata: Metadata = {
  title: "Agrícola | GestiónCTP27",
};

export default function AgricolaPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <CamasCultivoGestion />
    </RequerirPermiso>
  );
}
