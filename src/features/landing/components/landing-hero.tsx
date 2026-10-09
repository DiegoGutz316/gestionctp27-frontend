import Image from "next/image";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

export function LandingHero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[var(--landing-background)]"
    >
      <div className="relative min-h-[650px]">
        {/* =========================================
            IMAGEN DE FONDO
            ========================================= */}
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/landing/galeria/ctp-galeria-01.jpg"
            alt="Estudiantes del CTP 27 de Abril trabajando en el invernadero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center center",
            }}
          />

          {/* Tinte institucional muy suave */}
          <div className="absolute inset-0 bg-[#52634D]/5" />

          {/* 
            Transición desde el fondo base de la landing
            hacia la fotografía.
          */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EEF2EA] from-[0%] via-[#EEF2EA]/95 via-[32%] to-[#EEF2EA]/0 to-[72%]" />

          {/* Suavizado inferior */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#EEF2EA]/35 to-transparent" />
        </div>

        {/* =========================================
            DECORACIÓN MUY SUAVE
            ========================================= */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/2 size-[480px] -translate-y-1/2 rounded-full bg-[#52634D]/5 blur-[130px]"
        />

        {/* =========================================
            CONTENIDO
            ========================================= */}
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-5 pb-24 pt-16 sm:px-8 lg:pb-28 lg:pt-20">
          <div className="max-w-[640px]">
            <h1 className="text-[3.35rem] font-semibold leading-[0.97] tracking-[-0.05em] text-[#252624] sm:text-[4.2rem] lg:text-[4.8rem]">
              Colegio Técnico

              <span className="block">
                Profesional{" "}

                <span className="text-[#52634D]">
                  27 de Abril
                </span>
              </span>
            </h1>

            <p className="mt-8 max-w-[540px] text-base leading-7 text-[#252624]/58 sm:text-[17px]">
              Educación técnica para
              nuestra comunidad, en
              Veintisiete de Abril,
              Santa Cruz, Guanacaste.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#252624]/48">
              <MapPin className="size-4 shrink-0 text-[#896A78]" />

              <span>
                Veintisiete de Abril ·
                Santa Cruz · Guanacaste
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#nosotros"
                className="inline-flex items-center gap-2 rounded-full bg-[#52634D] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(82,99,77,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#465641] hover:shadow-[0_16px_34px_rgba(82,99,77,0.25)]"
              >
                Conoce el colegio

                <ArrowRight className="size-4" />
              </a>

              <a
                href="#especialidades"
                className="inline-flex items-center rounded-full border border-[#252624]/10 bg-white/85 px-7 py-3.5 text-sm font-medium text-[#252624]/65 shadow-[0_5px_16px_rgba(37,38,36,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#52634D]/20 hover:bg-white hover:text-[#52634D]"
              >
                Ver especialidades
              </a>
            </div>
          </div>
        </div>

        {/* =========================================
            VERSIÓN MÓVIL DE LA FOTOGRAFÍA
            ========================================= */}
        <div className="relative mx-5 -mt-14 aspect-[16/10] overflow-hidden rounded-[28px] border border-[#252624]/8 bg-white shadow-[0_20px_55px_rgba(37,38,36,0.14)] sm:mx-8 lg:hidden">
          <Image
            src="/landing/galeria/ctp-galeria-01.jpg"
            alt="Estudiantes del CTP 27 de Abril trabajando en el invernadero"
            fill
            priority
            sizes="92vw"
            className="object-cover"
            style={{
              objectPosition: "center center",
            }}
          />
        </div>
      </div>
    </section>
  );
}