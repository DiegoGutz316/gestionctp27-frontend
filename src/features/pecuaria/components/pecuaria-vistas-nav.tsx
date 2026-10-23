"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const VISTAS = [
  {
    href: "/dashboard/pecuaria/inventario/ganado-bovino",
    etiqueta: "Inventario bovino",
  },
  {
    href: "/dashboard/pecuaria/inventario/especies-menores",
    etiqueta: "Especies menores",
  },
  {
    href: "/dashboard/pecuaria/produccion",
    etiqueta: "Producción",
  },
] as const;

export function PecuariaVistasNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mx-4 flex gap-1 overflow-x-auto overscroll-x-contain border-b px-4 md:mx-0 md:px-0"
      aria-label="Vistas de pecuaria"
    >
      {VISTAS.map((vista) => {
        const activa = pathname.startsWith(vista.href);

        return (
          <Link
            key={vista.href}
            href={vista.href}
            aria-current={activa ? "page" : undefined}
            className={cn(
              "inline-flex h-11 shrink-0 items-center border-b-2 px-3 text-sm whitespace-nowrap",
              activa
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            {vista.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
