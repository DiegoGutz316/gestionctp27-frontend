# Feature Pecuaria

**Ruta:** `src/features/pecuaria`  
**Permiso:** `PECUARIA`  
**Propósito:** Animales, sanidad, producción e inventarios Excel estilo MEP.

## Sub-navegación

- Animales: `/dashboard/pecuaria`
- Inventario bovino / especies menores
- Producción

## Estructura

```
pecuaria/
  animal/          components, hooks, models, servicios, validacion
  salud/
  produccion/
  inventario/      Excel cliente (sin API de stock)
  components/      vacuna-*, desparasitacion-*, pecuaria-vistas-nav
  formato.ts
```

## API

| Dominio | Endpoints |
|---------|-----------|
| Animales | `POST/GET /pecuaria/animales`, `GET/PATCH /:id`, `PATCH /:id/desactivar` |
| Vacunas | `POST /pecuaria/vacunas`, `GET /pecuaria/vacunas/animal/:animalId` |
| Desparasitaciones | `POST /pecuaria/desparasitaciones`, `GET .../animales/:id/desparasitaciones` |
| Salud | `POST/GET /pecuaria/salud` (`animalId`) |
| Producción | `POST/GET /pecuaria/produccion` |

## Hooks / keys

`["pecuaria","animales"]`, `vacunas`, `desparasitaciones`, `salud`, `produccion`.

## Zod destacados

- **Animal:** `codigo`, `nombre`, `tipoInventario` (GANADO_BOVINO \| ESPECIES_MENORES — **se elimina en transform**), `especie`, `categoriaBovina?`, `raza`, `fechaNacimiento` ≤ hoy, `estado`. SuperRefine: bovino ⇒ VACA + categoría; menores ⇒ CHANCHO/GALLINA/POLLO/CABRA.
- **Vacuna / desparasitación / salud / producción:** fechas ≤ hoy; cantidad de producción &gt; 0 con ≤ 2 decimales.
- Condiciones de salud: `SANO`, `ENFERMO`, `HERIDO`, `EN_TRATAMIENTO`, `RECUPERACION`.
- Tipos producción: `LECHE`, `HUEVOS`, `CARNE`.

## UI

Listado → detalle (`animal-detalle` con historiales) → editar/desactivar.  
CTAs de alta con `MostrarSiPuede PECUARIA COMPLETO`.  
Inventarios Excel: generación cliente (`inventario-excel.ts` + logo MEP), usa animales + datos de colegio.

## Rutas

```
/dashboard/pecuaria | /nuevo | /[id] | /[id]/editar
/dashboard/pecuaria/vacunas/nueva
/dashboard/pecuaria/desparasitaciones/nueva
/dashboard/pecuaria/salud/nuevo
/dashboard/pecuaria/produccion | /nuevo
/dashboard/pecuaria/inventario/ganado-bovino
/dashboard/pecuaria/inventario/especies-menores
```
