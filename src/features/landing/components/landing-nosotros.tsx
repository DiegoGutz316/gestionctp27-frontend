import Image from "next/image";

export function LandingNosotros() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-[var(--landing-background)] py-24 sm:py-28"
    >
      {/* Decoración suave */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-[#C7A35D]/8 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Texto */}
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Nosotros
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Nuestra historia
          </h2>

          <div className="mt-5 h-px w-12 bg-[#C7A35D]" />

          <p className="mt-6 text-base leading-relaxed text-[#252624]/65">
            El Colegio Técnico Profesional 27 de Abril inició sus labores en
            1974 como respuesta a la necesidad de brindar educación
            secundaria y formación técnica a los jóvenes de Veintisiete de
            Abril y comunidades cercanas del cantón de Santa Cruz. Desde sus
            primeros años, la institución ha mantenido una estrecha relación
            con el entorno rural y productivo de Guanacaste, ofreciendo una
            educación orientada al desarrollo de conocimientos, habilidades
            prácticas y valores que permitan a sus estudiantes contribuir al
            crecimiento de sus comunidades.
          </p>

          <p className="mt-4 text-base leading-relaxed text-[#252624]/65">
            A lo largo de su trayectoria, el CTP 27 de Abril ha evolucionado
            junto con las necesidades sociales, económicas y tecnológicas de
            la región. Su oferta educativa combina la formación académica con
            especialidades técnicas vinculadas a áreas como la producción
            agrícola y pecuaria, agroindustria, tecnología, industria
            alimentaria y servicios, fortaleciendo la preparación para el
            trabajo, el emprendimiento y la continuidad de estudios. Además,
            proyectos desarrollados en la institución reflejan su compromiso
            con la innovación, la sostenibilidad y la formación práctica de
            las nuevas generaciones.
          </p>
        </div>

        {/* Imagen */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -bottom-6 -right-6 hidden h-full w-full rounded-[28px] border border-[#52634D]/10 bg-[#52634D]/5 lg:block"
          />

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#252624]/8 bg-white shadow-[0_20px_55px_rgba(37,38,36,0.10)]">
            <Image
              src="/landing/historia/ctp-historia.jpg"
              alt="Fotografía institucional del Colegio Técnico Profesional 27 de Abril"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#252624]/25 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}