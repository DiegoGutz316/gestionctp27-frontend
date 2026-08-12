"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

/**
 * Backlog 1.6: el botón solo aparece si el rol puede escribir en inventario.
 * Los roles de solo lectura (directora, estudiante) ven la pantalla sin la
 * acción, en vez de encontrarse un "acceso denegado" después de hacer clic.
 */
export function BotonRegistrarInsumo() {
  const { puede } = useAuth();

  if (!puede("INVENTARIO", "COMPLETO")) return null;

  return (
    // Link renderiza un <a>, no un <button>; nativeButton={false} evita que
    // Base UI asuma semántica de botón nativo sobre ese elemento.
    <Button
      nativeButton={false}
      render={<Link href="/inventario/insumos/nuevo" />}
    >
      <PlusIcon />
      Registrar insumo
    </Button>
  );
}
