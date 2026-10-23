import { ArrowRight, MapPin } from "lucide-react";

import { BotonEscuchar } from "./boton-escuchar";
import { LandingHeroFotos } from "./landing-hero-fotos";

/** Entrada suave; `motion-reduce` la desactiva para quien pide menos movimiento. */
const ENTRADA =
  "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none";

export function LandingHero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="relative scroll-mt-16 overflow-hidden bg-landing">
      <div className="relative lg:min-h-170">
        {/* Fotografía de fondo a todo el ancho, con degradado blanco hacia la izquierda */}
        <div className="absolute inset-0 hidden lg:block">
          <LandingHeroFotos sizes="100vw" objectPosition="center 35%" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl items-center px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:min-h-170 lg:pb-28 lg:pt-20">
          <div className={`min-w-0 max-w-160 lg:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)] ${ENTRADA}`}>
            <h1
              id="inicio-titulo"
              className="text-[length:calc(2.2rem*var(--escala-texto,1))] font-semibold leading-[1.02] tracking-[-0.04em] text-tinta sm:text-[length:calc(3.4rem*var(--escala-texto,1))] sm:leading-[0.98] md:text-[length:calc(4.2rem*var(--escala-texto,1))] lg:text-[length:calc(4.6rem*var(--escala-texto,1))] lg:text-white"
            >
              {/* El espacio entre bloques evita que se lea "Profesional27"; visualmente no cambia. */}
              <span className="block uppercase">Colegio Técnico Profesional</span>{" "}
              <span className="block text-oliva lg:text-[#d5e0c4]">27 de Abril</span>
            </h1>

            <p className="mt-6 text-xl font-medium leading-snug text-oliva-profundo lg:text-white sm:text-2xl">
              Educación técnica que transforma comunidades
            </p>

            <p className="mt-4 max-w-140 text-base leading-7 text-tinta/65 lg:text-white/90 sm:text-[length:calc(1.0625rem*var(--escala-texto,1))]">
              Formamos estudiantes con valores, conocimientos y habilidades
              prácticas para el trabajo, el emprendimiento y el desarrollo de
              nuestra región.
            </p>

            <div className="mt-5 flex items-start gap-2 text-sm font-medium text-tinta/55 lg:text-white/80">
              <MapPin className="mt-0.5 size-4 shrink-0 text-malva" aria-hidden />
              <span>Veintisiete de Abril, Santa Cruz, Guanacaste.</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3" data-no-leer>
              <a
                href="#nosotros"
                className="group inline-flex items-center gap-2 rounded-full bg-oliva px-7 py-3.5 text-sm font-semibold text-sobre-oliva shadow-[0_12px_28px_-12px_rgba(82,99,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing"
              >
                Conoce el colegio
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </a>

              <a
                href="#especialidades"
                className="inline-flex items-center rounded-full border border-tinta/12 bg-tarjeta/85 px-7 py-3.5 text-sm font-medium text-tinta/75 shadow-[0_5px_16px_rgba(37,38,36,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-oliva/25 hover:text-oliva focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing"
              >
                Nuestras especialidades
              </a>

              {/* Al final de la fila de botones: cabe sin crear otra línea, incluso a 320px. */}
              <BotonEscuchar
                etiqueta="Inicio"
                objetivo="inicio"
                className="self-center bg-tarjeta/85 shadow-[0_5px_16px_rgba(37,38,36,0.06)] backdrop-blur hover:bg-tarjeta"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Versión móvil y tablet de la fotografía */}
      <div className="relative mx-5 -mt-10 aspect-16/10 overflow-hidden rounded-[28px] border border-tinta/10 bg-tarjeta shadow-[0_20px_55px_rgba(37,38,36,0.14)] sm:mx-8 lg:hidden">
        <LandingHeroFotos sizes="92vw" objectPosition="center 35%" />
      </div>
    </section>
  );
}
