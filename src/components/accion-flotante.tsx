"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const posicion =
  "bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-6";

const pastilla =
  "flex items-center gap-2 rounded-full border bg-background py-2 pr-3 pl-3 text-sm shadow-md";

export type AccionMenu = {
  etiqueta: string;
  icono: ReactNode;
  href?: string;
  onClick?: () => void;
};

export function AccionFlotante({
  href,
  etiqueta,
  icono,
}: {
  href: string;
  etiqueta: string;
  icono?: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={etiqueta}
      className={cn(
        "fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg print:hidden",
        posicion,
      )}
    >
      {icono ?? <PlusIcon className="size-6" />}
    </Link>
  );
}

export function MenuFlotante({ acciones }: { acciones: AccionMenu[] }) {
  const [abierto, setAbierto] = useState(false);

  if (acciones.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-2 print:hidden",
        posicion,
      )}
    >
      {abierto
        ? acciones.map((accion) =>
            accion.href ? (
              <Link
                key={accion.etiqueta}
                href={accion.href}
                className={pastilla}
                onClick={() => setAbierto(false)}
              >
                {accion.icono}
                {accion.etiqueta}
              </Link>
            ) : (
              <button
                key={accion.etiqueta}
                type="button"
                className={pastilla}
                onClick={() => {
                  setAbierto(false);
                  accion.onClick?.();
                }}
              >
                {accion.icono}
                {accion.etiqueta}
              </button>
            ),
          )
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
