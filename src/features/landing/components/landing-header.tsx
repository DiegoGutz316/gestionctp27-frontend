"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SelectorTema } from "@/components/selector-tema";
import { cn } from "@/lib/utils";

import { useSeccionActiva } from "../hooks/use-seccion-activa";

const NAV_LINKS = [
  { href: "#inicio", id: "inicio", label: "Inicio" },
  { href: "#nosotros", id: "nosotros", label: "Nosotros" },
  { href: "#especialidades", id: "especialidades", label: "Especialidades" },
  { href: "#calendario", id: "calendario", label: "Calendario" },
  { href: "#contacto", id: "contacto", label: "Contacto" },
];

const IDS_SECCIONES = NAV_LINKS.map((link) => link.id);

export function LandingHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const activa = useSeccionActiva(IDS_SECCIONES);
  const idMenu = useId();

  useEffect(() => {
    function alDesplazar() {
      setDesplazado(window.scrollY > 8);
    }
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  // Con el menú móvil abierto, Escape lo cierra.
  useEffect(() => {
    if (!menuAbierto) return;
    function alPulsar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [menuAbierto]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
        desplazado
          ? "border-tinta/10 bg-landing/80 shadow-[0_8px_30px_-18px_rgba(37,38,36,0.35)] backdrop-blur-md"
          : "border-transparent bg-landing/95",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="#inicio"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40"
        >
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

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const seleccionado = activa === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={seleccionado ? "location" : undefined}
                className={cn(
                  "group relative rounded-full px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40",
                  seleccionado ? "font-medium text-oliva" : "text-tinta/70 hover:text-tinta",
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-center rounded-full bg-oliva transition-transform duration-300",
                    seleccionado ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SelectorTema variante="landing" />
          <Link
            href="/login"
            className="hidden rounded-full bg-oliva px-5 py-2.5 text-sm font-medium text-sobre-oliva shadow-[0_8px_20px_-10px_rgba(82,99,77,0.6)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing active:brightness-95 lg:inline-flex"
          >
            Ingresar
          </Link>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex size-11 items-center justify-center rounded-full text-tinta transition-colors hover:bg-tinta/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 lg:hidden"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls={idMenu}
          >
            {menuAbierto ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id={idMenu}
        hidden={!menuAbierto}
        className="border-t border-tinta/10 bg-landing/95 px-5 pb-6 pt-2 backdrop-blur-md lg:hidden"
      >
        <nav aria-label="Principal móvil" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const seleccionado = activa === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                aria-current={seleccionado ? "location" : undefined}
                className={cn(
                  "rounded-xl px-3 py-3 text-base transition-colors hover:bg-tinta/5",
                  seleccionado ? "bg-oliva/10 font-medium text-oliva" : "text-tinta/80",
                )}
              >
                {link.label}
              </a>
            );
          })}
          <Link
            href="/login"
            onClick={() => setMenuAbierto(false)}
            className="mt-3 rounded-full bg-oliva px-5 py-3 text-center text-sm font-medium text-sobre-oliva transition hover:brightness-105 active:brightness-95"
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
