import { ChefHat, Factory, Microscope, Monitor, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Datos institucionales compartidos por el hero, las estadísticas y las especialidades. */

export const ANIOS_TRAYECTORIA = "50+";
export const ESTUDIANTES_APROX = "630";
export const ANIO_INICIO = 1974;

export type Especialidad = {
  icono: LucideIcon;
  nombre: string;
  descripcion: string;
  acento: string;
  foto: string;
  fotoAlt: string;
};

export const ESPECIALIDADES: Especialidad[] = [
  {
    icono: Sprout,
    nombre: "Producción Agrícola y Pecuaria",
    descripcion:
      "Formación en manejo de cultivos, producción animal y procesos agropecuarios.",
    acento: "var(--acento-agro)",
    foto: "/landing/especialidades/produccion-agricola-pecuaria.jpg",
    fotoAlt: "Estudiante en labores de producción agrícola y pecuaria",
  },
  {
    icono: Monitor,
    nombre: "Diseño y Desarrollo Digital",
    descripcion: "Desarrollo de software, diseño digital y tecnologías web.",
    acento: "var(--acento-digital)",
    foto: "/landing/especialidades/diseno-desarrollo-digital.jpg",
    fotoAlt: "Persona trabajando en diseño y desarrollo digital",
  },
  {
    icono: ChefHat,
    nombre: "Gerencia y Producción de Cocina",
    descripcion: "Técnicas culinarias y gestión de servicios gastronómicos.",
    acento: "var(--acento-cocina)",
    foto: "/landing/especialidades/gerencia-produccion-cocina.jpg",
    fotoAlt: "Persona preparando alimentos en una cocina profesional",
  },
  {
    icono: Factory,
    nombre: "Agroindustria Alimentaria",
    descripcion: "Procesamiento y transformación de productos alimenticios.",
    acento: "var(--acento-agroindustria)",
    foto: "/landing/especialidades/agroindustria-alimentaria.jpg",
    fotoAlt: "Proceso de agroindustria alimentaria",
  },
  {
    icono: Microscope,
    nombre: "Inspección de la Industria Alimentaria",
    descripcion: "Control de calidad e inocuidad en procesos alimentarios.",
    acento: "var(--acento-inspeccion)",
    foto: "/landing/especialidades/inspeccion-industria-alimentaria.jpg",
    fotoAlt: "Inspección de calidad en la industria alimentaria",
  },
];
