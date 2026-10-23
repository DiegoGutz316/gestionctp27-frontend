import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { CultivoEditar } from "@/features/agricola/cultivo/components/cultivo-editar";

export const metadata: Metadata = { title: "Editar cultivo | GestiónCTP27" };

export default async function CultivoEditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RequerirPermiso modulo="AGRICOLA" nivel="COMPLETO">
      <CultivoEditar id={Number(id)} />
    </RequerirPermiso>
  );
}
