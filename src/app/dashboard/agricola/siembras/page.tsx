import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { SiembrasGestion } from "@/features/agricola/siembra/components/siembras-gestion";

export const metadata: Metadata = { title: "Siembras | GestiónCTP27" };

export default function SiembrasPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <SiembrasGestion />
    </RequerirPermiso>
  );
}
