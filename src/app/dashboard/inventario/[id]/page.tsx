import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductoDetalle } from "@/features/inventario/producto/components/producto-detalle";

export const metadata: Metadata = {
  title: "Detalle de producto | GestiónCTP27",
};

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    notFound();
  }

  return <ProductoDetalle id={productoId} />;
}
