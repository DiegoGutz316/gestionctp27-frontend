"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const posicion =
  "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]";

export function AccionFlotante({
  href,
  etiqueta,
}: {
  href: string;
  etiqueta: string;
}) {
  return (
    <Link
      href={href}
      aria-label={etiqueta}
      className={cn(
        "fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden print:hidden",
        posicion,
      )}
    >
      <PlusIcon className="size-6" />
    </Link>
  );
}

export function MenuFlotante({
  acciones,
}: {
  acciones: { href: string; etiqueta: string; icono: ReactNode }[];
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-2 md:hidden print:hidden",
        posicion,
      )}
    >
      {abierto
        ? acciones.map((accion) => (
            <Link
              key={accion.href}
              href={accion.href}
              className="flex items-center gap-2 rounded-full border bg-background py-2 pr-3 pl-3 text-sm shadow-md"
              onClick={() => setAbierto(false)}
            >
              {accion.icono}
              {accion.etiqueta}
            </Link>
          ))
        : null}

      <button
        type="button"
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar acciones" : "Acciones"}
        onClick={() => setAbierto((actual) => !actual)}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        {abierto ? <XIcon className="size-6" /> : <PlusIcon className="size-6" />}
      </button>
    </div>
  );
}
