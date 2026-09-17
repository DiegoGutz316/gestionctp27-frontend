import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { TratamientoNuevo } from "@/features/agricola/tratamiento/components/tratamiento-nuevo";

export const metadata: Metadata = {
  title: "Registrar tratamiento | GestiónCTP27",
};

export default function NuevoTratamientoPage() {
  return (
    <RequerirPermiso
      modulo="AGRICOLA"
      nivel="COMPLETO"
    >
      <TratamientoNuevo />
    </RequerirPermiso>
  );
}