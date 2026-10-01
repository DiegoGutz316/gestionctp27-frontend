import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AvisoNuevo } from "@/features/comunicacion/components/aviso-nuevo";

export const metadata: Metadata = {
  title: "Publicar aviso | GestiónCTP27",
};

export default function NuevoAvisoPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="COMPLETO">
      <AvisoNuevo />
    </RequerirPermiso>
  );
}
