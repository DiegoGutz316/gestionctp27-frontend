import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AvisoEditar } from "@/features/comunicacion/components/aviso-editar";

export const metadata: Metadata = {
  title: "Editar aviso | GestiónCTP27",
};

export default async function EditarAvisoPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <RequerirPermiso modulo="REPORTES" nivel="COMPLETO">
      <AvisoEditar id={id} />
    </RequerirPermiso>
  );
}
