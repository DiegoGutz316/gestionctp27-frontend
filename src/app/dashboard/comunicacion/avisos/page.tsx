import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AvisosGestion } from "@/features/comunicacion/components/avisos-gestion";

export const metadata: Metadata = {
  title: "Avisos institucionales | GestiónCTP27",
};

export default function AvisosPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="LECTURA">
      <AvisosGestion />
    </RequerirPermiso>
  );
}
