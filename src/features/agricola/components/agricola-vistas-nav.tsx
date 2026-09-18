"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

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
      className="flex flex-wrap gap-2"
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
            className={buttonVariants({
              variant: activa
                ? "default"
                : "outline",
              size: "sm",
            })}
          >
            {vista.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}