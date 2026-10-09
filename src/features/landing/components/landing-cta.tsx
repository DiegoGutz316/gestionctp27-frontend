export function LandingCta() {
  return (
    <section id="contacto" className="bg-crema py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-tinta/10 bg-tarjeta px-8 py-14 text-center sm:px-16 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-oro/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-malva/10 blur-3xl"
          />

          <h2 className="relative text-2xl font-semibold tracking-tight text-tinta sm:text-3xl">
            Conoce el CTP 27 de Abril
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-tinta/60 sm:text-base">
            Educación técnica al servicio de nuestra comunidad.
          </p>

          <a
            href="#footer-contacto"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-banda px-7 py-3.5 text-sm font-medium text-sobre-oliva transition-colors hover:brightness-125"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}
