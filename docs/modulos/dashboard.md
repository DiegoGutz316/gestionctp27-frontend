# Feature Dashboard

**Ruta:** `src/features/dashboard`  
**Propósito:** Panel de inicio tras autenticarse — métricas, distribución de inventario, alertas y widget de avisos.

## Estructura

Solo `components/` (p. ej. `DashboardInicio`). No tiene API propia: compone hooks de otras features.

## Datos

| Widget | Fuente | Condición |
|--------|--------|-----------|
| Productos / stock bajo | `useProductos` + `esStockBajo` | `puede("INVENTARIO")` |
| Usuarios | `useUsuarios` | `puede("USUARIOS")` |
| Avisos | `DashboardAvisos` / comunicacion | `puede("REPORTES")` |

## Ruta

`/dashboard` → `DashboardInicio` (protegido por `RequerirAuth` del layout).

## Nota

El permiso de backend `PANEL` filtra el ítem del sidebar; el módulo Nest `DashboardModule` sigue vacío — el panel actual es 100 % composición de cliente.
