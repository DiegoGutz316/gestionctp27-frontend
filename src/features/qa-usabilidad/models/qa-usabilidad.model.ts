export type ModuloUsab =
  | "LIBRO_CAJA"
  | "PECUARIA"
  | "AGRICOLA"
  | "REPORTES_AVISOS";

export type ResultadoUsab =
  | "COMPLETADA_SIN_AYUDA"
  | "COMPLETADA_CON_DIFICULTAD"
  | "COMPLETADA_CON_AYUDA"
  | "NO_COMPLETADA"
  | "BLOQUEADA_POR_ENTORNO";

export const ETIQUETA_RESULTADO: Record<ResultadoUsab, string> = {
  COMPLETADA_SIN_AYUDA: "Completada sin ayuda",
  COMPLETADA_CON_DIFICULTAD: "Completada con dificultad",
  COMPLETADA_CON_AYUDA: "Completada con ayuda",
  NO_COMPLETADA: "No completada",
  BLOQUEADA_POR_ENTORNO: "Bloqueada por problema técnico",
};

export const ETIQUETA_MODULO: Record<ModuloUsab, string> = {
  LIBRO_CAJA: "Libro de Caja",
  PECUARIA: "Gestión Pecuaria",
  AGRICOLA: "Gestión Agrícola",
  REPORTES_AVISOS: "Reportes y Avisos",
};

export type RolPerfilParticipante =
  | "DOCENTE_PECUARIO"
  | "DOCENTE_AGRICOLA"
  | "DIRECTORA"
  | "OTRO";

export type PruebaUsab = {
  codigo: string;
  modulo: ModuloUsab;
  nombre: string;
  objetivo: string;
  instruccion: string;
  resultadoEsperado: string;
};

export type CatalogoUsab = {
  totalDefinidas: number;
  porModulo: Record<ModuloUsab, number>;
  pruebas: PruebaUsab[];
  pilotoTecnico: {
    origen: string;
    descripcion: string;
    referencia: string;
  };
  nota: string;
};

export type ResumenUsab = {
  pruebasDefinidas: number;
  sesionesReales: number;
  sesionesFinalizadas: number;
  participantes: number;
  evidencias: number;
  pruebasConAlMenosUnaSesion: number;
  pruebasPendientesSinSesion: string[];
  resultadosFinalizados: Record<string, number>;
  pilotoTecnico: CatalogoUsab["pilotoTecnico"];
  porModulo: Record<ModuloUsab, number>;
};

export type ParticipanteUsab = {
  id: number;
  codigo: string;
  rolPerfil: RolPerfilParticipante | string;
  notas: string | null;
  creadoEn: string;
};

export type EvidenciaUsab = {
  id: number;
  nombreArchivo: string;
  mime: string;
  tamanoBytes: number;
  subidoEn: string;
};

export type SesionUsab = {
  id: number;
  pruebaCodigo: string;
  prueba: PruebaUsab | null;
  participante: {
    id: number;
    codigo: string;
    rolPerfil: string;
  };
  fechaEjecucion: string;
  horaInicio: string | null;
  horaFin: string | null;
  tiempoMinutos: number | null;
  resultado: ResultadoUsab | null;
  etiquetaResultado: string | null;
  errores: number;
  ayudas: number;
  observaciones: string | null;
  estado: "BORRADOR" | "FINALIZADA";
  origen: string;
  registradoEn: string;
  registradoPor: string;
  evidencias: EvidenciaUsab[];
  historial?: Array<{
    id: number;
    accion: string;
    detalle: Record<string, unknown>;
    ocurridoEn: string;
    actorId: string;
  }>;
};
