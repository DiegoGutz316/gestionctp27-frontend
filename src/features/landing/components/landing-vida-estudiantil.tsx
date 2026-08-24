import Image from "next/image";

export function LandingVidaEstudiantil() {
  return (
    <section id="vida-estudiantil" className="bg-[#F7F5F0] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Vida estudiantil
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Una educación que trasciende el aula
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#252624]/65">
            Nuestros estudiantes viven la formación técnica en el campo, los
            laboratorios y los espacios productivos del colegio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl border border-[#252624]/10 sm:aspect-auto">
            <Image
              src="/landing/galeria/ctp-galeria-01.jpg"
              alt="Estudiantes cosechando hortalizas en el invernadero institucional"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
              style={{ objectPosition: "center top" }}
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#252624]/10">
            <Image
              src="/landing/galeria/ctp-galeria-02.jpg"
              alt="Grupo de estudiantes en la producción agrícola del colegio"
              fill
              sizes="(max-width: 1024px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#252624]/10">
            <Image
              src="/landing/galeria/ctp-galeria-04.jpg"
              alt="Ejemplares porcinos del proyecto pecuario institucional"
              fill
              sizes="(max-width: 1024px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl border border-[#252624]/10 sm:col-span-2 sm:aspect-auto">
            <Image
              src="/landing/galeria/ctp-galeria-05.jpg"
              alt="Crías en el área de producción pecuaria del colegio"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
