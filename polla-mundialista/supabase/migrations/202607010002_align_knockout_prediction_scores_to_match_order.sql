create or replace function public.recalculate_knockout_match_points(
  p_match_number integer
)
returns integer
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  target_match public.matches;
  affected_rows integer;
begin
  select *
  into target_match
  from public.matches
  where match_number = p_match_number;

  if not found then
    raise exception 'MATCH_NOT_FOUND' using errcode = 'P0002';
  end if;

  update public.user_knockout_predictions prediction
  set points_awarded = case
    when target_match.status <> 'finished'
      or target_match.home_score is null
      or target_match.away_score is null
      or target_match.winner_team_id is null
    then 0
    else
      case
        when (
            case
              when prediction.home_team_id = target_match.home_team_id
                and prediction.away_team_id = target_match.away_team_id
                then prediction.predicted_home_score
              when prediction.home_team_id = target_match.away_team_id
                and prediction.away_team_id = target_match.home_team_id
                then prediction.predicted_away_score
              else prediction.predicted_home_score
            end
          ) = target_match.home_score
          and (
            case
              when prediction.home_team_id = target_match.home_team_id
                and prediction.away_team_id = target_match.away_team_id
                then prediction.predicted_away_score
              when prediction.home_team_id = target_match.away_team_id
                and prediction.away_team_id = target_match.home_team_id
                then prediction.predicted_home_score
              else prediction.predicted_away_score
            end
          ) = target_match.away_score
          then 5
        when prediction.predicted_winner_id = target_match.winner_team_id
          and (target_match.home_score - target_match.away_score) <> 0
          and (
            (
              case
                when prediction.home_team_id = target_match.home_team_id
                  and prediction.away_team_id = target_match.away_team_id
                  then prediction.predicted_home_score
                when prediction.home_team_id = target_match.away_team_id
                  and prediction.away_team_id = target_match.home_team_id
                  then prediction.predicted_away_score
                else prediction.predicted_home_score
              end
            ) - (
              case
                when prediction.home_team_id = target_match.home_team_id
                  and prediction.away_team_id = target_match.away_team_id
                  then prediction.predicted_away_score
                when prediction.home_team_id = target_match.away_team_id
                  and prediction.away_team_id = target_match.home_team_id
                  then prediction.predicted_home_score
                else prediction.predicted_away_score
              end
            )
          )
            = (target_match.home_score - target_match.away_score)
          then 4
        when prediction.predicted_winner_id = target_match.winner_team_id
          then 3
        else 0
      end
      + case when p_match_number = 104
          and prediction.predicted_winner_id = target_match.winner_team_id
        then 20 else 0 end
      + case when p_match_number = 104
          and (
            case
              when prediction.predicted_winner_id = prediction.home_team_id
                then prediction.away_team_id
              else prediction.home_team_id
            end
          ) = (
            case
              when target_match.winner_team_id = target_match.home_team_id
                then target_match.away_team_id
              else target_match.home_team_id
            end
          )
        then 10 else 0 end
  end
  where prediction.match_number = p_match_number;

  get diagnostics affected_rows = row_count;
  return affected_rows;
end;
$$;

select public.recalculate_knockout_match_points(match_number)
from public.matches
where match_number between 73 and 104;
