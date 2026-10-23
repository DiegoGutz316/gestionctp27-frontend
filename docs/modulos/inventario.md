# Feature Inventario

**Ruta:** `src/features/inventario`  
**Permiso:** `INVENTARIO` (layout LECTURA; altas/ediciones COMPLETO)  
**Propósito:** Catálogo de productos, configuración de stock, entradas/salidas e historial.

## Estructura

```
inventario/
  producto/   components, hooks, models, servicios, validacion
  stock/      components, hooks, models, servicios, validacion
```

## API

| Función | Método | Path |
|---------|--------|------|
| Productos | GET/POST `/inventario/productos`; GET/PATCH `/productos/:id` |
| Config stock | POST `/configuracion-stock`; GET/PATCH `/configuracion-stock/:id` |
| Existencia | GET `/existencias/:id` |
| Entrada / salida | POST `.../existencias/:id/entradas\|salidas` + `Idempotency-Key` |
| Movimientos | GET `/existencias/movimientos` |

## Hooks / keys

`["inventario","productos"]`, `configuracion-stock`, `existencias`, `movimientos`.  
Entrada/salida invalidan productos + existencias + movimientos.

## Zod

- **Producto:** `nombre`, `tipoProducto` (INSUMO\|HERRAMIENTA\|EQUIPO), `unidadMedida`, `departamento`, `ubicacion`
- **Config:** `productoId`, `stockMinimo` ≥ 0, `precio` ≥ 0 (máx. 2 decimales)
- **Entrada:** `cantidad`, `fecha` ≤ hoy, `origen`
- **Salida:** `cantidad`, `fecha`, `motivo`  
  Si unidad = `UNIDAD` ⇒ cantidad entera.

Helper UI: `esStockBajo()` — config activa y `cantidadActual ≤ stockMinimo`.

## Reglas UI

- Layout: LECTURA; páginas de crear/editar stock: COMPLETO.
- Botón **“Registrar producto”** solo si `usuario.rol === "ADMINISTRADOR"` (más estricto que COMPLETO).
- Movimientos requieren config activa e inventario presente.
- Filtros: nombre, tipo, departamento, ubicación, orden `NOMBRE` \| `CATEGORIA`.

## Rutas

```
/dashboard/inventario
/dashboard/inventario/nuevo
/dashboard/inventario/[id] | /[id]/editar
/dashboard/inventario/[id]/stock/nuevo
/dashboard/inventario/stock/[id]/editar
```
