# Documentación técnica — Frontend GestiónCTP27

Interfaz web Next.js del sistema de gestión del **Colegio Técnico Profesional 27 de Abril**.

Este directorio documenta el stack, la arquitectura, la lógica de presentación y cada feature del frontend (`gestionctp27-frontend`). Complementa la documentación del backend en `gestionctp27-backend/docs/`.

## Índice

| Documento | Contenido |
|-----------|-----------|
| [Stack y arquitectura](./stack-y-arquitectura.md) | Herramientas, App Router, cliente HTTP, providers |
| [Lógica de negocio (UI)](./logica-de-negocio.md) | Auth, permisos, menú, flujos de pantalla |
| [Auth](./modulos/auth.md) | Login, sesión, guards, matriz de permisos |
| [Landing](./modulos/landing.md) | Sitio público institucional |
| [Dashboard](./modulos/dashboard.md) | Panel de inicio |
| [Usuarios](./modulos/usuarios.md) | Gestión de usuarios |
| [Agrícola](./modulos/agricola.md) | Camas, cultivos, siembras, tratamientos, cosechas |
| [Pecuaria](./modulos/pecuaria.md) | Animales, sanidad, producción, inventarios Excel |
| [Inventario](./modulos/inventario.md) | Productos, stock, movimientos |
| [Libro de caja](./modulos/libro-caja.md) | Colegio, departamentos, periodos, asientos |
| [Comunicación](./modulos/comunicacion.md) | Avisos (permiso REPORTES) |

## Contexto

El frontend consume la API NestJS (`NEXT_PUBLIC_API_URL`) con cookie httpOnly `ctp27_access_token`. No hay feature `reportes/` en el FE: el módulo de permisos `REPORTES` se usa para **Avisos**. Los reportes PDF/Excel de producción/inventario viven en el backend; en pecuaria y libro-caja hay exportaciones Excel generadas en el cliente.
