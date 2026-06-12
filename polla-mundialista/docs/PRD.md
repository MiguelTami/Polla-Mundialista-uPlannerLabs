# Product Requirements Document (PRD)

## Proyecto

Polla Mundialista 2026

## Versión

1.0 (MVP)

## Autor

Miguel Alejandro Tami Lobo

## Fecha

Junio 2026

---

# 1. Resumen Ejecutivo

La Polla Mundialista 2026 es una aplicación web que permitirá a los usuarios registrar sus predicciones para todos los partidos del Mundial FIFA 2026, incluyendo fase de grupos, rondas eliminatorias y campeón del torneo.

La plataforma calculará automáticamente los puntajes obtenidos por cada usuario según sus aciertos y mostrará una tabla de posiciones en tiempo real.

El objetivo es proporcionar una experiencia sencilla, competitiva y fácil de administrar para grupos de trabajo, amigos o comunidades.

---

# 2. Objetivos del Producto

## Objetivos de Negocio

* Facilitar la organización de una polla mundialista sin utilizar hojas de cálculo.
* Centralizar todas las predicciones en una única plataforma.
* Automatizar el cálculo de puntajes.
* Mantener una clasificación actualizada de los participantes.

## Objetivos de Usuario

* Registrar predicciones fácilmente.
* Consultar sus apuestas en cualquier momento.
* Comparar su desempeño con otros participantes.
* Seguir la evolución de la clasificación durante el torneo.

---

# 3. Alcance del MVP

## Incluido

* Registro e inicio de sesión.
* Gestión de usuarios.
* Predicción de todos los partidos.
* Predicción de clasificados en eliminatorias.
* Predicción de campeón.
* Registro de resultados reales.
* Cálculo automático de puntajes.
* Tabla de posiciones general.
* Perfil de usuario.
* Cierre automático de predicciones una vez iniciado cada partido.

## No Incluido

* Pagos.
* Premios automáticos.
* Integración con APIs deportivas.
* Notificaciones push.
* Chats.
* Ligas privadas múltiples.
* Predicciones por goleador del torneo.

---

# 4. Roles del Sistema

## Administrador

Responsable de:

* Crear y actualizar partidos.
* Registrar resultados oficiales.
* Gestionar usuarios.
* Recalcular puntuaciones.
* Abrir o cerrar predicciones.

## Participante

Puede:

* Crear cuenta.
* Registrar predicciones.
* Editar predicciones antes del cierre.
* Consultar clasificación.
* Consultar historial de predicciones.

---

# 5. Historias de Usuario

## Autenticación

### HU-001

Como usuario quiero registrarme para participar en la polla.

### HU-002

Como usuario quiero iniciar sesión para acceder a mis predicciones.

---

## Predicciones

### HU-003

Como usuario quiero predecir el resultado de un partido para ganar puntos.

### HU-004

Como usuario quiero modificar una predicción antes del inicio del partido.

### HU-005

Como usuario quiero predecir qué selección avanzará en una eliminatoria.

### HU-006

Como usuario quiero elegir al campeón del torneo.

---

## Clasificación

### HU-007

Como usuario quiero consultar la tabla general para conocer mi posición.

### HU-008

Como usuario quiero visualizar mis puntos acumulados.

---

## Administración

### HU-009

Como administrador quiero registrar resultados oficiales para actualizar las puntuaciones.

### HU-010

Como administrador quiero gestionar los partidos del torneo.

---

# 6. Reglas de Negocio

## RN-001

Las predicciones solo pueden modificarse antes del inicio oficial del partido.

## RN-002

Una vez iniciado el partido, la predicción queda bloqueada.

## RN-003

Solo los administradores pueden registrar resultados oficiales.

## RN-004

Los puntos se calculan automáticamente después de registrar un resultado.

## RN-005

La clasificación se ordenará por puntaje total descendente.

---

# 7. Sistema de Puntuación

## Fase de Grupos

| Evento                       | Puntos |
| ---------------------------- | ------ |
| Marcador exacto              | 5      |
| Ganador correcto             | 3      |
| Empate correcto              | 3      |
| Diferencia de goles correcta | 1      |

---

## Eliminatorias

| Evento               | Puntos |
| -------------------- | ------ |
| Clasificado correcto | 5      |
| Marcador exacto      | 5      |
| Ganador correcto     | 3      |

---

## Predicciones Especiales

| Evento              | Puntos |
| ------------------- | ------ |
| Campeón correcto    | 20     |
| Subcampeón correcto | 10     |

---

# 8. Requerimientos Funcionales

## RF-001

El sistema deberá permitir autenticación mediante Supabase Auth.

## RF-002

El sistema deberá mostrar el calendario completo del Mundial.

## RF-003

El sistema deberá permitir registrar una predicción por usuario para cada partido.

## RF-004

El sistema deberá impedir modificaciones después del inicio del partido.

## RF-005

El sistema deberá calcular automáticamente los puntos obtenidos.

## RF-006

El sistema deberá mostrar la clasificación general.

## RF-007

El sistema deberá mostrar el detalle de puntos obtenidos por partido.

## RF-008

El sistema deberá permitir que el administrador registre resultados oficiales.

## RF-009

El sistema deberá recalcular automáticamente la clasificación tras cada resultado.

---

# 9. Requerimientos No Funcionales

## RNF-001

La aplicación deberá ser responsive.

## RNF-002

El tiempo de carga inicial no deberá superar 3 segundos.

## RNF-003

El sistema deberá soportar al menos 500 usuarios concurrentes.

## RNF-004

Las comunicaciones deberán realizarse mediante HTTPS.

## RNF-005

Las reglas de acceso deberán implementarse mediante Supabase RLS.

---

# 10. Arquitectura

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS

## Backend

* Supabase Auth
* Supabase Database
* Supabase Storage
* Supabase Edge Functions (opcional)

## Despliegue

* Vercel

---

# 11. Modelo de Datos

## profiles

* id (uuid)
* email
* display_name
* role
* created_at

---

## teams

* id
* name
* group_name
* flag_url

---

## matches

* id
* phase
* group_name
* home_team_id
* away_team_id
* match_date
* home_score
* away_score
* winner_team_id
* status

---

## predictions

* id
* user_id
* match_id
* predicted_home_score
* predicted_away_score
* predicted_winner_id
* points_awarded

---

## tournament_predictions

* id
* user_id
* champion_team_id
* runner_up_team_id

---

## leaderboard

* id
* user_id
* total_points
* position

---

# 12. Pantallas

## Login

* Inicio de sesión
* Registro

## Dashboard

* Resumen de puntos
* Posición actual

## Partidos

* Calendario completo
* Predicciones

## Clasificación

* Ranking general

## Perfil

* Información del usuario
* Historial de apuestas

## Administración

* Gestión de partidos
* Registro de resultados

---

# 13. Métricas de Éxito

* 100% de usuarios registrados pueden crear predicciones.
* Tiempo promedio de registro menor a 2 minutos.
* Cálculo automático de puntuaciones sin intervención manual.
* Disponibilidad superior al 99%.

---
