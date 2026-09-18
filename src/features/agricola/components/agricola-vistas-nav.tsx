"use client";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Button } from "@/components/ui/button";

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
] as const;

export function AgricolaVistasNav() {
  const pathname = usePathname();
  const router = useRouter();

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
          <Button
            key={vista.href}
            type="button"
            variant={
              activa
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              router.push(vista.href)
            }
            aria-current={
              activa
                ? "page"
                : undefined
            }
          >
            {vista.etiqueta}
          </Button>
        );
      })}
    </nav>
  );
}