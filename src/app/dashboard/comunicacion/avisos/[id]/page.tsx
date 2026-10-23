import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AvisoDetalle } from "@/features/comunicacion/components/aviso-detalle";

export const metadata: Metadata = {
  title: "Detalle del aviso | GestiónCTP27",
};

export default async function DetalleAvisoPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <RequerirPermiso modulo="REPORTES" nivel="LECTURA">
      <AvisoDetalle id={id} />
    </RequerirPermiso>
  );
}
