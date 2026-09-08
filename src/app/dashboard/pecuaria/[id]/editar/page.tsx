import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalEditar } from "@/features/pecuaria/components/animal-editar";

export const metadata: Metadata = {
  title: "Editar animal | GestiónCTP27",
};

export default async function EditarAnimalPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const animalId = Number(id);

  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="COMPLETO"
    >
      <AnimalEditar id={animalId} />
    </RequerirPermiso>
  );
}