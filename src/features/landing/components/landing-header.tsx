"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SelectorTema } from "@/components/selector-tema";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#calendario", label: "Calendario" },
  { href: "#contacto", label: "Contacto" },
];

export function LandingHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-tinta/10 bg-landing/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#inicio" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="truncate text-sm font-semibold tracking-tight text-tinta sm:text-[15px]">
            Gestión CTP 27
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-tinta/70 transition-colors hover:text-tinta"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SelectorTema variante="landing" />
          <Link
            href="/login"
            className="hidden rounded-full bg-oliva px-5 py-2.5 text-sm font-medium text-sobre-oliva transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing active:brightness-95 lg:inline-flex"
          >
            Ingresar
          </Link>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex size-11 items-center justify-center rounded-full text-tinta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 lg:hidden"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="border-t border-tinta/10 bg-landing px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                className="rounded-lg px-2 py-3 text-base text-tinta/80 hover:bg-tinta/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuAbierto(false)}
              className="mt-2 rounded-full bg-oliva px-5 py-3 text-center text-sm font-medium text-sobre-oliva transition hover:brightness-105 active:brightness-95"
            >
              Ingresar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
