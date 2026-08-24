import Image from "next/image";
import { ChefHat, Factory, Microscope, Monitor, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Especialidad = {
  icono: LucideIcon;
  nombre: string;
  descripcion: string;
  acento: string;
  className: string;
  foto: string;
  fotoAlt: string;
  objectPosition?: string;
};

const ESPECIALIDADES: Especialidad[] = [
  {
    icono: Sprout,
    nombre: "Producción Agrícola y Pecuaria",
    descripcion:
      "Formación en manejo de cultivos, producción animal y procesos agropecuarios.",
    acento: "#52634D",
    className: "lg:col-span-2 lg:row-span-2",
    foto: "/landing/especialidades/produccion-agricola-pecuaria.jpg",
    fotoAlt: "Estudiante en labores de producción agrícola y pecuaria",
  },
  {
    icono: Monitor,
    nombre: "Diseño y Desarrollo Digital",
    descripcion: "Desarrollo de software, diseño digital y tecnologías web.",
    acento: "#896A78",
    className: "lg:col-span-2",
    foto: "/landing/especialidades/diseno-desarrollo-digital.jpg",
    fotoAlt: "Persona trabajando en diseño y desarrollo digital",
  },
  {
    icono: ChefHat,
    nombre: "Gerencia y Producción de Cocina",
    descripcion: "Técnicas culinarias y gestión de servicios gastronómicos.",
    acento: "#C76F57",
    className: "",
    foto: "/landing/especialidades/gerencia-produccion-cocina.jpg",
    fotoAlt: "Persona preparando alimentos en una cocina profesional",
  },
  {
    icono: Factory,
    nombre: "Agroindustria Alimentaria",
    descripcion: "Procesamiento y transformación de productos alimenticios.",
    acento: "#C7A35D",
    className: "",
    foto: "/landing/especialidades/agroindustria-alimentaria.jpg",
    fotoAlt: "Proceso de agroindustria alimentaria",
  },
  {
    icono: Microscope,
    nombre: "Inspección de la Industria Alimentaria",
    descripcion: "Control de calidad e inocuidad en procesos alimentarios.",
    acento: "#252624",
    className: "lg:col-span-2",
    foto: "/landing/especialidades/inspeccion-industria-alimentaria.jpg",
    fotoAlt: "Inspección de calidad en la industria alimentaria",
  },
];

export function LandingEspecialidades() {
  return (
    <section id="especialidades" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Especialidades
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Nuestras especialidades técnicas
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {ESPECIALIDADES.map((especialidad) => (
            <div
              key={especialidad.nombre}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#252624]/10 bg-[#F7F5F0] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(37,38,36,0.25)] ${especialidad.className}`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={especialidad.foto}
                  alt={especialidad.fotoAlt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  style={
                    especialidad.objectPosition
                      ? { objectPosition: especialidad.objectPosition }
                      : undefined
                  }
                />
              </div>

              <div className="relative flex flex-1 flex-col p-6">
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.07] transition-opacity group-hover:opacity-[0.12]"
                  style={{ backgroundColor: especialidad.acento }}
                />
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${especialidad.acento}1A` }}
                >
                  <especialidad.icono className="h-5 w-5" style={{ color: especialidad.acento }} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-[#252624]">
                  {especialidad.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#252624]/60">
                  {especialidad.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
