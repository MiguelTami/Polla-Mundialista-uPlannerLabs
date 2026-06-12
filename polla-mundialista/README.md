# Polla Mundialista 2026

Aplicación web para registrar predicciones del Mundial FIFA 2026 y competir en
una clasificación interna de uPlanner Labs.

## Requisitos

- Node.js 20 o superior
- Un proyecto de Supabase con el esquema descrito en `docs/PRD.md`

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` basado en `.env.example`.

3. Configura únicamente las credenciales públicas del frontend:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. Inicia el servidor:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: inicia Vite en modo desarrollo.
- `npm run build`: valida TypeScript y genera el build de producción.
- `npm run lint`: ejecuta ESLint.
- `npm run preview`: sirve localmente el build generado.

## Seguridad

Toda variable con prefijo `VITE_` queda disponible para el código del navegador.
Nunca configures allí una `service_role`, secret key ni otra credencial privada.
Las operaciones privilegiadas deben ejecutarse en Supabase mediante RLS,
funciones SQL o Edge Functions.

## Estructura

```text
src/
  app/          Configuración transversal de la aplicación
  components/   Componentes reutilizables
  config/       Variables y configuración de entorno
  features/     Funcionalidades agrupadas por dominio
  layouts/      Estructuras visuales compartidas
  lib/          Clientes de infraestructura
  pages/        Pantallas asociadas a rutas
```
