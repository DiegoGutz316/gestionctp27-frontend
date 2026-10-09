import Image from "next/image";

export function LandingIdentidad() {
  return (
    <section className="relative overflow-hidden bg-banda py-24 text-[#F7F5F0] sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(247,245,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(247,245,240,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Image
          src="/escudo-ctp27.png"
          alt="Escudo CTP 27 de Abril"
          width={48}
          height={48}
          className="h-12 w-12 object-contain opacity-90"
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-8">
          <div className="flex h-full flex-col rounded-2xl border border-[#F7F5F0]/10 bg-[#F7F5F0]/[0.04] p-7 sm:p-8">
            <span className="text-xs font-medium uppercase tracking-widest text-[#F7F5F0]/50">
              Misión
            </span>
            <p className="mt-4 text-base leading-relaxed text-[#F7F5F0]/80 sm:text-lg">
              Brindar una formación académica y técnica integral que permita
              a nuestros estudiantes desarrollar conocimientos, habilidades
              prácticas, valores y actitudes necesarias para desenvolverse en
              el ámbito laboral, continuar sus estudios y contribuir
              responsablemente al desarrollo de su comunidad.
            </p>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-[#F7F5F0]/10 bg-[#F7F5F0]/[0.04] p-7 sm:p-8">
            <span className="text-xs font-medium uppercase tracking-widest text-[#F7F5F0]/50">
              Visión
            </span>
            <p className="mt-4 text-base leading-relaxed text-[#F7F5F0]/80 sm:text-lg">
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
