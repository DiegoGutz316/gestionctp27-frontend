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
      className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
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
              "inline-flex h-11 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors md:h-9",
              activa
                ? "border-transparent bg-[#465526] text-white"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            {vista.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
