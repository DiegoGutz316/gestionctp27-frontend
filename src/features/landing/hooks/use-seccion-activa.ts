"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve el id de la sección que está en la franja central de la pantalla.
 * La franja se ubica debajo del header sticky para que la sección activa
 * cambie cuando realmente llega al centro de la vista.
 */
export function useSeccionActiva(ids: readonly string[]): string | null {
  const [activa, setActiva] = useState<string | null>(null);

  useEffect(() => {
    const secciones = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (secciones.length === 0) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActiva(entrada.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    secciones.forEach((seccion) => observer.observe(seccion));
    return () => observer.disconnect();
  }, [ids]);

  return activa;
}
