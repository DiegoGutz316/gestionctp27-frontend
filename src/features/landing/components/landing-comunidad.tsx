import Image from "next/image";

const FOTOS = [
  { src: "/landing/galeria/ctp-galeria-04.jpg", alt: "Ejemplares del proyecto pecuario institucional" },
  { src: "/landing/galeria/ctp-galeria-01.jpg", alt: "Estudiantes en el invernadero institucional", objectPosition: "center top" },
  { src: "/landing/galeria/ctp-galeria-03.jpg", alt: "Áreas verdes y espacios institucionales del CTP 27 de Abril" },
  { src: "/landing/galeria/ctp-galeria-02.jpg", alt: "Estudiantes en la producción agrícola del colegio" },
  { src: "/landing/galeria/ctp-galeria-05.jpg", alt: "Crías en el área de producción pecuaria" },
];

export function LandingComunidad() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Comunidad
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Nuestra comunidad
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#252624]/65">
            Estudiantes, docentes y personal que dan vida a los espacios del
            colegio día a día.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {FOTOS.map((foto) => (
            <div
              key={foto.src}
              className="relative aspect-square overflow-hidden rounded-xl border border-[#252624]/10"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 640px) 33vw, 18vw"
                className="object-cover grayscale-[15%] transition-all duration-300 hover:grayscale-0"
                style={foto.objectPosition ? { objectPosition: foto.objectPosition } : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
