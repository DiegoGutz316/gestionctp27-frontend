import Image from "next/image";
import { GraduationCap, HeartHandshake, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FOTO = "/landing/galeria/ctp-galeria-02.jpg";

const PILARES: { icono: LucideIcon; titulo: string }[] = [
  { icono: GraduationCap, titulo: "Formación de calidad" },
  { icono: Sprout, titulo: "Enfoque práctico y productivo" },
  { icono: HeartHandshake, titulo: "Compromiso con la comunidad" },
];

export function LandingProposito() {
  return (
    <section
      aria-labelledby="proposito-titulo"
      className="relative scroll-mt-20 overflow-hidden bg-pie text-pie-texto"
    >
      <div className="absolute inset-0">
        <Image
          src={FOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pie via-pie/90 to-pie/55" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pie-texto/70">
            Propósito institucional
          </span>
          <h2
            id="proposito-titulo"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]"
          >
            Formamos para el trabajo, el emprendimiento y el futuro.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-pie-texto/75 sm:text-lg">
            Con una educación técnica de calidad, contribuimos al desarrollo de
            nuestra comunidad y al bienestar de las nuevas generaciones.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {PILARES.map((pilar) => (
            <li
              key={pilar.titulo}
              className="flex items-center gap-4 rounded-2xl border border-pie-texto/15 bg-pie-texto/[0.06] px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-pie-texto/25">
                <pilar.icono className="size-5" aria-hidden />
              </div>
              <p className="text-sm font-medium leading-snug sm:text-base">{pilar.titulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
