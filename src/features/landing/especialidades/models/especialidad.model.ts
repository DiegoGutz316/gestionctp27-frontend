import {
  BookOpen,
  ChefHat,
  Factory,
  Leaf,
  Microscope,
  Monitor,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const ICONOS_ESPECIALIDAD = [
  "SPROUT",
  "MONITOR",
  "CHEF_HAT",
  "FACTORY",
  "MICROSCOPE",
  "LEAF",
  "WRENCH",
  "BOOK",
] as const;

export type IconoEspecialidad = (typeof ICONOS_ESPECIALIDAD)[number];

export const ETIQUETA_ICONO: Record<IconoEspecialidad, string> = {
  SPROUT: "Agricultura",
  MONITOR: "Digital",
  CHEF_HAT: "Cocina",
  FACTORY: "Agroindustria",
  MICROSCOPE: "Inspección",
  LEAF: "Hoja",
  WRENCH: "Técnica",
  BOOK: "Libro",
};

export const ICONO_LUCIDE: Record<IconoEspecialidad, LucideIcon> = {
  SPROUT: Sprout,
  MONITOR: Monitor,
  CHEF_HAT: ChefHat,
  FACTORY: Factory,
  MICROSCOPE: Microscope,
  LEAF: Leaf,
  WRENCH: Wrench,
  BOOK: BookOpen,
};

export const ACENTOS_ESPECIALIDAD = [
  { value: "var(--acento-agro)", label: "Agrícola" },
  { value: "var(--acento-digital)", label: "Digital" },
  { value: "var(--acento-cocina)", label: "Cocina" },
  { value: "var(--acento-agroindustria)", label: "Agroindustria" },
  { value: "var(--acento-inspeccion)", label: "Inspección" },
] as const;
