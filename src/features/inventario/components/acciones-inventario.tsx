"use client";

import Link from "next/link";
import { ArrowDownToLineIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

/**
 * Acciones de escritura del listado de insumos.
 *
 * Backlog 1.6: solo aparecen si el rol puede escribir en inventario. Los roles
 * de solo lectura (directora, estudiante) ven la pantalla sin las acciones, en
 * vez de encontrarse un "acceso denegado" después de hacer clic.
 */
export function AccionesInventario() {
  const { puede } = useAuth();

  if (!puede("INVENTARIO", "COMPLETO")) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Link renderiza un <a>, no un <button>; nativeButton={false} evita que
      Base UI asuma semántica de botón nativo sobre ese elemento. */}
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/inventario/entradas/nueva" />}
      >
        <ArrowDownToLineIcon />
        Registrar entrada
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/inventario/insumos/nuevo" />}
      >
        <PlusIcon />
        Registrar insumo
      </Button>
    </div>
  );
}
