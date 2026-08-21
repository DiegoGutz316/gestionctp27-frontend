import Image from "next/image";

export function LandingInstitucional() {
  return (
    <section id="sistema" className="relative overflow-hidden bg-[#252624] py-24 text-[#F7F5F0] sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(247,245,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(247,245,240,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Image
          src="/escudo-ctp27.png"
          alt="Escudo CTP 27 de Abril"
          width={56}
          height={56}
          className="mx-auto h-14 w-14 object-contain opacity-90"
        />
        <p className="mt-8 text-xl font-medium leading-snug sm:text-2xl">
          Tecnología al servicio de la gestión educativa y productiva.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#F7F5F0]/60 sm:text-base">
          Gestión CTP 27 fue construido específicamente para el Colegio Técnico
          Profesional 27 de Abril, integrando los procesos agrícolas, pecuarios
          y administrativos que sostienen su labor educativa y productiva en
          un mismo sistema.
        </p>
      </div>
    </section>
  );
}
