import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CamaCultivoEditar } from "@/features/agricola/components/cama-cultivo-editar";

export const metadata: Metadata = {
  title: "Editar cama de cultivo | GestiónCTP27",
};

export default async function EditarCamaCultivoPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const camaId = Number(id);

  // Misma guarda que en la vista de detalle y que en el resto de rutas
  // numéricas del proyecto.
  if (!Number.isInteger(camaId) || camaId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <CamaCultivoEditar id={camaId} />
    </RequerirPermiso>
  );
}
