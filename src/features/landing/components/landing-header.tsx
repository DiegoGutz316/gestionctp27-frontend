"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#modulos", label: "Módulos" },
  { href: "#sistema", label: "El sistema" },
];

export function LandingHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#252624]/10 bg-[#F7F5F0]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#inicio" className="flex items-center gap-3">
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight text-[#252624]">
            Gestión CTP 27
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#252624]/70 transition-colors hover:text-[#252624]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/login"
            className="rounded-full bg-[#252624] px-5 py-2.5 text-sm font-medium text-[#F7F5F0] transition-colors hover:bg-[#3a3c37]"
          >
            Ingresar
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#252624] md:hidden"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuAbierto && (
        <div className="border-t border-[#252624]/10 bg-[#F7F5F0] px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                className="rounded-lg px-2 py-3 text-sm text-[#252624]/80 hover:bg-[#252624]/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuAbierto(false)}
              className="mt-2 rounded-full bg-[#252624] px-5 py-3 text-center text-sm font-medium text-[#F7F5F0]"
            >
              Ingresar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
