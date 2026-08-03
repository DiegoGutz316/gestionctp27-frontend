import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        {/* Link renderiza un <a>, no un <button>; nativeButton={false} evita
        que Base UI asuma semántica de botón nativo sobre ese elemento. */}
        <Button
          nativeButton={false}
          render={<Link href="/inventario/insumos/nuevo" />}
        >
          <PlusIcon />
          Registrar insumo
        </Button>
      </header>
      <InsumosTable />
    </main>
  );
}
