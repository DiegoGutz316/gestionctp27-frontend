import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { Button } from "@/components/ui/button";
import { EntradasTabla } from "@/features/inventario/components/entradas-tabla";

export const metadata: Metadata = {
  title: "Entradas de inventario | GestiónCTP27",
};

/**
 * Backlog 4.5. La consulta solo exige LECTURA (la hereda del layout de
 * inventario); el botón para registrar sí pide COMPLETO.
 */
export default function EntradasPage() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Link
        href="/inventario/insumos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Volver al listado de insumos
      </Link>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Entradas de inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Historial de los ingresos de insumos registrados.
          </p>
        </div>
        <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
          <Button
            nativeButton={false}
            render={<Link href="/inventario/entradas/nueva" />}
          >
            Registrar entrada
          </Button>
        </MostrarSiPuede>
      </header>
      <EntradasTabla />
    </main>
  );
}
