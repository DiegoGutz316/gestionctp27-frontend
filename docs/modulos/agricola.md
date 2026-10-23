# Feature Agrícola

**Ruta:** `src/features/agricola`  
**Permiso:** `AGRICOLA`  
**Propósito:** Ciclo productivo de camas — cultivos, siembras, tratamientos y cosechas.

## Sub-navegación (`AgricolaVistasNav`)

Camas · Cultivos · Siembras · Tratamientos · Cosechas

## Estructura

```
agricola/
  components/          camas + nav + filtros
  hooks|modelos|servicios|validacion/   # camas
  cultivo|siembra|tratamiento|cosecha/  # cada uno: components, hooks, models, servicios
```

## API

| Recurso | Endpoints |
|---------|-----------|
| Camas | `POST/GET /agricola/camas`, `GET/PATCH/DELETE /agricola/camas/:id` |
| Cultivos | `POST/GET /agricola/cultivos`, `GET/PATCH/DELETE /agricola/cultivos/:id` |
| Siembras | `POST/GET /agricola/siembras`, `GET .../:id`, `PATCH .../:id/finalizar` |
| Tratamientos | `POST/GET /agricola/tratamientos` |
| Cosechas | `POST/GET /agricola/cosechas` |

## Query keys

`["agricola","camas"]`, `cultivos`, `siembras`, `tratamientos`, `cosechas`.  
Finalizar siembra / registrar cosecha invalidan también camas (y siembras cuando aplica).

## Validaciones Zod (resumen)

| Dominio | Campos clave |
|---------|----------------|
| Cama | `codigo`, `ubicacion` ∈ {Invernadero 1, Invernadero 2}, `observaciones?` |
| Cultivo | `nombre`, `tipo` (HORTALIZA…OTRO), `descripcion?`; edit + `activo` |
| Siembra | `camaId`, `cultivoId`, `fechaSiembra` ≤ hoy, `cantidadSembrada`, `unidadSembrada` |
| Finalizar | `motivo` (PERDIDA\|PLAGA\|CLIMA\|ELIMINACION\|OTRO) + `detalle?` |
| Tratamiento | Si fertilización/tratamiento → `tipo`, `producto`, `cantidad`, `unidad` |
| Cosecha | `cantidadObtenida`, `unidadMedida` (KG\|UNIDADES; enteros si UNIDADES), `cerrarCiclo?` |

Estados de cama: `DISPONIBLE`, `EN_PREPARACION`, `SEMBRADA`, `EN_DESCANSO`, `MANTENIMIENTO`.

## Reglas UI

- Escritura con `MostrarSiPuede AGRICOLA COMPLETO`.
- Eliminar cama/cultivo: el backend responde 409 si hay historial (dialogos lo muestran).
- Filtros: camas `q`/`ubicacion`/`camaId`; cultivos `soloActivos`/`tipo`/`q`; siembras `cultivo`/`fecha`.

## Rutas

```
/dashboard/agricola
/dashboard/agricola/nuevo | /[id] | /[id]/editar
/dashboard/agricola/cultivos | /nuevo | /[id]/editar
/dashboard/agricola/siembras | /nueva | /[id]
/dashboard/agricola/tratamientos | /nuevo
/dashboard/agricola/cosechas | /nueva
```
