"use client";

import { useEffect, useSyncExternalStore } from "react";

/*
 * Una sola lectura a la vez para toda la página: `speechSynthesis` es global,
 * así que el estado (qué sección está hablando) también lo es.
 */
let idActivo: string | null = null;
let sesion = 0;
let escuchandoSalida = false;
const oyentes = new Set<() => void>();

function emitir() {
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  if (!escuchandoSalida && typeof window !== "undefined") {
    escuchandoSalida = true;
    window.addEventListener("pagehide", detenerLectura);
  }
  return () => oyentes.delete(oyente);
}

function suscribirNada() {
  return () => {};
}

function hayVoz(): boolean {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/** Voz en español: primero es-CR, luego cualquier es-*, si no la del sistema. */
function elegirVoz(): SpeechSynthesisVoice | null {
  const voces = window.speechSynthesis.getVoices();
  const idioma = (voz: SpeechSynthesisVoice) => voz.lang.replace("_", "-").toLowerCase();
  return (
    voces.find((voz) => idioma(voz) === "es-cr") ??
    voces.find((voz) => idioma(voz).startsWith("es")) ??
    null
  );
}

/** Chrome carga las voces de forma asíncrona: se espera `voiceschanged` un momento. */
function conVoces(continuar: () => void) {
  const sintesis = window.speechSynthesis;
  if (sintesis.getVoices().length > 0) {
    continuar();
    return;
  }
  let hecho = false;
  const listo = () => {
    if (hecho) return;
    hecho = true;
    sintesis.removeEventListener("voiceschanged", listo);
    continuar();
  };
  sintesis.addEventListener("voiceschanged", listo);
  window.setTimeout(listo, 1000);
}

/** Frases cortas: algunas voces de Chrome se cortan con textos largos. */
function partirEnFrases(texto: string): string[] {
  const frases = texto.split(/(?<=[.!?;:])\s+/);
  const partes: string[] = [];
  for (const frase of frases) {
    let resto = frase.trim();
    while (resto.length > 200) {
      const corte = resto.lastIndexOf(" ", 200);
      const indice = corte > 0 ? corte : 200;
      partes.push(resto.slice(0, indice));
      resto = resto.slice(indice).trim();
    }
    if (resto) partes.push(resto);
  }
  return partes;
}

export function detenerLectura() {
  if (typeof window === "undefined" || !hayVoz()) return;
  sesion += 1;
  window.speechSynthesis.cancel();
  if (idActivo !== null) {
    idActivo = null;
    emitir();
  }
}

function leer(id: string, texto: string) {
  detenerLectura();
  const partes = partirEnFrases(texto);
  if (partes.length === 0) return;

  const actual = sesion;
  idActivo = id;
  emitir();

  conVoces(() => {
    if (actual !== sesion) return;
    const voz = elegirVoz();
    const terminar = () => {
      if (actual !== sesion) return;
      idActivo = null;
      emitir();
    };

    partes.forEach((parte, indice) => {
      const enunciado = new SpeechSynthesisUtterance(parte);
      enunciado.lang = voz?.lang ?? "es-CR";
      if (voz) enunciado.voice = voz;
      enunciado.rate = 0.95;
      if (indice === partes.length - 1) enunciado.onend = terminar;
      enunciado.onerror = (evento) => {
        if (evento.error !== "interrupted" && evento.error !== "canceled") terminar();
      };
      window.speechSynthesis.speak(enunciado);
    });
  });
}

/**
 * Lectura en voz alta con `window.speechSynthesis`. `disponible` es `false` en el
 * servidor y en navegadores sin síntesis de voz, así no hay error de hidratación.
 */
export function useLecturaVoz(id: string) {
  const disponible = useSyncExternalStore(suscribirNada, hayVoz, () => false);
  const leyendo = useSyncExternalStore(
    suscribir,
    () => idActivo === id,
    () => false,
  );

  useEffect(() => {
    if (!disponible) return;
    // Pedir las voces temprano hace que Chrome empiece a cargarlas.
    window.speechSynthesis.getVoices();
    return () => {
      if (idActivo === id) detenerLectura();
    };
  }, [disponible, id]);

  return {
    disponible,
    leyendo,
    leer: (texto: string) => leer(id, texto),
    detener: detenerLectura,
  };
}
