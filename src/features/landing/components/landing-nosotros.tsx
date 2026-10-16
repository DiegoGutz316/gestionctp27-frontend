import Image from "next/image";
import { Leaf } from "lucide-react";

import { ANIO_INICIO } from "../datos-institucionales";

/** Solo los hitos ya establecidos: no se agregan fechas históricas nuevas. */
const HITOS = [
  {
    etiqueta: String(ANIO_INICIO),
    titulo: "Inicio de labores",
    texto: "Nace el colegio para brindar educación secundaria y formación técnica en Veintisiete de Abril.",
  },
  {
    etiqueta: "Expansión",
    titulo: "Desarrollo de la oferta técnica",
    texto: "La institución amplía sus especialidades según las necesidades productivas de la región.",
  },
  {
    etiqueta: "Actualidad",
    titulo: "Formación integral y desarrollo regional",
    texto: "Una educación que combina conocimiento, práctica y valores al servicio de Guanacaste.",
  },
];

export function LandingNosotros() {
  return (
    <section
      id="nosotros"
      className="relative scroll-mt-20 overflow-hidden bg-landing py-24 sm:py-28"
    >
      <Leaf
        aria-hidden
        className="pointer-events-none absolute -left-6 top-16 size-40 -rotate-12 text-oliva/[0.06]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-malva">
            Nosotros
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-tinta sm:text-4xl">
            Nuestra historia
          </h2>

          <div className="mt-5 h-px w-12 bg-oro" />

          <p className="mt-8 text-base leading-[1.8] text-tinta/70">
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

          <p className="mt-5 text-base leading-[1.8] text-tinta/70">
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

          <ol className="relative mt-12 space-y-7 border-l border-oliva/20 pl-7">
            {HITOS.map((hito) => (
              <li key={hito.titulo} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[33px] top-1.5 size-3 rounded-full border-2 border-landing bg-oliva ring-1 ring-oliva/30"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-oro-profundo">
                  {hito.etiqueta}
                </p>
                <p className="mt-1 text-base font-medium text-tinta">{hito.titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-tinta/60">{hito.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* La fotografía es 4:3, así que el marco usa esa misma proporción y se ve completa */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-tinta/10 bg-tarjeta shadow-[0_24px_60px_-28px_rgba(37,38,36,0.35)]">
          <Image
            src="/landing/historia/ctp-historia.jpg"
            alt="Fotografía institucional del Colegio Técnico Profesional 27 de Abril"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
