# Diseño del cuadro eliminatorio personalizado

## Principio

Cada participante ve su cuadro desde la primera predicción. El cálculo combina:

- resultados reales de partidos ya finalizados;
- predicciones del usuario para los partidos restantes.

Cuando un grupo completa sus seis resultados, sus posiciones primera, segunda
y tercera aparecen inmediatamente. Mientras no estén definidos los doce
grupos, los cruces de mejores terceros muestran candidatos posibles. Al
completar todos los grupos se aplica la matriz oficial de 495 combinaciones.

No existe una selección independiente de campeón o subcampeón. Ambos se
derivan de la final predicha por el participante.

## Clasificación simulada

Por cada grupo se calculan:

1. puntos: 3 por victoria y 1 por empate;
2. diferencia de gol;
3. goles a favor;
4. ranking FIFA como último desempate calculable.

Clasifican los dos primeros de cada grupo y los ocho mejores terceros.

## Generación del cuadro

Los dieciseisavos usan la matriz oficial FIFA para las combinaciones de mejores
terceros. Cada cruce conserva:

- número oficial de partido;
- equipos derivados de grupos o cruces anteriores;
- marcador predicho;
- clasificado predicho;
- estado editable o pendiente de equipos.

## Persistencia

`user_knockout_predictions` guarda:

- `user_id`
- `match_number`
- `home_team_id`
- `away_team_id`
- `predicted_home_score`
- `predicted_away_score`
- `predicted_winner_id`
- `points_awarded`
- `updated_at`

La tabla tiene RLS y solo permite lectura al propietario. Las escrituras pasan
por un RPC validado.

## Regeneración

Si una predicción futura de grupos cambia, el cliente:

1. recalcula la clasificación simulada;
2. reconstruye los cruces desde sus fuentes oficiales;
3. ignora predicciones guardadas cuyos participantes ya no coincidan;
4. oculta las rondas descendientes hasta volver a predecirlas.

El cuadro queda bloqueado al comenzar el primer partido de dieciseisavos.

Cada partido se bloquea individualmente según su fecha oficial. Cuando un
resultado real finaliza, el ganador real sustituye la rama simulada y avanza al
siguiente cruce. Un usuario sin predicción previa conserva cero puntos.

## Sincronización

GitHub Actions ejecuta `scripts/sync-world-cup-results.mjs` cada 15 minutos. El
script actualiza fechas, participantes, estados y marcadores mediante un RPC
reservado para `service_role`. Los cambios recalculan puntos y llegan a la
aplicación mediante Supabase Realtime.

## Campeón y subcampeón

- Campeón: ganador predicho de la final.
- Subcampeón: perdedor predicho de la final.

Los puntos especiales se asignarán comparando esos equipos derivados con el
resultado real del torneo.
