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
  /** Punto de enfoque del recorte cuando la foto es vertical. */
  posicionFoto?: string;
};

export const ESPECIALIDADES: Especialidad[] = [
  {
    icono: Sprout,
    nombre: "Producción Agrícola y Pecuaria",
    descripcion:
      "Formación en manejo de cultivos, producción animal y procesos agropecuarios.",
    acento: "var(--acento-agro)",
    foto: "/landing/especialidades/produccion-pecuaria-campo.jpg",
    fotoAlt: "Estudiantes observando labores de manejo de ganado en el campo del colegio",
    posicionFoto: "center 45%",
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
    foto: "/landing/especialidades/cocina-panaderia.jpg",
    fotoAlt: "Estudiantes con uniforme de cocina junto a una producción de panadería",
  },
  {
    icono: Factory,
    nombre: "Agroindustria Alimentaria",
    descripcion: "Procesamiento y transformación de productos alimenticios.",
    acento: "var(--acento-agroindustria)",
    foto: "/landing/especialidades/agroindustria-carniceria.jpg",
    fotoAlt: "Estudiantes cortando carne en la práctica de agroindustria alimentaria",
    posicionFoto: "center 45%",
  },
  {
    icono: Microscope,
    nombre: "Inspección de la Industria Alimentaria",
    descripcion: "Control de calidad e inocuidad en procesos alimentarios.",
    acento: "var(--acento-inspeccion)",
    foto: "/landing/especialidades/inspeccion-laboratorio.jpg",
    fotoAlt: "Estudiante observando una muestra al microscopio en el laboratorio de inspección alimentaria",
    posicionFoto: "center 40%",
  },
];
