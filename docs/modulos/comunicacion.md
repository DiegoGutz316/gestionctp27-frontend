# Feature Comunicación (Avisos)

**Ruta:** `src/features/comunicacion`  
**Permiso:** módulo `REPORTES` (no hay feature `reportes/` en el FE)  
**Propósito:** Gestión de avisos institucionales en el dashboard y calendario público en la landing.

## Estructura

```
comunicacion/
  components/
  hooks/aviso-hooks.ts
  servicios/aviso.service.ts
  validacion/
  fecha-aviso.ts
```

## API

| Función | Método | Path |
|---------|--------|------|
| `consultarAvisos` | GET | `/comunicacion/avisos` |
| `registrar` / `editar` | POST / PATCH | `/comunicacion/avisos`, `/:id` |
| `desactivar` | PATCH | `/comunicacion/avisos/:id/desactivar` |
| Flyer | PUT multipart / DELETE | `/comunicacion/avisos/:id/flyer` |
| Flyer gestión | GET | `/comunicacion/avisos/:id/flyer/gestion` |
| Públicos | GET (sin cookie) | `/comunicacion/avisos/publicos` |

## Hooks

Key: `["comunicacion","avisos"]`.  
`useAvisos`, `useAvisosCalendario`, `useAviso`, mutaciones de alta/edición/desactivación, `useSrcFlyer`.

## Zod

`titulo` ≤ 150, `descripcion` ≤ 2000, `categoria` (`ACADEMICOS` \| `EVENTOS` \| `COMUNIDAD` \| `ADMINISTRATIVOS`), `fecha` (futura permitida), `estado` `ACTIVO` \| `INACTIVO`.

## Reglas UI

- Listado: LECTURA; crear/editar: COMPLETO (`MostrarSiPuede REPORTES`).
- Flyers de inactivos usan la ruta autenticada `/flyer/gestion`.
- Filtros: `estado` (TODOS\|ACTIVO\|INACTIVO), `q`, paginación.

## Rutas

```
/dashboard/comunicacion/avisos
/dashboard/comunicacion/avisos/nuevo
/dashboard/comunicacion/avisos/[id]/editar
```

Landing consume el listado público vía `useAvisosCalendario`.
