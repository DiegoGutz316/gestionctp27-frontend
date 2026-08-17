import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { StockEditar } from "@/features/inventario/stock/components/stock-editar";

export const metadata: Metadata = {
  title: "Editar stock | GestiónCTP27",
};

/** Backlog 1.6: editar es escritura, exige COMPLETO sobre INVENTARIO. */
export default async function EditarStockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stockId = Number(id);

  if (!Number.isInteger(stockId) || stockId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar stock
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice el stock mínimo o el precio. La existencia solo cambia
            mediante entradas y salidas.
          </p>
        </header>
        <StockEditar id={stockId} />
      </main>
    </RequerirPermiso>
  );
}
