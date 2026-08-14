import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { EntradaForm } from "@/features/inventario/components/entrada-form";

export const metadata: Metadata = {
  title: "Registrar entrada | GestiónCTP27",
};

// Backlog 4.4: modifica el stock, así que exige COMPLETO sobre INVENTARIO.
export default function NuevaEntradaPage() {
  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <Link
          href="/dashboard/inventario/entradas"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Volver a entradas
        </Link>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrar entrada
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre el ingreso de insumos al inventario. La existencia del
            insumo se actualiza automáticamente.
          </p>
        </header>
        <EntradaForm />
      </main>
    </RequerirPermiso>
  );
}
