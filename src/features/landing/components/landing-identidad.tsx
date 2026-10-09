import Image from "next/image";

import {
  Eye,
  GraduationCap,
  Leaf,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

const PRINCIPIOS = [
  {
    icono: GraduationCap,
    texto: "Formación integral",
  },
  {
    icono: Lightbulb,
    texto: "Innovación",
  },
  {
    icono: Users,
    texto: "Comunidad",
  },
  {
    icono: Leaf,
    texto: "Sostenibilidad",
  },
];

export function LandingIdentidad() {
  return (
    <section
      id="identidad"
      className="relative overflow-hidden bg-landing py-24 sm:py-28"
    >
      {/* Decoraciones suaves */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-44 size-[500px] rounded-full bg-oliva/8 blur-[120px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-44 size-[460px] rounded-full bg-oro/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-oliva/10 bg-tarjeta shadow-[0_10px_28px_rgba(37,38,36,0.05)]">
              <Image
                src="/escudo-ctp27.png"
                alt="Escudo CTP 27 de Abril"
                width={42}
                height={42}
                className="size-10 object-contain"
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-malva">
                Nuestra identidad
              </p>

              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-tinta sm:text-4xl">
                Lo que guía nuestra formación
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-tinta/55 sm:text-base">
            Principios que orientan el compromiso académico,
            técnico y humano del Colegio Técnico Profesional
            27 de Abril.
          </p>
        </div>

        {/* Misión y visión */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Misión */}
          <article className="group relative overflow-hidden rounded-[28px] border border-oliva/10 bg-tarjeta/85 p-7 shadow-[0_14px_40px_rgba(37,38,36,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(37,38,36,0.09)] sm:p-8">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 size-44 rounded-full bg-oliva/8 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-oliva/8 text-oliva">
                  <Target className="size-5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-tinta/20">
                  01
                </span>
              </div>

              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-oliva">
                Misión
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-tinta">
                Formar para crecer y aportar
              </h3>

              <div className="mt-5 h-px w-12 bg-oro" />

              <p className="mt-5 text-[15px] leading-7 text-tinta/60 sm:text-base">
                Brindar una formación académica y técnica integral
                que permita a nuestros estudiantes desarrollar
                conocimientos, habilidades prácticas, valores y
                actitudes necesarias para desenvolverse en el ámbito
                laboral, continuar sus estudios y contribuir
                responsablemente al desarrollo de su comunidad.
              </p>
            </div>
          </article>

          {/* Visión */}
          <article className="group relative overflow-hidden rounded-[28px] border border-malva/10 bg-tarjeta/85 p-7 shadow-[0_14px_40px_rgba(37,38,36,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(37,38,36,0.09)] sm:p-8">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 size-44 rounded-full bg-malva/8 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-malva/8 text-malva">
                  <Eye className="size-5" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-tinta/20">
                  02
                </span>
              </div>

              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-malva">
                Visión
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-tinta">
                Preparar para el futuro
              </h3>

              <div className="mt-5 h-px w-12 bg-oro" />

              <p className="mt-5 text-[15px] leading-7 text-tinta/60 sm:text-base">
                Ser una institución educativa técnica comprometida
                con la excelencia, la innovación y el desarrollo
                integral de sus estudiantes, capaz de responder a los
                cambios sociales, económicos, tecnológicos y
                ambientales, formando personas preparadas para aportar
                al desarrollo productivo y sostenible de Guanacaste.
              </p>
            </div>
          </article>
        </div>

        {/* Principios */}
        <div className="mt-8 border-t border-tinta/10 pt-8">
          <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-tinta/35">
            Principios presentes en nuestra formación
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPIOS.map(
              ({
                icono: Icono,
                texto,
              }) => (
                <div
                  key={texto}
                  className="flex items-center gap-3 rounded-2xl border border-tinta/10 bg-tarjeta/70 px-4 py-3.5 shadow-[0_8px_24px_rgba(37,38,36,0.035)]"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-oliva/8 text-oliva">
                    <Icono className="size-3.5" />
                  </div>

                  <span className="text-sm font-medium text-tinta/60">
                    {texto}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
