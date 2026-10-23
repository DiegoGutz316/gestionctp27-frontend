"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

const FOTOS = [
  {
    src: "/landing/hero/hero-01-desfile.jpg",
    alt: "Desfile del colegio: jóvenes a caballo con sombrero, banderas y muchachas con traje típico",
  },
  {
    src: "/landing/hero/hero-02-tortillas.jpg",
    alt: "Tres mujeres con delantal blanco hacen tortillas a mano junto a comales de barro sobre fogones de leña",
  },
  {
    src: "/landing/hero/hero-06-ganado-campo.jpg",
    alt: "Hombre con sombrero mira un corral lleno de ganado blanco en un potrero seco",
  },
  {
    src: "/landing/hero/hero-07-cabritos.jpg",
    alt: "Dos estudiantes sonrientes, sentados en el heno, cargan cabritos recién nacidos",
  },
  {
    src: "/landing/hero/hero-08-ordeno.jpg",
    alt: "Estudiante ordeña una vaca a mano en un balde, al lado de un ternero",
  },
  {
    src: "/landing/hero/hero-09-corral.jpg",
    alt: "Grupo de estudiantes con uniforme observa una práctica con ganado en el corral",
  },
];

const CAMBIO_MS = 6000;

const CONSULTA_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

function suscribirMovimiento(oyente: () => void) {
  const consulta = window.matchMedia(CONSULTA_MOVIMIENTO);
  consulta.addEventListener("change", oyente);
  return () => consulta.removeEventListener("change", oyente);
}

/**
 * Fotografías horizontales del colegio que se alternan con un desvanecido suave.
 * Solo se usan fotos horizontales: en el hero ancho, las verticales se recortan
 * demasiado y se ven borrosas. Con `prefers-reduced-motion` se queda en la primera foto.
 * El avance se pausa con el puntero o el foco dentro del hero, o con el botón de
 * pausa, que solo se ve al llegar con el teclado.
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
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false);
  const [enHero, setEnHero] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const movimientoReducido = useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(CONSULTA_MOVIMIENTO).matches,
    () => true,
  );

  const avanza = !movimientoReducido && !pausadoPorUsuario && !enHero;

  // En escritorio el texto del hero queda encima de las fotos, así que el
  // puntero y el foco se escuchan en toda la sección.
  useEffect(() => {
    const seccion = contenedor.current?.closest("section");
    if (!seccion) return;
    const entrar = () => setEnHero(true);
    const salirPuntero = () => {
      if (!seccion.contains(document.activeElement)) setEnHero(false);
    };
    const salirFoco = (evento: FocusEvent) => {
      if (!seccion.contains(evento.relatedTarget as Node | null) && !seccion.matches(":hover")) {
        setEnHero(false);
      }
    };
    seccion.addEventListener("pointerenter", entrar);
    seccion.addEventListener("pointerleave", salirPuntero);
    seccion.addEventListener("focusin", entrar);
    seccion.addEventListener("focusout", salirFoco);
    return () => {
      seccion.removeEventListener("pointerenter", entrar);
      seccion.removeEventListener("pointerleave", salirPuntero);
      seccion.removeEventListener("focusin", entrar);
      seccion.removeEventListener("focusout", salirFoco);
    };
  }, []);

  useEffect(() => {
    if (!avanza) return;
    const id = window.setInterval(() => {
      setActiva((indice) => (indice + 1) % FOTOS.length);
    }, CAMBIO_MS);
    return () => window.clearInterval(id);
  }, [avanza]);

  return (
    <div
      ref={contenedor}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotografías del colegio"
      className={cn("absolute inset-0", className)}
    >
      <div aria-live={avanza ? "off" : "polite"}>
        {FOTOS.map((foto, indice) => {
          const visible = indice === activa;
          return (
            <div
              key={foto.src}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`Imagen ${indice + 1} de ${FOTOS.length}`}
              aria-hidden={!visible}
              inert={!visible}
              className={cn(
                "absolute inset-0 transition-opacity duration-1400 ease-in-out motion-reduce:transition-none",
                visible ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                priority={indice === 0}
                sizes={sizes}
                className={ajuste === "contain" ? "object-contain" : "object-cover"}
                style={{ objectPosition }}
              />
            </div>
          );
        })}
      </div>

      {movimientoReducido ? null : (
        <button
          type="button"
          data-no-leer
          onClick={() => setPausadoPorUsuario((valor) => !valor)}
          aria-label={pausadoPorUsuario ? "Reanudar carrusel de fotos" : "Pausar carrusel de fotos"}
          className="sr-only items-center justify-center rounded-full bg-tarjeta/90 text-tinta transition hover:bg-tarjeta focus-visible:not-sr-only focus-visible:absolute focus-visible:right-4 focus-visible:bottom-4 focus-visible:z-20 focus-visible:inline-flex focus-visible:size-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 md:focus-visible:size-9"
        >
          {pausadoPorUsuario ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
