import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CamaCultivoDetalle } from "@/features/agricola/components/cama-cultivo-detalle";

export const metadata: Metadata = {
  title: "Detalle de cama de cultivo | GestiónCTP27",
};

export default async function DetalleCamaCultivoPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const camaId = Number(id);

  // Un id que no sea entero positivo no corresponde a ninguna cama: sin esto
  // la consulta queda deshabilitada y la vista muestra un error de conexión
  // que no es cierto, o se manda un valor fraccionario a la API.
  if (!Number.isInteger(camaId) || camaId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="LECTURA">
      <CamaCultivoDetalle id={camaId} />
    </RequerirPermiso>
  );
}
