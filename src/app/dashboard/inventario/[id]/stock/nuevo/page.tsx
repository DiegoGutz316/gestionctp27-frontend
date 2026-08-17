import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { StockNuevo } from "@/features/inventario/stock/components/stock-nuevo";

export const metadata: Metadata = {
  title: "Configurar stock | GestiónCTP27",
};

// Backlog 1.6: registrar es escritura, exige COMPLETO sobre INVENTARIO.
export default async function NuevoStockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Configurar stock
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Defina el stock mínimo y el precio. La existencia inicia en cero y
            cambia únicamente mediante entradas y salidas.
          </p>
        </header>
        <StockNuevo productoId={productoId} />
      </main>
    </RequerirPermiso>
  );
}
