import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  // Un id que no sea entero positivo no corresponde a ningún animal: sin esto
  // la consulta queda deshabilitada y la vista muestra un error de conexión
  // que no es cierto, o se manda un valor fraccionario a la API.
  if (!Number.isInteger(animalId) || animalId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="PECUARIA">
      <AnimalDetalle id={animalId} />
    </RequerirPermiso>
  );
}
