import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalEditar } from "@/features/pecuaria/animal/components/animal-editar";

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

  // Misma guarda que en la vista de detalle y que en el resto de rutas
  // numéricas del proyecto.
  if (!Number.isInteger(animalId) || animalId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="COMPLETO"
    >
      <AnimalEditar id={animalId} />
    </RequerirPermiso>
  );
}