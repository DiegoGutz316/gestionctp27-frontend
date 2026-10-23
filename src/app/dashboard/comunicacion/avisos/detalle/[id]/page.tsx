import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AvisoDetalle } from "@/features/comunicacion/components/aviso-detalle";

export const metadata: Metadata = {
  title: "Detalle del aviso | GestiónCTP27",
};

export const dynamic = "force-dynamic";

export default async function DetalleAvisoPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const avisoId = Number(id);

  if (!Number.isInteger(avisoId) || avisoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="REPORTES" nivel="LECTURA">
      <AvisoDetalle id={String(avisoId)} />
    </RequerirPermiso>
  );
}
