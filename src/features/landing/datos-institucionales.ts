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
    fotoAlt: "Estudiantes en el corral observan reses acostadas durante una práctica de manejo de ganado",
    posicionFoto: "center 45%",
  },
  {
    icono: Monitor,
    nombre: "Diseño y Desarrollo Digital",
    descripcion: "Desarrollo de software, diseño digital y tecnologías web.",
    acento: "var(--acento-digital)",
    foto: "/landing/especialidades/diseno-desarrollo-digital.jpg",
    fotoAlt: "Computadora portátil sobre una mesa, con código de programación en la pantalla",
  },
  {
    icono: ChefHat,
    nombre: "Gerencia y Producción de Cocina",
    descripcion: "Técnicas culinarias y gestión de servicios gastronómicos.",
    acento: "var(--acento-cocina)",
    foto: "/landing/especialidades/cocina-panaderia.jpg",
    fotoAlt: "Grupo de estudiantes con gorro y uniforme blanco junto a una mesa llena de panes recién horneados",
  },
  {
    icono: Factory,
    nombre: "Agroindustria Alimentaria",
    descripcion: "Procesamiento y transformación de productos alimenticios.",
    acento: "var(--acento-agroindustria)",
    foto: "/landing/especialidades/agroindustria-carniceria.jpg",
    fotoAlt: "Estudiantes con delantal y cubrebocas cortan carne sobre mesas de acero en la sala de práctica",
    posicionFoto: "center 45%",
  },
  {
    icono: Microscope,
    nombre: "Inspección de la Industria Alimentaria",
    descripcion: "Control de calidad e inocuidad en procesos alimentarios.",
    acento: "var(--acento-inspeccion)",
    foto: "/landing/especialidades/inspeccion-laboratorio.jpg",
    fotoAlt: "Estudiante con gabacha mira por un microscopio en el laboratorio, entre frascos de reactivos",
    posicionFoto: "center 40%",
  },
];
