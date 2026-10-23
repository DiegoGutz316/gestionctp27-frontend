"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const vistas = [
  {
    href: "/dashboard/agricola",
    etiqueta: "Camas de cultivo",
  },
  {
    href: "/dashboard/agricola/siembras",
    etiqueta: "Siembras",
  },
  {
    href: "/dashboard/agricola/tratamientos",
    etiqueta: "Tratamientos",
  },
  {
    href: "/dashboard/agricola/cosechas",
    etiqueta: "Cosechas",
  },
] as const;

export function AgricolaVistasNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mx-4 flex gap-1 overflow-x-auto overscroll-x-contain border-b px-4 md:mx-0 md:px-0"
      aria-label="Vistas del área agrícola"
    >
      {vistas.map((vista) => {
        const activa =
          vista.href === "/dashboard/agricola"
            ? pathname === vista.href ||
              /^\/dashboard\/agricola\/\d/.test(
                pathname,
              )
            : pathname.startsWith(
                vista.href,
              );

        return (
          <Link
            key={vista.href}
            href={vista.href}
            aria-current={
              activa
                ? "page"
                : undefined
            }
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