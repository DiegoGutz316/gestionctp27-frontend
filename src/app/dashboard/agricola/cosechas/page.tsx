import type { Metadata } from "next";

import { CosechasGestion } from "@/features/agricola/cosecha/components/cosechas-gestion";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

export const metadata: Metadata = { title: "Cosechas | GestiónCTP27" };

export default function CosechasPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <CosechasGestion />
    </RequerirPermiso>
  );
}
