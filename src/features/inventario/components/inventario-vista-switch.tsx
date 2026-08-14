"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const vistas = [
  {
    href: "/dashboard/inventario",
    label: "Insumos",
    activo: (pathname: string) =>
      pathname === "/dashboard/inventario" ||
      pathname.startsWith("/dashboard/inventario/nuevo") ||
      pathname.includes("/insumos"),
  },
  {
    href: "/dashboard/inventario/entradas",
    label: "Entradas",
    activo: (pathname: string) => pathname.includes("/entradas"),
  },
] as const;

export function InventarioVistaSwitch() {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label="Vista de inventario"
      className="flex flex-wrap gap-2"
    >
      {vistas.map((vista) => {
        const activo = vista.activo(pathname);

        return (
          <Button
            key={vista.href}
            type="button"
            size="lg"
            variant={activo ? "default" : "outline"}
            className={
              activo
                ? "h-9 rounded-full bg-foreground px-4 text-background hover:bg-foreground/90 hover:text-background"
                : "h-9 rounded-full border-foreground/20 bg-background px-4 text-foreground hover:bg-muted"
            }
            aria-selected={activo}
            nativeButton={false}
            render={<Link href={vista.href} role="tab" />}
          >
            {vista.label}
          </Button>
        );
      })}
    </div>
  );
}
