export function LandingCta() {
  return (
    <section id="contacto" className="bg-[#F7F5F0] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#252624]/10 bg-white px-8 py-14 text-center sm:px-16 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C7A35D]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#896A78]/10 blur-3xl"
          />

          <h2 className="relative text-2xl font-semibold tracking-tight text-[#252624] sm:text-3xl">
            Conoce el CTP 27 de Abril
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#252624]/60 sm:text-base">
            Educación técnica al servicio de nuestra comunidad.
          </p>

          <a
            href="#footer-contacto"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#252624] px-7 py-3.5 text-sm font-medium text-[#F7F5F0] transition-colors hover:bg-[#3a3c37]"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}
