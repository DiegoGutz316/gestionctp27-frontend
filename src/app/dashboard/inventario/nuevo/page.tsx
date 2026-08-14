import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { InsumoForm } from "@/features/inventario/components/insumo-form";

export const metadata: Metadata = {
  title: "Registrar insumo | GestiónCTP27",
};

// Backlog 1.6: registrar es escritura, exige COMPLETO sobre INVENTARIO.
export default function NuevoInsumoPage() {
  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrar insumo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agregue un insumo agrícola o pecuario al inventario del colegio.
          </p>
        </header>
        <InsumoForm />
      </main>
    </RequerirPermiso>
  );
}
