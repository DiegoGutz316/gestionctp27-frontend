import Image from "next/image";

import { BotonEscuchar } from "./boton-escuchar";

export function LandingIdentidad() {
  return (
    <section
      id="mision-vision"
      aria-labelledby="mision-vision-titulo"
      className="relative overflow-hidden bg-landing py-24 text-tinta sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(37,38,36,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,38,36,0.035)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(243,244,239,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,244,239,0.035)_1px,transparent_1px)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="mision-vision-titulo" className="sr-only">
          Misión y visión
        </h2>

        {/* El botón va en posición absoluta para no cambiar la altura de esta fila. */}
        <div className="relative">
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo del Colegio Técnico Profesional 27 de Abril"
            width={48}
            height={48}
            className="h-12 w-12 object-contain opacity-90"
          />
          <BotonEscuchar
            etiqueta="Misión y visión"
            objetivo="mision-vision"
            className="absolute top-0 right-0"
          />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-8">
          <div className="flex h-full flex-col rounded-2xl border border-tinta/10 bg-tarjeta/70 p-7 shadow-[0_12px_32px_rgba(37,38,36,0.05)] backdrop-blur-sm sm:p-8">
            <h3 className="text-xs font-medium uppercase tracking-widest text-oliva">
              Misión
            </h3>

            <p className="mt-4 text-base leading-relaxed text-tinta/75 sm:text-lg">
              Brindar una formación académica y técnica integral que permita
              a nuestros estudiantes desarrollar conocimientos, habilidades
              prácticas, valores y actitudes necesarias para desenvolverse en
              el ámbito laboral, continuar sus estudios y contribuir
              responsablemente al desarrollo de su comunidad.
            </p>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-tinta/10 bg-tarjeta/70 p-7 shadow-[0_12px_32px_rgba(37,38,36,0.05)] backdrop-blur-sm sm:p-8">
            <h3 className="text-xs font-medium uppercase tracking-widest text-malva">
              Visión
            </h3>

            <p className="mt-4 text-base leading-relaxed text-tinta/75 sm:text-lg">
              Ser una institución educativa técnica comprometida con la
              excelencia, la innovación y el desarrollo integral de sus
              estudiantes, capaz de responder a los cambios sociales,
              económicos, tecnológicos y ambientales, formando personas
              preparadas para aportar al desarrollo productivo y sostenible
              de Guanacaste.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
