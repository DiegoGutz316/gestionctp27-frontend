import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalDetalle } from "@/features/pecuaria/components/animal-detalle";

export const metadata: Metadata = {
  title: "Detalle del animal | GestiónCTP27",
};

/**
 * Backlog 2.2: la vista de detalle es de solo lectura, así que basta con el
 * permiso de LECTURA sobre PECUARIA; editar sigue exigiendo COMPLETO en su
 * propia página.
 */
export default async function DetalleAnimalPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const animalId = Number(id);

  return (
    <RequerirPermiso modulo="PECUARIA">
      <AnimalDetalle id={animalId} />
    </RequerirPermiso>
  );
}
