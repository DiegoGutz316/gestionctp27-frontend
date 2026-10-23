import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { SiembraDetalle } from "@/features/agricola/siembra/components/siembra-detalle";

export const metadata: Metadata = { title: "Ciclo de siembra | GestiónCTP27" };

export default async function SiembraDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <SiembraDetalle id={Number(id)} />
    </RequerirPermiso>
  );
}
