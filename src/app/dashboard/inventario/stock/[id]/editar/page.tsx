import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { StockEditar } from "@/features/inventario/stock/components/stock-editar";

export const metadata: Metadata = {
  title: "Editar configuración de stock | GestiónCTP27",
};

/** Backlog 1.6: editar es escritura, exige COMPLETO sobre INVENTARIO. */
export default async function EditarStockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const configuracionId = Number(id);

  if (!Number.isInteger(configuracionId) || configuracionId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <StockEditar id={configuracionId} />
    </RequerirPermiso>
  );
}
