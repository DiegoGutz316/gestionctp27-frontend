import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

const FOTO_HERO = "/landing/galeria/ctp-galeria-01.jpg";
const ALT_HERO = "Estudiantes del CTP 27 de Abril trabajando en el invernadero";

/** Entrada suave; `motion-reduce` la desactiva para quien pide menos movimiento. */
const ENTRADA =
  "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none";

export function LandingHero() {
  return (
    <section id="inicio" className="relative scroll-mt-16 overflow-hidden bg-landing">
      <div className="relative lg:min-h-[680px]">
        {/* Fotografía de fondo a todo el ancho, con degradado blanco hacia la izquierda */}
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src={FOTO_HERO}
            alt={ALT_HERO}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-landing from-[0%] via-landing/85 via-[38%] to-landing/0 to-[62%]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-landing/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl items-center px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:min-h-[680px] lg:pb-28 lg:pt-20">
          <div className={`min-w-0 max-w-[640px] ${ENTRADA}`}>
            <h1 className="text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-tinta sm:text-[3.4rem] sm:leading-[0.98] md:text-[4.2rem] lg:text-[4.6rem]">
              <span className="block uppercase">Colegio Técnico Profesional</span>
              <span className="block text-oliva">27 de Abril</span>
            </h1>

            <p className="mt-6 text-xl font-medium leading-snug text-oliva-profundo sm:text-2xl">
              Educación técnica que transforma comunidades
            </p>

            <p className="mt-4 max-w-[560px] text-base leading-7 text-tinta/65 sm:text-[17px]">
              Formamos estudiantes con valores, conocimientos y habilidades
              prácticas para el trabajo, el emprendimiento y el desarrollo de
              nuestra región.
            </p>

            <div className="mt-5 flex items-start gap-2 text-sm font-medium text-tinta/55">
              <MapPin className="mt-0.5 size-4 shrink-0 text-malva" aria-hidden />
              <span>Veintisiete de Abril, Santa Cruz, Guanacaste.</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
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
            </div>
          </div>
        </div>

      </div>

      {/* Versión móvil y tablet de la fotografía */}
      <div className="relative mx-5 -mt-10 aspect-[16/10] overflow-hidden rounded-[28px] border border-tinta/10 bg-tarjeta shadow-[0_20px_55px_rgba(37,38,36,0.14)] sm:mx-8 lg:hidden">
        <Image
          src={FOTO_HERO}
          alt={ALT_HERO}
          fill
          priority
          sizes="92vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
