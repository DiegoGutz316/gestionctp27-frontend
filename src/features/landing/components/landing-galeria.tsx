"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    src: "/landing/galeria/ctp-galeria-03.jpg",
    alt: "Áreas verdes y espacios institucionales del CTP 27 de Abril",
    caption: "Áreas verdes y espacios institucionales",
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

export function LandingGaleria() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activo, setActivo] = useState(0);

  const irA = useCallback((indice: number) => {
    const destino = slideRefs.current[indice];
    destino?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const anterior = useCallback(() => {
    irA(Math.max(activo - 1, 0));
  }, [activo, irA]);

  const siguiente = useCallback(() => {
    irA(Math.min(activo + 1, FOTOS.length - 1));
  }, [activo, irA]);

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
      <div className="relative overflow-hidden rounded-3xl border border-[#252624]/10 bg-white shadow-[0_30px_70px_-25px_rgba(37,38,36,0.35)]">
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Fotografías institucionales"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") siguiente();
            if (e.key === "ArrowLeft") anterior();
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
          className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#252624]/10 bg-white/90 text-[#252624] shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:opacity-30 sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={siguiente}
          disabled={activo === FOTOS.length - 1}
          aria-label="Fotografía siguiente"
          className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#252624]/10 bg-white/90 text-[#252624] shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:opacity-30 sm:flex"
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
              activo === i ? "w-6 bg-[#C7A35D]" : "w-1.5 bg-[#252624]/20 hover:bg-[#252624]/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
