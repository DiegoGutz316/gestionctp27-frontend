"use client";

import { useEffect, useSyncExternalStore } from "react";

export const NIVELES_ESCALA = [0.9, 1, 1.125, 1.25, 1.5] as const;

const CLAVE = "escala-texto";

let escala: number | null = null;
let cambiada = false;
const oyentes = new Set<() => void>();

function leerGuardada(): number {
  try {
    const valor = Number(localStorage.getItem(CLAVE));
    return (NIVELES_ESCALA as readonly number[]).includes(valor) ? valor : 1;
  } catch {
    return 1;
  }
}

/** Aplica la escala en <html>, igual que el script inicial del layout. */
function aplicar(valor: number) {
  const raiz = document.documentElement;
  if (valor === 1) raiz.style.removeProperty("--escala-texto");
  else raiz.style.setProperty("--escala-texto", String(valor));
  raiz.toggleAttribute("data-escala-ampliada", valor > 1);
}

function obtener(): number {
  if (escala === null) escala = leerGuardada();
  return escala;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

/** Indica si la persona ya cambió la escala; evita anunciarla al cargar. */
export function huboCambio(): boolean {
  return cambiada;
}

export function cambiarEscala(valor: number) {
  escala = valor;
  cambiada = true;
  aplicar(valor);
  try {
    if (valor === 1) localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, String(valor));
  } catch {
    // Sin almacenamiento disponible: la escala dura solo esta visita.
  }
  oyentes.forEach((oyente) => oyente());
}

/**
 * Escala de texto de la landing. Al montar reaplica la guardada (por si se llegó
 * con navegación del cliente) y al desmontar la quita para no afectar otras páginas.
 */
export function useEscalaTexto(): number {
  const valor = useSyncExternalStore(suscribir, obtener, () => 1);

  useEffect(() => {
    aplicar(obtener());
    return () => aplicar(1);
  }, []);

  return valor;
}
