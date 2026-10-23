# Feature Usuarios

**Ruta:** `src/features/usuarios`  
**Permiso:** `USUARIOS` (layout `app/dashboard/usuarios/layout.tsx`)  
**Propósito:** Listar, crear, editar y desactivar usuarios.

## API

| Función | Método | Path |
|---------|--------|------|
| `listarUsuarios` | GET | `/usuarios` |
| `crearUsuario` | POST | `/usuarios` |
| `obtenerUsuario` | GET | `/usuarios/:id` |
| `editarUsuario` | PATCH | `/usuarios/:id` |
| `desactivarUsuario` | PATCH | `/usuarios/:id/desactivar` |

Query lista: `pagina`, `limite`, `q`, `rol`, `activo`, `order`.

## Hooks

Query key base: `["usuarios"]`.  
`useUsuarios`, `useUsuario`, `useCrearUsuario`, `useEditarUsuario`, `useDesactivarUsuario` (invalida la key).

## Zod

- **Crear:** `nombre`, `correo`, `contrasena` (8–72), `rol`, `activo?`
- **Editar:** + `activo` requerido; `contrasena` vacía u ≥ 8 (vacía no se envía)
- **Desactivar:** `confirmar === true`
- Roles: `ADMINISTRADOR` \| `DIRECTORA` \| `DOCENTE_PECUARIO` \| `DOCENTE_AGRICOLA` \| `ESTUDIANTE`

## UI

`UsuariosGestion` (filtros + tabla), `UsuarioForm` / `UsuarioEditarForm`, `UsuarioDesactivarDialog`.

## Reglas UI

- No desactivar la propia cuenta en la tabla.
- En edición propia se oculta el control de `activo`.

## Rutas

`/dashboard/usuarios`, `/nuevo`, `/[id]/editar`
