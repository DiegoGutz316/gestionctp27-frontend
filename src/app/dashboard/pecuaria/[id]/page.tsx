import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalDetalle } from "@/features/pecuaria/animal/components/animal-detalle";

export const metadata: Metadata = {
  title: "Ficha del animal | GestiónCTP27",
};

export default async function AnimalDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animalId = Number(id);

  if (!Number.isInteger(animalId) || animalId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="PECUARIA" nivel="LECTURA">
      <AnimalDetalle id={animalId} />
    </RequerirPermiso>
  );
}
