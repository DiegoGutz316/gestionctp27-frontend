"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Foto = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

const FOTOS: Foto[] = [
  {
    src: "/landing/galeria/ctp-galeria-03.jpg",
    alt: "Áreas verdes y espacios institucionales del CTP 27 de Abril",
    caption: "Áreas verdes y espacios institucionales",
  },
  {
    src: "/landing/galeria/ctp-galeria-01.jpg",
    alt: "Estudiantes cosechando hortalizas en el invernadero institucional",
    caption: "Cosecha de hortalizas en el invernadero institucional",
    objectPosition: "center top",
  },
  {
    src: "/landing/galeria/ctp-galeria-02.jpg",
    alt: "Grupo de estudiantes en la producción agrícola del colegio",
    caption: "Estudiantes en la producción agrícola del colegio",
  },
  {
    src: "/landing/galeria/ctp-galeria-04.jpg",
    alt: "Ejemplares porcinos del proyecto pecuario institucional",
    caption: "Ejemplares del proyecto pecuario institucional",
  },
  {
    src: "/landing/galeria/ctp-galeria-05.jpg",
    alt: "Crías en el área de producción pecuaria del colegio",
    caption: "Crías en el área de producción pecuaria",
  },
];

const AUTOPLAY_MS = 5000;

const CONSULTA_REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * `useSyncExternalStore` vuelve a suscribirse cada vez que cambia la identidad
 * de `subscribe`. Si estas funciones se definieran dentro del hook, se crearían
 * en cada render del carrusel y cada cambio de foto o de pausa daría de baja y
 * de alta el listener de la media query.
 *
 * Por eso viven en el ámbito del módulo: su identidad es estable durante toda
 * la vida de la página y la suscripción se hace una sola vez.
 */
let mediaQueryReduceMotion: MediaQueryList | null = null;

/**
 * El `MediaQueryList` se crea una única vez y de forma perezosa: en el módulo
 * no puede crearse porque `window` no existe durante el render en servidor.
 */
function obtenerMediaQuery(): MediaQueryList {
  mediaQueryReduceMotion ??= window.matchMedia(CONSULTA_REDUCE_MOTION);
  return mediaQueryReduceMotion;
}

function suscribirReduceMotion(alCambiar: () => void): () => void {
  const mql = obtenerMediaQuery();
  mql.addEventListener("change", alCambiar);
  return () => mql.removeEventListener("change", alCambiar);
}

function leerReduceMotion(): boolean {
  return obtenerMediaQuery().matches;
}

/**
 * Valor durante el renderizado en servidor, donde no se conoce la preferencia:
 * se asume que no hay reducción de movimiento y el cliente lo corrige al
 * hidratar. Es el mismo valor inicial que tenía la versión con `useState`.
 */
function leerReduceMotionEnServidor(): boolean {
  return false;
}

/**
 * Lee `prefers-reduced-motion` con `useSyncExternalStore`, que es la API
 * pensada para suscribirse a un origen externo al estado de React (aquí,
 * `matchMedia`). Antes se hacía con `useState` + `setState` dentro de un
 * efecto, lo que provoca un render en cascada en cada montaje.
 */
function useReduceMotion(): boolean {
  return useSyncExternalStore(
    suscribirReduceMotion,
    leerReduceMotion,
    leerReduceMotionEnServidor,
  );
}

export function LandingGaleria() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const reduceMotion = useReduceMotion();

  // Se mueve únicamente el scroll horizontal del carrusel. `scrollIntoView`
  // desplaza todos los contenedores con scroll por encima del elemento,
  // incluida la página: si el visitante estaba más abajo, cada avance
  // automático lo arrastraba de vuelta hasta el carrusel.
  //
  // Quien pide menos movimiento tampoco debe ver la animación al navegar con
  // los botones, el teclado o los indicadores. Se usa "instant" y no "auto":
  // con "auto" el navegador consulta la propiedad CSS `scroll-behavior` del
  // contenedor, así que la animación volvería por esa vía.
  const irA = useCallback(
    (indice: number) => {
      const destino = slideRefs.current[indice];
      const track = trackRef.current;
      if (!destino || !track) return;

      const desplazamiento =
        destino.getBoundingClientRect().left -
        track.getBoundingClientRect().left;
      track.scrollTo({
        left: track.scrollLeft + desplazamiento,
        behavior: reduceMotion ? "instant" : "smooth",
      });
    },
    [reduceMotion],
  );

  const anterior = useCallback(() => {
    irA(Math.max(activo - 1, 0));
  }, [activo, irA]);

  const siguiente = useCallback(() => {
    irA(Math.min(activo + 1, FOTOS.length - 1));
  }, [activo, irA]);

  // Reinicia el ciclo de autoplay cada vez que cambia la foto activa
  // (por swipe, botones o navegación automática), evitando saltos dobles.
  // Como `activo` es dependencia, el intervalo se recrea en cada cambio y su
  // clausura ya ve el índice vigente: no hace falta guardarlo en un ref.
  useEffect(() => {
    if (pausado || reduceMotion) return;

    const id = setInterval(() => {
      const siguienteIndice = (activo + 1) % FOTOS.length;
      irA(siguienteIndice);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [activo, pausado, reduceMotion, irA]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const indice = slideRefs.current.findIndex((el) => el === visible.target);
          if (indice !== -1) setActivo(indice);
        }
      },
      { root: track, threshold: [0.6] }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-none">
      <div
        className="relative overflow-hidden rounded-3xl border border-tinta/10 bg-tarjeta shadow-[0_30px_70px_-25px_rgba(37,38,36,0.35)]"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        <div
          ref={trackRef}
          // `scroll-smooth` solo cuando no se pidió reducir el movimiento: la
          // clase afecta a cualquier desplazamiento del contenedor, incluido
          // el ajuste del scroll-snap tras un gesto del usuario.
          className={`scrollbar-none flex snap-x snap-mandatory overflow-x-auto ${
            reduceMotion ? "" : "scroll-smooth"
          }`}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Fotografías institucionales"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            // El contenedor tiene scroll propio, así que el navegador también
            // desplaza por su cuenta al pulsar las flechas. Sumado al
            // scroll-snap, eso avanzaba dos fotos en lugar de una.
            e.preventDefault();
            if (e.key === "ArrowRight") siguiente();
            else anterior();
          }}
        >
          {FOTOS.map((foto, i) => (
            <div
              key={foto.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="relative aspect-[4/3] w-full shrink-0 snap-center"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
                style={foto.objectPosition ? { objectPosition: foto.objectPosition } : undefined}
                priority={i === 0}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#252624]/55 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3.5">
                <p className="text-xs font-medium text-white/90">{foto.caption}</p>
                <span className="shrink-0 text-[11px] tabular-nums text-white/60">
                  {String(i + 1).padStart(2, "0")} / {String(FOTOS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={anterior}
          disabled={activo === 0}
          aria-label="Fotografía anterior"
          className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-tinta/10 bg-tarjeta/90 text-tinta shadow-sm backdrop-blur transition-opacity hover:bg-tarjeta disabled:opacity-30 sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={siguiente}
          disabled={activo === FOTOS.length - 1}
          aria-label="Fotografía siguiente"
          className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-tinta/10 bg-tarjeta/90 text-tinta shadow-sm backdrop-blur transition-opacity hover:bg-tarjeta disabled:opacity-30 sm:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {FOTOS.map((foto, i) => (
          <button
            key={foto.src}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ir a la fotografía ${i + 1}`}
            aria-current={activo === i}
            className={`h-1.5 rounded-full transition-all ${
              activo === i ? "w-6 bg-oro" : "w-1.5 bg-tinta/20 hover:bg-tinta/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
