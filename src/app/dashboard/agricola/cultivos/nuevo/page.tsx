import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CultivoNuevo } from "@/features/agricola/cultivo/components/cultivo-nuevo";

export const metadata: Metadata = {
  title: "Registrar cultivo | GestiónCTP27",
};

export default function CultivoNuevoPage() {
  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <CultivoNuevo />
    </RequerirPermiso>
  );
}
