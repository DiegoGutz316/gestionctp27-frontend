# gestionctp27-frontend

Interfaz web del sistema de gestión para un Colegio Técnico Profesional
(GestiónCTP27). Este repositorio contiene únicamente la **estructura base** del
frontend: todavía no hay pantallas ni funcionalidad implementada.

## Stack

- [Next.js](https://nextjs.org/) con App Router y TypeScript estricto
- [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query) para datos remotos
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para formularios y validación
- Gestor de paquetes: **pnpm**

## Estructura

```
src/
├── app/
│   ├── (public)/        rutas públicas (ej. login)
│   ├── (private)/       grupo de rutas privadas (layout base)
│   ├── layout.tsx       layout raíz (conecta Providers)
│   └── providers.tsx    QueryClientProvider de TanStack Query
├── features/
│   ├── usuarios/  pecuaria/  agricola/
│   ├── inventario/  reportes/  dashboard/
├── lib/
│   ├── api.ts           cliente HTTP base (NEXT_PUBLIC_API_URL)
│   ├── paginacion.ts    tipos/helpers de paginación compartida
│   └── utils.ts         utilidades de shadcn/ui
└── components/          componentes compartidos (ui/ de shadcn)
```

> **Nota:** los esquemas Zod viven en `src/features/<modulo>/models/` junto a
> cada feature (p. ej. `usuarios/models`, `inventario/models`).

## Requisitos

- Node.js 20+
- pnpm

## Instalación

```bash
pnpm install
```

## Configuración

Copiar `.env.example` a `.env.local` (o `.env`) y ajustar la URL de la API:

```bash
cp .env.example .env.local
```

Variable: `NEXT_PUBLIC_API_URL` — URL base del backend (`gestionctp27-backend`).

## Comandos

```bash
pnpm dev     # levantar en modo desarrollo (http://localhost:3000)
pnpm build   # compilar para producción
pnpm start   # servir la versión compilada
pnpm lint    # lint
```

## Despliegue

Frontend desplegado en Vercel, conectado a este repositorio.
