import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AsientosLibro } from "@/features/libro-caja/periodo/components/asientos-libro";

export const metadata: Metadata = {
  title: "Libro de caja | GestiónCTP27",
};

export default async function AsientosLibroPage({
  params,
}: {
  params: Promise<{ id: string; fondoId: string }>;
}) {
  const { id, fondoId } = await params;
  const periodoId = Number(id);
  const fondo = Number(fondoId);

  if (
    !Number.isInteger(periodoId) ||
    periodoId <= 0 ||
    !Number.isInteger(fondo) ||
    fondo <= 0
  ) {
    notFound();
  }

  return <AsientosLibro periodoId={periodoId} fondoId={fondo} />;
}
