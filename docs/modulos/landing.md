# Feature Landing

**Ruta:** `src/features/landing`  
**Propósito:** Sitio institucional público del colegio (marketing + calendario de avisos).

## Estructura

Componentes presentacionales (`LandingHeader`, `LandingHero`, secciones), `datos-institucionales.ts`, hooks de accesibilidad (voz, tamaño de texto, sección activa).

## Datos remotos

Consume `useAvisosCalendario` de **comunicacion** → `GET /comunicacion/avisos/publicos` (sin cookie).

## Ruta

`/` → `src/app/page.tsx`. El `AuthProvider` no carga sesión en esta ruta.
