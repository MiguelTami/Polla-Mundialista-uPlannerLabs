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
        when prediction.predicted_home_score = target_match.home_score
          and prediction.predicted_away_score = target_match.away_score
          then 5
        when prediction.predicted_winner_id = target_match.winner_team_id
          and (target_match.home_score - target_match.away_score) <> 0
          and (prediction.predicted_home_score - prediction.predicted_away_score)
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

drop view if exists public.leaderboard;

create view public.leaderboard as
with user_scores as (
  select
    profile.id as user_id,
    profile.display_name,
    coalesce(group_score.points, 0) + coalesce(knockout_score.points, 0)
      as total_points,
    coalesce(group_score.predictions_count, 0)
      + coalesce(knockout_score.predictions_count, 0) as predictions_count,
    coalesce(group_score.exact_scores, 0)
      + coalesce(knockout_score.exact_scores, 0) as exact_scores,
    coalesce(group_score.correct_outcomes, 0)
      + coalesce(knockout_score.correct_outcomes, 0) as correct_outcomes
  from public.profiles profile
  left join (
    select
      user_id,
      sum(points_awarded)::bigint as points,
      count(*)::bigint as predictions_count,
      count(*) filter (where points_awarded = 5)::bigint as exact_scores,
      count(*) filter (where points_awarded between 3 and 4)::bigint
        as correct_outcomes
    from public.predictions
    group by user_id
  ) group_score on group_score.user_id = profile.id
  left join (
    select
      user_id,
      sum(points_awarded)::bigint as points,
      count(*)::bigint as predictions_count,
      count(*) filter (where points_awarded in (5, 35))::bigint
        as exact_scores,
      count(*) filter (where points_awarded > 0)::bigint
        as correct_outcomes
    from public.user_knockout_predictions
    group by user_id
  ) knockout_score on knockout_score.user_id = profile.id
)
select
  user_id,
  display_name,
  total_points::bigint,
  predictions_count::bigint,
  exact_scores::bigint,
  correct_outcomes::bigint,
  dense_rank() over (
    order by total_points desc, exact_scores desc, correct_outcomes desc
  )::bigint as position
from user_scores;

grant select on public.leaderboard to authenticated;

select public.recalculate_knockout_match_points(match_number)
from public.matches
where match_number between 73 and 104;
