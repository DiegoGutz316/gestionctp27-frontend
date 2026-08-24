import { LandingGaleria } from "./landing-galeria";

export function LandingHero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#F7F5F0]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-[#C7A35D]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[-10%] h-[380px] w-[380px] rounded-full bg-[#52634D]/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-[#252624]/15 bg-white/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#896A78]">
            Colegio Técnico Profesional
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-[#252624] sm:text-5xl lg:text-[3.4rem]">
            Colegio Técnico Profesional{" "}
            <span className="text-[#52634D]">27 de Abril</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#252624]/65 sm:text-lg">
            Educación técnica para nuestra comunidad, en Veintisiete de Abril,
            Santa Cruz, Guanacaste.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#nosotros"
              className="inline-flex items-center gap-2 rounded-full bg-[#52634D] px-6 py-3.5 text-sm font-medium text-[#F7F5F0] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52634D]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F0] active:brightness-95"
            >
              Conoce el colegio
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LandingGaleria />
        </div>
      </div>
    </section>
  );
}
