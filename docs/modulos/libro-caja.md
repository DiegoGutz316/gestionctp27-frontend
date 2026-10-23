# Feature Libro de caja

**Ruta:** `src/features/libro-caja`  
**Permiso:** `LIBRO_CAJA`  
**Propósito:** Datos del colegio, unidades (departamentos), periodos, fondos, asientos e informe económico (Excel cliente).

## Estructura

```
libro-caja/
  libro-caja-inicio.tsx, formato.ts
  colegio|departamento|periodo/
    components, hooks, models, servicios, validacion
  periodo/servicios/asiento.service.ts, informe-excel.ts
```

## API

| Recurso | Endpoints |
|---------|-----------|
| Colegio | GET/PUT `/libro-caja/colegio` |
| Departamentos | GET/POST `/departamentos`; GET/PATCH `/:id`; PATCH `/:id/desactivar` |
| Periodos | GET/POST `/periodos`; GET/PATCH `/:id`; POST `/:id/cerrar` |
| Fondo | POST `.../fondos/:fondoId/solicitar`; PATCH `.../informe` |
| Asientos | GET/POST `.../asientos`; PATCH/DELETE `.../asientos/:asientoId` |

## Hooks / keys

`["libro-caja","colegio"]`, `departamentos`, `periodos`.  
Asientos: `periodos + id + fondos + fondoId + asientos`. Mutaciones de depto también invalidan periodos.

## Zod

- **Colegio:** `nombre`, `numeroCuentaBancaria`, `entidadDeposito`
- **Depto:** `nombreUnidad`, `tipoActividad`
- **Abrir periodo:** `nombre`, `fechaInicio` ≤ `fechaFin`, `fondos[]` `{departamentoId, monto}`
- **Asiento:** `fecha`, `numeroFactura?`, `descripcion`, **ingresos XOR egresos**
- **Pie informe:** observaciones[3], director/presidente/tesorera + firmas, coordinador

Estados: periodo `ABIERTO` \| `CERRADO`; fondo `PENDIENTE` \| `SOLICITADO`.

## Reglas UI

- Layout LECTURA; crear/editar estructura COMPLETO.
- Asientos editables solo si periodo `ABIERTO` **y** fondo `SOLICITADO` **y** COMPLETO.
- Pie de informe: puede guardar quien tenga al menos LECTURA (incluye directora).
- Abrir periodo: un fondo por cada departamento activo seleccionado.

## Rutas

```
/dashboard/libro-caja
/dashboard/libro-caja/colegio/editar
/dashboard/libro-caja/departamentos | /nuevo | /[id]/editar
/dashboard/libro-caja/periodos | /nuevo | /[id] | /[id]/editar
/dashboard/libro-caja/periodos/[id]/fondos/[fondoId]
/dashboard/libro-caja/periodos/[id]/fondos/[fondoId]/informe
```

Hay un catch-all `[...slug]` como workaround de Turbopack para rutas profundas.
