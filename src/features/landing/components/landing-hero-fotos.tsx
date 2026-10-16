"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const FOTOS = [
  {
    src: "/landing/hero/hero-01-desfile.jpg",
    alt: "Estudiantes del CTP 27 de Abril en el desfile con banderas y caballos",
  },
  {
    src: "/landing/hero/hero-02-tortillas.jpg",
    alt: "Mujeres preparando tortillas en comal de barro durante una actividad del colegio",
  },
  {
    src: "/landing/hero/hero-06-ganado-campo.jpg",
    alt: "Hombre con sombrero observando el ganado en el potrero",
  },
  {
    src: "/landing/hero/hero-07-cabritos.jpg",
    alt: "Estudiantes con cabritos recién nacidos en el área pecuaria",
  },
  {
    src: "/landing/hero/hero-08-ordeno.jpg",
    alt: "Estudiante realizando el ordeño de una vaca en el colegio",
  },
  {
    src: "/landing/hero/hero-09-corral.jpg",
    alt: "Estudiantes en el corral observando una práctica con ganado",
  },
];

const CAMBIO_MS = 6000;

/**
 * Fotografías horizontales del colegio que se alternan con un desvanecido suave.
 * Solo se usan fotos horizontales: en el hero ancho, las verticales se recortan
 * demasiado y se ven borrosas. Con `prefers-reduced-motion` se queda en la primera foto.
 */
export function LandingHeroFotos({
  className,
  sizes,
  objectPosition = "center",
  ajuste = "cover",
}: {
  className?: string;
  sizes: string;
  objectPosition?: string;
  /** `contain` muestra la foto completa dentro del marco, sin recortes. */
  ajuste?: "cover" | "contain";
}) {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActiva((indice) => (indice + 1) % FOTOS.length);
    }, CAMBIO_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={cn("absolute inset-0", className)}>
      {FOTOS.map((foto, indice) => (
        <div
          key={foto.src}
          aria-hidden={indice !== activa}
          className={cn(
            "absolute inset-0 transition-opacity duration-1400 ease-in-out motion-reduce:transition-none",
            indice === activa ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={foto.src}
            alt={indice === activa ? foto.alt : ""}
            fill
            priority={indice === 0}
            sizes={sizes}
            className={ajuste === "contain" ? "object-contain" : "object-cover"}
            style={{ objectPosition }}
          />
        </div>
      ))}
    </div>
  );
}
