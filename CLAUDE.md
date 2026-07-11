# CLAUDE.md — gestionctp27-frontend

Interfaz web (Next.js App Router + TailwindCSS/shadcn + TanStack Query + RHF/Zod)
del sistema de gestión para un Colegio Técnico Profesional. Repositorio
independiente del backend (`gestionctp27-backend`).

## Reglas del proyecto

- Gestor de paquetes: **pnpm** exclusivamente.
- TypeScript estricto.
- Organización por features: el código de cada área vive en `src/features/`
  (`usuarios`, `pecuaria`, `agricola`, `inventario`, `reportes`, `dashboard`);
  `src/components/` solo para componentes compartidos.
- Rutas: `src/app/(public)/` para rutas públicas (login) y `src/app/(private)/`
  para las privadas (su layout base ya existe).
- Datos remotos con TanStack Query (provider en `src/app/providers.tsx`);
  llamadas HTTP a través de `src/lib/api.ts` (usa `NEXT_PUBLIC_API_URL`).
- Formularios con React Hook Form + `@hookform/resolvers` + Zod.
- Los esquemas Zod viven en `src/schemas/` y deben mantenerse **sincronizados
  manualmente** con los de `gestionctp27-backend/src/schemas/` (mismo día/PR).
- Componentes UI con shadcn/ui (`pnpm dlx shadcn@latest add <componente>`).

## Comandos

- `pnpm dev` — desarrollo (http://localhost:3000)
- `pnpm build` / `pnpm start`
- `pnpm lint`

## Despliegue

Vercel (frontend) — el backend se despliega en Railway desde su propio repositorio.
