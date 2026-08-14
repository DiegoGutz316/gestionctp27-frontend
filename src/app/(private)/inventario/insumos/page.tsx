import type { Metadata } from "next";
import { AccionesInventario } from "@/features/inventario/components/acciones-inventario";
import { InsumosTable } from "@/features/inventario/components/insumos-table";

export const metadata: Metadata = {
  title: "Insumos | GestiónCTP27",
};

export default function InsumosPage() {
  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Insumos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulte los insumos agrícolas y pecuarios registrados en el
            inventario.
          </p>
        </div>
        <AccionesInventario />
      </header>
      <InsumosTable />
    </main>
  );
}
