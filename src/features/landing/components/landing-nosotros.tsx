import Image from "next/image";

export function LandingNosotros() {
  return (
    <section id="nosotros" className="bg-crema py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-malva">
            Nosotros
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-tinta sm:text-4xl">
            Nuestra historia
          </h2>

          <p className="mt-6 text-base leading-relaxed text-tinta/65">
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
          <p className="mt-4 text-base leading-relaxed text-tinta/65">
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

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-tinta/10">
          <Image
            src="/landing/historia/ctp-historia.jpg"
            alt="Fotografía institucional del Colegio Técnico Profesional 27 de Abril"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
