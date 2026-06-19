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

## Autenticación

La aplicación incluye registro, inicio de sesión, cierre de sesión y protección
de rutas con Supabase Auth.

Antes de probar un registro nuevo, ejecuta en el SQL Editor de Supabase la
migración:

```text
supabase/migrations/202606120001_create_profile_on_signup.sql
```

El trigger usa el campo `display_name` enviado durante el registro y crea el
registro correspondiente en `public.profiles`.

Si Auth responde `Database error creating new user`, ejecuta después la
migración de reparación:

```text
supabase/migrations/202606120002_repair_profile_signup_trigger.sql
```

Para que los usuarios autenticados puedan consultar equipos y partidos, ejecuta:

```text
supabase/migrations/202606120003_allow_match_calendar_read.sql
```

## Calendario del Mundial

El catálogo de la fase de grupos se genera con:

```bash
node scripts/generate-world-cup-seed.mjs
```

Este comando:

- descarga y valida los 48 equipos y 72 partidos;
- actualiza los resultados ya publicados;
- descarga las banderas SVG en `public/flags`;
- genera `src/data/world-cup-2026.json`;
- regenera la migración `202606120004_seed_world_cup_group_stage.sql`.

Después de regenerar los datos, aplica las migraciones pendientes:

```bash
npx supabase@latest db push
```

Las fechas se almacenan como `timestamptz` en UTC y la aplicación las presenta
en la zona horaria `America/Bogota`.

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

## Sincronización automática

El workflow `.github/workflows/sync-world-cup-results.yml` consulta resultados
cada 15 minutos y actualiza Supabase mediante un RPC privado. Debes crear estos
secretos en GitHub Actions:

- `SUPABASE_URL`: URL del proyecto.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada `service_role`.

La clave `service_role` nunca debe configurarse en Vercel ni usar el prefijo
`VITE_`. El workflow también puede ejecutarse manualmente desde GitHub Actions.

## Creación administrativa de usuarios

Las cuentas pueden prepararse sin enviar correos de confirmación:

1. Edita `scripts/users-to-create.mjs`. Este archivo está ignorado por Git.
2. Configura temporalmente `SUPABASE_SERVICE_ROLE_KEY` en `.env`.
3. Ejecuta `npm run users:validate` para revisar los datos sin crear cuentas.
4. Ejecuta `npm run users:create` para crear y confirmar las cuentas.

El script omite correos que ya existen, no imprime contraseñas y genera el
perfil mediante el trigger de Supabase Auth. La plantilla versionada se
encuentra en `scripts/users-to-create.example.mjs`.

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
