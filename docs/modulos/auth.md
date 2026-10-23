# Feature Auth

**Ruta:** `src/features/auth`  
**Propósito:** Sesión, login, matriz de permisos y guards de ruta/UI.

## Estructura

```
auth/
  components/   login-form, requerir-auth, requerir-permiso,
                mostrar-si-puede, acceso-denegado
  context/      auth-context.tsx
  models/       auth.model.ts, permisos.model.ts
  servicios/    auth.service.ts
  validacion/   auth.validacion.ts
```

## API

| Función | Método | Path |
|---------|--------|------|
| `iniciarSesion` | POST | `/auth/login` |
| `cerrarSesion` | POST | `/auth/logout` |
| `obtenerPerfil` | GET | `/auth/perfil` |
| `obtenerPermisos` | GET | `/auth/permisos` |

## Contexto (`useAuth`)

Expone: `usuario`, `cargando`, `permisos`, `puede`, `login`, `logout`, `refrescar`.

Al montar (salvo `/`): `Promise.allSettled([obtenerPerfil(), obtenerPermisos()])`.

## Zod

`loginSchema`: `correo` (email, lowercased), `contrasena` requerida.  
UX de bloqueo: `segundosDeBloqueo` / mensajes de rate-limit.

## Guards

| Componente | Comportamiento |
|------------|----------------|
| `RequerirAuth` | Espera sesión; redirige a login si no hay usuario |
| `RequerirPermiso` | Exige módulo + nivel; si no, `AccesoDenegado` |
| `MostrarSiPuede` | Render condicional de acciones de escritura |

## Rutas

- `/login` → `LoginForm` → éxito → `/dashboard`
- Logout desde sidebar → limpia estado → `/login`
