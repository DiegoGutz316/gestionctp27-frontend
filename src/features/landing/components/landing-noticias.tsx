import Image from "next/image";

const NOTICIAS = [
  {
    src: "/landing/galeria/ctp-galeria-03.jpg",
    alt: "Áreas verdes y espacios institucionales del CTP 27 de Abril",
    etiqueta: "Ejemplo",
    titulo: "[Titular de ejemplo — contenido pendiente de reemplazar]",
    resumen: "[Espacio reservado para una noticia o actividad real del colegio.]",
  },
  {
    src: "/landing/galeria/ctp-galeria-02.jpg",
    alt: "Grupo de estudiantes en la producción agrícola del colegio",
    etiqueta: "Ejemplo",
    titulo: "[Titular de ejemplo — contenido pendiente de reemplazar]",
    resumen: "[Espacio reservado para una noticia o actividad real del colegio.]",
  },
  {
    src: "/landing/galeria/ctp-galeria-05.jpg",
    alt: "Crías en el área de producción pecuaria del colegio",
    etiqueta: "Ejemplo",
    titulo: "[Titular de ejemplo — contenido pendiente de reemplazar]",
    resumen: "[Espacio reservado para una noticia o actividad real del colegio.]",
  },
];

export function LandingNoticias() {
  return (
    <section id="noticias" className="bg-[#F7F5F0] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Noticias
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Noticias y actividades
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#252624]/50">
            Sección de ejemplo: aún no existe una fuente de noticias real
            conectada a esta landing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {NOTICIAS.map((noticia, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border border-[#252624]/10 bg-white"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={noticia.src}
                  alt={noticia.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-widest text-[#C7A35D]">
                  {noticia.etiqueta}
                </span>
                <h3 className="mt-2 text-base font-medium text-[#252624]">
                  {noticia.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#252624]/55">
                  {noticia.resumen}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
