# Diseño del cuadro eliminatorio personalizado

## Principio

Cada participante genera su propio cuadro después de completar las 72
predicciones de fase de grupos. El cuadro se calcula con:

- resultados reales de partidos que ya finalizaron;
- predicciones del usuario para los partidos restantes.

No existe una selección independiente de campeón o subcampeón. Ambos se
derivan de la final predicha por el participante.

## Clasificación simulada

Por cada grupo se calculan:

1. puntos: 3 por victoria y 1 por empate;
2. diferencia de gol;
3. goles a favor;
4. puntos en enfrentamientos directos;
5. diferencia de gol en enfrentamientos directos;
6. goles a favor en enfrentamientos directos;
7. ranking FIFA de junio de 2026 como último desempate calculable.

Clasifican los dos primeros de cada grupo y los ocho mejores terceros.

## Generación del cuadro

Los dieciseisavos se crean usando la matriz oficial FIFA para las combinaciones
de mejores terceros. Cada cruce pertenece al usuario y conserva:

- fase y posición dentro del cuadro;
- equipo local y visitante derivados;
- marcador predicho;
- clasificado predicho;
- vínculo con los cruces anteriores;
- estado bloqueado o editable.

## Persistencia propuesta

### user_brackets

- `id`
- `user_id`
- `group_predictions_hash`
- `generated_at`
- `locked_at`

### user_knockout_matches

- `id`
- `bracket_id`
- `round`
- `slot`
- `home_team_id`
- `away_team_id`
- `source_home_slot`
- `source_away_slot`
- `predicted_home_score`
- `predicted_away_score`
- `predicted_winner_id`
- `points_awarded`

## Regeneración

Si una predicción futura de grupos cambia:

1. se recalcula la clasificación simulada;
2. se compara el hash de clasificados con el cuadro actual;
3. si cambian equipos, se regenera el cuadro;
4. se eliminan predicciones eliminatorias que dependían de cruces modificados.

Una vez comience el primer partido de dieciseisavos, el cuadro queda bloqueado.

## Campeón y subcampeón

- Campeón: ganador predicho de la final.
- Subcampeón: perdedor predicho de la final.

Los puntos especiales se asignan comparando esos dos equipos derivados con el
resultado real del torneo.
