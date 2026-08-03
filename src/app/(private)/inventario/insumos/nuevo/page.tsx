import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { InsumoForm } from "@/features/inventario/components/insumo-form";

export const metadata: Metadata = {
  title: "Registrar insumo | GestiónCTP27",
};

export default function NuevoInsumoPage() {
  return (
    <main className="mx-auto w-full max-w-lg p-6">
      <Link
        href="/inventario/insumos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Volver al listado de insumos
      </Link>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Registrar insumo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Agregue un insumo agrícola o pecuario al inventario del colegio.
        </p>
      </header>
      <InsumoForm />
    </main>
  );
}
