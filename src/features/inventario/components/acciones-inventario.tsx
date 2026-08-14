"use client";

import Link from "next/link";
import { HistoryIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

/**
 * Acciones del listado de insumos.
 *
 * El historial de entradas (backlog 4.5) es una consulta, así que se ofrece a
 * cualquiera que pueda ver esta pantalla. Registrar un insumo escribe, así que
 * se condiciona a COMPLETO (backlog 1.6): los roles de solo lectura no ven una
 * acción que terminaría en un rechazo.
 */
export function AccionesInventario() {
  return (
    <div className="flex items-center gap-2">
      {/* Link renderiza un <a>, no un <button>; nativeButton={false} evita que
      Base UI asuma semántica de botón nativo sobre ese elemento. */}
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/dashboard/inventario/entradas" />}
      >
        <HistoryIcon />
        Entradas
      </Button>
      <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
        <Button
          nativeButton={false}
          render={<Link href="/inventario/insumos/nuevo" />}
        >
          <PlusIcon />
          Registrar insumo
        </Button>
      </MostrarSiPuede>
    </div>
  );
}
