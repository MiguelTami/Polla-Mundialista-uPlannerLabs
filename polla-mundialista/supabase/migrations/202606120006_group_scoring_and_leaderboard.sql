-- Group-stage scoring:
-- 5 exact score
-- 4 correct winner and exact goal difference (non-draw, non-exact)
-- 3 correct outcome, including a draw
-- 0 otherwise

create or replace function public.calculate_prediction_points(
  p_predicted_home integer,
  p_predicted_away integer,
  p_actual_home integer,
  p_actual_away integer
)
returns integer
language sql
immutable
strict
set search_path = public, pg_catalog
as $$
  select case
    when p_predicted_home = p_actual_home
      and p_predicted_away = p_actual_away
      then 5
    when sign(p_predicted_home - p_predicted_away)
      = sign(p_actual_home - p_actual_away)
      and sign(p_actual_home - p_actual_away) <> 0
      and (p_predicted_home - p_predicted_away)
        = (p_actual_home - p_actual_away)
      then 4
    when sign(p_predicted_home - p_predicted_away)
      = sign(p_actual_home - p_actual_away)
      then 3
    else 0
  end;
$$;

do $$
begin
  if public.calculate_prediction_points(2, 1, 2, 1) <> 5
    or public.calculate_prediction_points(3, 1, 2, 0) <> 4
    or public.calculate_prediction_points(1, 0, 3, 1) <> 3
    or public.calculate_prediction_points(0, 1, 2, 0) <> 0
    or public.calculate_prediction_points(1, 1, 2, 2) <> 3
  then
    raise exception 'GROUP_SCORING_SELF_TEST_FAILED';
  end if;
end
$$;

create or replace function public.recalculate_match_points(p_match_id bigint)
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
  where id = p_match_id;

  if not found then
    raise exception 'MATCH_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  if target_match.status <> 'finished'
    or target_match.home_score is null
    or target_match.away_score is null
  then
    update public.predictions
    set points_awarded = 0
    where match_id = p_match_id;

    get diagnostics affected_rows = row_count;
    return affected_rows;
  end if;

  update public.predictions
  set points_awarded = public.calculate_prediction_points(
    predicted_home_score,
    predicted_away_score,
    target_match.home_score,
    target_match.away_score
  )
  where match_id = p_match_id;

  get diagnostics affected_rows = row_count;
  return affected_rows;
end;
$$;

revoke all on function public.recalculate_match_points(bigint) from public;

create or replace function public.recalculate_all_prediction_points()
returns integer
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  affected_rows integer;
begin
  update public.predictions prediction
  set points_awarded = case
    when match.status = 'finished'
      and match.home_score is not null
      and match.away_score is not null
    then public.calculate_prediction_points(
      prediction.predicted_home_score,
      prediction.predicted_away_score,
      match.home_score,
      match.away_score
    )
    else 0
  end
  from public.matches match
  where match.id = prediction.match_id;

  get diagnostics affected_rows = row_count;
  return affected_rows;
end;
$$;

revoke all on function public.recalculate_all_prediction_points() from public;

create or replace function public.recalculate_points_after_match_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  perform public.recalculate_match_points(new.id);
  return new;
end;
$$;

drop trigger if exists recalculate_points_on_match_result
  on public.matches;

create trigger recalculate_points_on_match_result
  after insert or update of home_score, away_score, status
  on public.matches
  for each row
  execute function public.recalculate_points_after_match_change();

select public.recalculate_all_prediction_points();

drop view if exists public.leaderboard;

create view public.leaderboard as
select
  profile.id as user_id,
  profile.display_name,
  coalesce(sum(prediction.points_awarded), 0)::bigint as total_points,
  count(prediction.id)::bigint as predictions_count,
  count(prediction.id) filter (
    where prediction.points_awarded = 5
  )::bigint as exact_scores,
  count(prediction.id) filter (
    where prediction.points_awarded between 3 and 4
  )::bigint as correct_outcomes,
  dense_rank() over (
    order by
      coalesce(sum(prediction.points_awarded), 0) desc,
      count(prediction.id) filter (
        where prediction.points_awarded = 5
      ) desc,
      count(prediction.id) filter (
        where prediction.points_awarded between 3 and 4
      ) desc
  )::bigint as position
from public.profiles profile
left join public.predictions prediction
  on prediction.user_id = profile.id
group by profile.id, profile.display_name;

grant select on public.leaderboard to authenticated;
