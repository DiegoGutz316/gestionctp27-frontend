import Image from "next/image";

const PROYECTOS = [
  {
    numero: "01",
    nombre: "Agro27",
    descripcion:
      "[Contenido pendiente de reemplazar: descripción oficial del proyecto Agro27.]",
    src: "/landing/galeria/ctp-galeria-02.jpg",
    alt: "Estudiantes en la producción agrícola del colegio",
  },
  {
    numero: "02",
    nombre: "Producción agrícola institucional",
    descripcion:
      "[Contenido pendiente de reemplazar: detalle de los proyectos productivos agrícolas del colegio.]",
    src: "/landing/galeria/ctp-galeria-01.jpg",
    alt: "Estudiantes cosechando hortalizas en el invernadero institucional",
  },
  {
    numero: "03",
    nombre: "Proyectos estudiantiles y ferias",
    descripcion:
      "[Contenido pendiente de reemplazar: iniciativas y ferias institucionales destacadas.]",
    src: "/landing/galeria/ctp-galeria-04.jpg",
    alt: "Ejemplares del proyecto pecuario institucional",
  },
];

export function LandingProyectos() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Proyectos
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Proyectos destacados
          </h2>
        </div>

        <div className="mt-12 divide-y divide-[#252624]/10 border-t border-[#252624]/10">
          {PROYECTOS.map((proyecto) => (
            <div
              key={proyecto.numero}
              className="grid items-center gap-6 py-8 sm:grid-cols-[auto_1fr_auto] sm:gap-10"
            >
              <span className="text-3xl font-semibold tracking-tight text-[#C7A35D]">
                {proyecto.numero}
              </span>
              <div>
                <h3 className="text-lg font-medium text-[#252624]">{proyecto.nombre}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#252624]/60">
                  {proyecto.descripcion}
                </p>
              </div>
              <div className="relative h-24 w-full overflow-hidden rounded-xl border border-[#252624]/10 sm:h-20 sm:w-32">
                <Image
                  src={proyecto.src}
                  alt={proyecto.alt}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
