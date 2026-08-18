/**
 * Backlog 1.6: permisos por rol.
 *
 * Estos valores deben coincidir con los enums del backend
 * (src/modules/auth/enums/modulo-sistema.enum.ts y nivel-permiso.enum.ts).
 * La matriz real vive en la tabla `permisos_rol`; aquí solo se tipa la
 * respuesta de GET /auth/permisos.
 */

export const MODULOS_SISTEMA = [
  "PANEL",
  "USUARIOS",
  "PECUARIA",
  "AGRICOLA",
  "INVENTARIO",
  "REPORTES",
] as const;

export type ModuloSistema = (typeof MODULOS_SISTEMA)[number];

export type NivelPermiso = "NINGUNO" | "LECTURA" | "COMPLETO";

export type MatrizPermisos = Record<ModuloSistema, NivelPermiso>;

export type RespuestaPermisos = {
  rol: string;
  permisos: MatrizPermisos;
};

const JERARQUIA: Record<NivelPermiso, number> = {
  NINGUNO: 0,
  LECTURA: 1,
  COMPLETO: 2,
};

/** true si `nivelAsignado` alcanza (o supera) el `nivelRequerido`. */
export function cubre(
  nivelAsignado: NivelPermiso,
  nivelRequerido: NivelPermiso,
): boolean {
  return JERARQUIA[nivelAsignado] >= JERARQUIA[nivelRequerido];
}

/** Matriz sin acceso a nada. Se usa mientras carga y si la consulta falla. */
export function matrizVacia(): MatrizPermisos {
  return MODULOS_SISTEMA.reduce((matriz, modulo) => {
    matriz[modulo] = "NINGUNO";
    return matriz;
  }, {} as MatrizPermisos);
}

export const ETIQUETA_MODULO: Record<ModuloSistema, string> = {
  PANEL: "Panel principal",
  USUARIOS: "Administración de usuarios",
  PECUARIA: "Gestión pecuaria",
  AGRICOLA: "Gestión agrícola",
  INVENTARIO: "Inventario e insumos",
  REPORTES: "Reportes",
};
