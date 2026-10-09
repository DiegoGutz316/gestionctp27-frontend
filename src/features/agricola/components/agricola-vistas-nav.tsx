"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
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
      className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
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
              buttonVariants({
                variant: activa
                  ? "default"
                  : "outline",
                size: "sm",
              }),
              "h-11 shrink-0 md:h-8",
            )}
          >
            {vista.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}