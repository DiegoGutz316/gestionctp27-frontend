import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { SalidaForm } from "@/features/inventario/components/salida-form";

export const metadata: Metadata = {
  title: "Registrar salida | GestiónCTP27",
};

// Backlog 4.6: modifica el stock, así que exige COMPLETO sobre INVENTARIO.
export default function NuevaSalidaPage() {
  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <Link
          href="/dashboard/inventario/movimientos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Volver a movimientos
        </Link>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrar salida
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre el uso o consumo de insumos. La existencia del insumo se
            descuenta automáticamente y no puede quedar en negativo.
          </p>
        </header>
        <SalidaForm />
      </main>
    </RequerirPermiso>
  );
}
