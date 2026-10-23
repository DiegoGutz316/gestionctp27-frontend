# Stack y arquitectura

## Stack de herramientas

| Área | Tecnología | Notas |
|------|------------|--------|
| Framework | Next.js **16.2.10** (App Router) | React **19.2.4** |
| Lenguaje | TypeScript 5 (strict) | Alias `@/*` → `src/*` |
| Estilos | Tailwind CSS **4** | `globals.css`, PostCSS |
| UI | shadcn/ui (base-nova) + `@base-ui/react` | `components/ui/` |
| Datos remotos | TanStack Query **5** | `staleTime` 60s |
| Formularios | TanStack Form **1** + Zod **4** | `zodValidator` en `lib/zod-form.ts` |
| Temas | next-themes | Claro / oscuro |
| Toasts | sonner | |
| Iconos | lucide-react | |
| Excel cliente | exceljs | Inventario pecuario MEP, informe caja |
| Gestor | **pnpm** | |
| Deploy | Vercel | `vercel.json` con rewrite a backend |

### Variables de entorno

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

En Vercel, `vercel.json` reescribe `/api-backend/:ruta*` hacia el backend desplegado (alternativa/proxy).

## Estructura

```
src/
├── app/
│   ├── layout.tsx / providers.tsx / page.tsx   # raíz + landing
│   ├── (public)/login/                         # login
│   ├── (private)/layout.tsx                    # legado (sin páginas hijas)
│   └── dashboard/                              # shell autenticado + módulos
├── features/                                   # dominio por área
│   ├── auth / landing / dashboard
│   ├── usuarios / agricola / pecuaria
│   ├── inventario / libro-caja / comunicacion
├── components/                                 # shell compartido + ui/
├── hooks/                                      # useIsMobile, useDebouncedValue
├── lib/                                        # api, paginación, fechas, zod-form
└── middleware.ts                               # gate por cookie
```

### Patrón de feature

```
src/features/<area>/[subdominio]/
  servicios/*.service.ts   # wrappers de api.*
  hooks/*.ts               # useQuery / useMutation
  models/*.ts              # tipos
  validacion/*.ts          # esquemas Zod (a menudo aquí)
  components/*.tsx         # pantallas y formularios
```

Las páginas en `app/` son delgadas: importan el componente de feature y envuelven `RequerirPermiso` cuando aplica.

## Bootstrap

### `providers.tsx`

`ThemeProvider` → `QueryClientProvider` (`retry: reintentarConsulta`) → `AuthProvider` → children + `Toaster`.

### `middleware.ts`

Cookie `ctp27_access_token`:

- Con sesión en `/login` → `/dashboard`
- Sin sesión en `/dashboard/*` (o `/inventario/*`) → `/login`

La autorización fina la hace el cliente (`RequerirAuth` / `RequerirPermiso`) y el backend.

### Shell privado

`dashboard/layout.tsx`: `RequerirAuth` + `AppSidebar`. El menú se filtra con `puede(modulo)`.

## Cliente HTTP (`lib/api.ts`)

| Aspecto | Comportamiento |
|---------|----------------|
| Base URL | `NEXT_PUBLIC_API_URL` o `http://localhost:4000` |
| Credenciales | `credentials: "include"` (cookie de sesión) |
| Métodos | `get`, `post`, `put`, `patch`, `delete`, `descargar`, `enviarArchivo` |
| Errores | `ApiError(status, message)`; `getMensajeDeError` parsea Nest |
| Retry Query | Solo 408/429/5xx o `TypeError`, máx. 2 fallos |
| FormData | No fuerza `Content-Type: application/json` |

## Utilidades compartidas

| Archivo | Uso |
|---------|-----|
| `lib/paginacion.ts` | Schema/params + `ResultadoPaginado` + `numerosDePagina` |
| `lib/fechas.ts` | `fechaHoyCR()` (America/Costa_Rica) |
| `lib/zod-form.ts` | Adaptador Zod ↔ TanStack Form |
| `lib/form-errors.ts` | Errores de campo |
| `lib/utils.ts` | `cn()` |
| `components/ControlesPaginacion` | UI de páginas |
| `components/AccionesMenu` | Menú de fila |
| `components/SelectorTema` | Toggle tema |

## Comandos

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

## Despliegue

Frontend en **Vercel**. Backend en Railway (o Vercel serverless). CORS del backend debe incluir el origen del FE.
