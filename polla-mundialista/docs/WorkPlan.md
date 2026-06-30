# Plan de Trabajo — Polla Mundialista

## 1. Objetivo del Plan

Desarrollar una aplicación web para gestionar una polla mundialista entre compañeros de trabajo, permitiendo que los usuarios registren predicciones, consulten resultados, acumulen puntos y compitan en una tabla de clasificación.

El proyecto se desarrollará usando:

* React + TypeScript + Vite
* Supabase Auth
* Supabase Database
* Supabase RLS
* Vercel para despliegue

---

# 2. Criterios de Priorización

Las features se desarrollarán siguiendo estos criterios:

## Prioridad Alta

Funcionalidades necesarias para que la aplicación sea usable en su versión mínima.

Ejemplos:

* Registro e inicio de sesión.
* Visualización de partidos.
* Registro de predicciones.
* Tabla de posiciones.

## Prioridad Media

Funcionalidades que mejoran la experiencia o reducen trabajo manual.

Ejemplos:

* Panel de administración.
* Registro de resultados desde interfaz.
* Cálculo automático de puntos.

---

# 3. Fase 0 — Preparación del Proyecto

## Objetivo

Dejar lista la base técnica del proyecto.

## Tareas

* Crear proyecto con Vite + React + TypeScript.
* Instalar Supabase JS.
* Configurar variables de entorno.
* Crear cliente Supabase.
* Configurar estructura inicial de carpetas.
* Configurar rutas principales.
* Configurar estilos base con TailwindCSS.

## Resultado esperado

El proyecto debe correr localmente y conectarse correctamente con Supabase.

## Criterio de aceptación

* La aplicación inicia con `npm run dev`.
* Supabase responde correctamente desde el frontend.
* Las variables de entorno están funcionando.

---

# 4. Fase 1 — Autenticación

## Objetivo

Permitir que los usuarios se registren, inicien sesión y cierren sesión.

## Features

### 1. Registro de usuario

El usuario podrá crear una cuenta con correo y contraseña.

### 2. Inicio de sesión

El usuario podrá ingresar con sus credenciales.

### 3. Cierre de sesión

El usuario podrá salir de la aplicación.

### 4. Protección de rutas

Las pantallas privadas solo podrán ser vistas por usuarios autenticados.

## Tareas

* Crear pantalla de login.
* Crear pantalla de registro.
* Implementar `signUp`.
* Implementar `signInWithPassword`.
* Implementar `signOut`.
* Crear contexto o hook de sesión.
* Validar que se cree automáticamente el perfil en la tabla `profiles`.

## Criterio de aceptación

* Un usuario puede registrarse.
* Un usuario puede iniciar sesión.
* Un usuario puede cerrar sesión.
* Al registrarse, se crea un perfil en `profiles`.
* Un usuario no autenticado no puede entrar al dashboard.

---

# 5. Fase 2 — Layout Principal y Navegación

## Objetivo

Crear la estructura visual base de la aplicación.

## Features

### 1. Dashboard

Pantalla inicial del usuario autenticado.

### 2. Navbar

Menú principal con accesos a:

* Dashboard
* Partidos
* Mis predicciones
* Clasificación
* Perfil
* Cerrar sesión

### 3. Layout responsive

La aplicación debe funcionar en escritorio y móvil.

## Tareas

* Crear layout privado.
* Crear componente Navbar.
* Crear rutas principales.
* Crear estados de carga.
* Crear componentes base reutilizables.

## Criterio de aceptación

* El usuario autenticado ve el layout principal.
* La navegación funciona correctamente.
* La aplicación es usable en móvil y escritorio.

---

# 6. Fase 3 — Visualización de Equipos y Partidos

## Objetivo

Mostrar los partidos disponibles para predecir.

## Features

### 1. Lista de partidos

El usuario podrá consultar los partidos del Mundial.

### 2. Filtros

Filtrar partidos por:

* Fase
* Grupo

### 3. Detalle básico del partido

Cada partido debe mostrar:

* Equipo local
* Equipo visitante
* Fecha
* Fase
* Resultado real, si ya existe

## Tareas

* Crear servicio para consultar `matches`.
* Crear servicio para consultar `teams`.
* Crear pantalla de partidos.
* Agrupar partidos por fase o fecha.
* Mostrar estados: programado, en curso, finalizado.

## Criterio de aceptación

* Los partidos se muestran correctamente.
* Los equipos aparecen con su nombre.
* Los partidos finalizados muestran resultado.
* Los partidos programados permiten ir a predicción.

---

# 7. Fase 4 — Registro de Predicciones

## Objetivo

Permitir que cada usuario registre y edite sus predicciones antes del inicio del partido.

## Features

### 1. Crear predicción

El usuario podrá ingresar:

* Goles del equipo local.
* Goles del equipo visitante.
* Ganador predicho, si aplica.

### 2. Editar predicción

El usuario podrá modificar su predicción mientras el partido no haya iniciado.

### 3. Bloqueo de predicción

Después de la fecha de inicio del partido, la predicción no podrá editarse.

## Tareas

* Crear formulario de predicción.
* Consultar predicción existente del usuario.
* Implementar `insert` en `predictions`.
* Implementar `update` en `predictions`.
* Manejar errores de RLS.
* Deshabilitar formulario si el partido ya inició.

## Criterio de aceptación

* El usuario puede guardar una predicción.
* El usuario puede editar una predicción antes del partido.
* El usuario no puede editar una predicción después del inicio.
* Solo existe una predicción por usuario y partido.

---

# 8. Fase 5 — Mis Predicciones

## Objetivo

Permitir que el usuario consulte todas sus predicciones.

## Features

### 1. Historial de predicciones

El usuario podrá ver sus predicciones registradas.

### 2. Estado de cada predicción

Cada predicción debe indicar:

* Pendiente
* Bloqueada
* Evaluada

### 3. Puntos obtenidos

Si el partido ya terminó, se mostrarán los puntos ganados.

## Tareas

* Crear pantalla “Mis predicciones”.
* Consultar predicciones por `user_id`.
* Unir predicciones con partidos y equipos.
* Mostrar puntos asignados.

## Criterio de aceptación

* El usuario puede ver todas sus predicciones.
* Las predicciones muestran partido, marcador predicho y puntos.
* Las predicciones bloqueadas no permiten edición.

---

# 9. Fase 6 — Predicción de Campeón y Subcampeón

## Objetivo

Permitir predicciones especiales del torneo.

## Features

### 1. Predicción de campeón

El usuario podrá elegir el equipo campeón.

### 2. Predicción de subcampeón

El usuario podrá elegir el equipo subcampeón.

### 3. Edición limitada

Estas predicciones solo podrán modificarse antes de una fecha límite definida.

## Tareas

* Crear formulario de predicción de torneo.
* Consultar equipos disponibles.
* Guardar datos en `tournament_predictions`.
* Evitar que campeón y subcampeón sean iguales.
* Definir mecanismo de bloqueo.

## Criterio de aceptación

* El usuario puede seleccionar campeón.
* El usuario puede seleccionar subcampeón.
* No se permite elegir el mismo equipo en ambos campos.
* Solo existe una predicción de torneo por usuario.

---

# 10. Fase 7 — Tabla de Clasificación

## Objetivo

Mostrar el ranking general de participantes.

## Features

### 1. Leaderboard

La tabla debe mostrar:

* Posición
* Nombre del usuario
* Puntos totales

### 2. Ordenamiento

Los usuarios se ordenan de mayor a menor puntaje.

## Tareas

* Consultar vista `leaderboard`.
* Crear pantalla de clasificación.
* Mostrar posición calculada.
* Resaltar usuario actual.

## Criterio de aceptación

* La tabla muestra todos los usuarios.
* Los puntos se ven correctamente.
* El ranking se actualiza después de registrar resultados.

---

# 11. Fase 8 — Panel de Administración

## Objetivo

Permitir que el administrador gestione partidos y resultados sin tocar Supabase manualmente.

## Features

### 1. Gestión de partidos

El administrador podrá:

* Crear partidos.
* Editar fecha.
* Editar equipos.
* Cambiar estado del partido.

### 2. Registro de resultados

El administrador podrá ingresar:

* Goles del equipo local.
* Goles del equipo visitante.
* Ganador real.

### 3. Recalcular puntos

Después de registrar el resultado, el sistema debe actualizar los puntos de las predicciones.

## Tareas

* Crear ruta protegida para administradores.
* Crear formulario de edición de partidos.
* Crear formulario para registrar resultados.
* Crear función SQL o RPC para calcular puntos.
* Ejecutar recálculo después de guardar resultado.

## Criterio de aceptación

* Solo admins acceden al panel.
* El admin puede registrar resultados.
* Las predicciones reciben puntos automáticamente.
* La clasificación se actualiza.

---

# 12. Fase 9 — Cálculo de Puntajes

## Objetivo

Automatizar el sistema de puntuación.

## Reglas iniciales

| Acierto                      | Puntos |
| ---------------------------- | -----: |
| Marcador exacto              |      5 |
| Ganador y diferencia exacta  |      4 |
| Ganador correcto             |      3 |
| Empate correcto              |      3 |
| Diferencia de goles correcta |      1 |
| Campeón correcto             |     20 |
| Subcampeón correcto          |     10 |

## Tareas

* Crear función SQL `calculate_prediction_points`.
* Crear función SQL `recalculate_match_points`.
* Crear función SQL para predicciones de torneo.
* Probar casos de marcador exacto.
* Probar casos de ganador correcto.
* Probar casos de empate.
* Probar casos sin acierto.

## Criterio de aceptación

* Los puntos se calculan sin intervención manual.
* Los resultados son consistentes con las reglas.
* Se puede recalcular un partido si hubo error al registrar el resultado.

---

# 13. Fase 10 — Pruebas y Validación

## Objetivo

Verificar que el MVP funcione correctamente antes de compartirlo con usuarios reales.

## Pruebas necesarias

### Autenticación

* Registro correcto.
* Login correcto.
* Logout correcto.
* Protección de rutas.

### Predicciones

* Crear predicción.
* Editar predicción.
* Bloquear predicción después de inicio.
* Evitar predicciones duplicadas.

### Administración

* Registrar resultado.
* Actualizar resultado.
* Recalcular puntos.

### Seguridad

* Usuario no puede editar predicciones de otro usuario.
* Usuario no admin no puede modificar partidos.
* Usuario no admin no puede registrar resultados.

## Criterio de aceptación

* El flujo completo funciona de inicio a fin.
* No hay errores críticos en consola.
* Las políticas RLS bloquean operaciones no autorizadas.

---

# 14. Fase 11 — Despliegue

## Objetivo

Publicar la aplicación para que pueda ser usada por los compañeros de trabajo.

## Tareas

* Crear repositorio en GitHub.
* Subir proyecto.
* Configurar proyecto en Vercel.
* Agregar variables de entorno en Vercel.
* Configurar URL de producción en Supabase Auth.
* Probar login en producción.
* Probar predicciones en producción.

## Criterio de aceptación

* La aplicación está publicada.
* Los usuarios pueden registrarse.
* Los usuarios pueden predecir.
* El administrador puede registrar resultados.

---

# 15. Orden Recomendado de Desarrollo

## Sprint 1 — Base Técnica

1. Crear proyecto React.
2. Configurar Supabase.
3. Configurar rutas.
4. Configurar layout base.

## Sprint 2 — Autenticación

1. Registro.
2. Login.
3. Logout.
4. Protección de rutas.
5. Validación de creación de perfil.

## Sprint 3 — Partidos

1. Crear seed de equipos.
2. Crear seed de partidos.
3. Mostrar lista de partidos.
4. Filtrar partidos.

## Sprint 4 — Predicciones

1. Crear formulario de predicción.
2. Guardar predicción.
3. Editar predicción.
4. Bloquear predicción.

## Sprint 5 — Clasificación

1. Mostrar puntos por usuario.
2. Mostrar leaderboard.
3. Resaltar usuario actual.

## Sprint 6 — Administración

1. Crear panel admin.
2. Editar partidos.
3. Registrar resultados.
4. Recalcular puntos.

## Sprint 7 — Pulido y Deploy

1. Mejorar UI.
2. Validar responsive.
3. Probar RLS.
4. Desplegar en Vercel.

---

# 16. MVP Mínimo Entregable

El MVP se considerará completo cuando:

* Los usuarios puedan registrarse e iniciar sesión.
* Los usuarios puedan ver partidos.
* Los usuarios puedan registrar predicciones.
* Las predicciones se bloqueen al iniciar el partido.
* El administrador pueda registrar resultados.
* El sistema calcule puntos.
* La tabla de clasificación funcione.
* La app esté desplegada.

---

# 17. Recomendación Final

El desarrollo debe iniciar por autenticación y predicciones básicas. No conviene empezar por el bracket eliminatorio ni por estadísticas avanzadas, porque aumentan la complejidad sin ser necesarias para validar el producto.

El primer objetivo debe ser completar el siguiente flujo:

Usuario se registra → ve partidos → predice marcador → admin registra resultado → sistema calcula puntos → usuario aparece en clasificación.
