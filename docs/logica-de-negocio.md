# Lógica de negocio en la UI

La fuente de verdad de permisos y validaciones es el **backend**. El frontend refleja reglas para UX (ocultar botones, deshabilitar formularios, filtrar menú).

## Capas de protección

```
1. middleware.ts          → presencia de cookie
2. RequerirAuth           → perfil + permisos cargados
3. RequerirPermiso        → módulo / nivel en layout o página
4. MostrarSiPuede         → CTAs de escritura
5. PermisosGuard (API)    → autoridad real
```

## Niveles y módulos

Niveles: `NINGUNO` &lt; `LECTURA` &lt; `COMPLETO`.  
Helper: `puede(modulo, nivel = "LECTURA")` vía `cubre()`.

| Módulo FE | Uso en UI |
|-----------|-----------|
| PANEL | Sidebar “Dashboard” |
| USUARIOS | Gestión de usuarios |
| PECUARIA | Área pecuaria |
| AGRICOLA | Área agrícola |
| INVENTARIO | Bodega de productos |
| LIBRO_CAJA | Caja escolar |
| REPORTES | Avisos (comunicación) |

## Menú lateral (`AppSidebar`)

| Etiqueta | Ruta | Módulo |
|----------|------|--------|
| Dashboard | `/dashboard` | PANEL |
| Inventario | `/dashboard/inventario` | INVENTARIO |
| Libro de caja | `/dashboard/libro-caja` | LIBRO_CAJA |
| Área agrícola | `/dashboard/agricola` | AGRICOLA |
| Área pecuaria | `/dashboard/pecuaria` | PECUARIA |
| Avisos | `/dashboard/comunicacion/avisos` | REPORTES |
| Usuarios | `/dashboard/usuarios` | USUARIOS |

Ítems “Mi perfil” / “Configuración” existen en el menú de usuario pero **sin rutas**.

## Flujos de pantalla

### Sesión

1. Login → `POST /auth/login` → cookie → carga permisos → `/dashboard`
2. Logout → `POST /auth/logout` → limpia contexto → `/login`
3. Landing `/` no dispara fetch de sesión (`rutaSinSesion`)

### Patrón lectura / escritura

- Listados y detalle: `LECTURA` (layout o `RequerirPermiso`)
- Crear / editar / desactivar: `COMPLETO` + a menudo `MostrarSiPuede`
- Excepción inventario: botón “Registrar producto” solo si `rol === ADMINISTRADOR`

### Agrícola

Camas → Cultivos → Siembras → Tratamientos / Cosechas (sub-nav `AgricolaVistasNav`). Finalizar siembra o `cerrarCiclo` en cosecha invalidan queries de camas/siembras.

### Pecuaria

Animales (hub) → vacunas / desparasitaciones / salud en detalle; producción e inventarios Excel MEP (bovino / especies menores) en sub-nav.

### Inventario

Producto → configurar stock → entradas/salidas con `Idempotency-Key` → historial. Alerta visual `esStockBajo()`.

### Libro de caja

Colegio → departamentos → abrir periodo (fondos) → asientos (solo periodo `ABIERTO` + fondo `SOLICITADO`) → informe / Excel.

### Comunicación

Avisos en dashboard (gestión) y calendario público en landing (`/comunicacion/avisos/publicos`).

## Reglas UI destacadas

| Área | Regla |
|------|--------|
| Usuarios | No desactivarse a sí mismo; ocultar toggle `activo` en cuenta propia |
| Fechas | Validación Zod con tope “hoy” CR salvo avisos (pueden ser futuras) |
| Pecuaria animal | `tipoInventario` en form → se elimina al enviar; bovino exige VACA + categoría |
| Agrícola tratamiento | Producto/cantidad/unidad solo si actividad usa producto |
| Cosecha | `UNIDADES` ⇒ cantidad entera |
| Stock | Movimientos solo con config activa + existencia; `UNIDAD` ⇒ entero |
| Asientos | Ingreso XOR egreso; UI bloqueada si periodo cerrado o fondo pendiente |
| Dashboard widgets | No fetch si falta LECTURA del módulo correspondiente |

## Mapa feature ↔ rutas

| Feature | Prefijo de rutas |
|---------|------------------|
| landing | `/` |
| auth | `/login` |
| dashboard | `/dashboard` |
| usuarios | `/dashboard/usuarios/*` |
| inventario | `/dashboard/inventario/*` |
| libro-caja | `/dashboard/libro-caja/*` |
| agricola | `/dashboard/agricola/*` |
| pecuaria | `/dashboard/pecuaria/*` |
| comunicacion | `/dashboard/comunicacion/avisos/*` |
