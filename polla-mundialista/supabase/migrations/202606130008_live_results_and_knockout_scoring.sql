alter table public.matches
  alter column home_team_id drop not null,
  alter column away_team_id drop not null;

with knockout_schedule (match_number, phase, match_date) as (
  values
    (73, 'round_of_32', '2026-06-28T19:00:00Z'::timestamptz),
    (74, 'round_of_32', '2026-06-29T17:00:00Z'::timestamptz),
    (75, 'round_of_32', '2026-06-29T20:30:00Z'::timestamptz),
    (76, 'round_of_32', '2026-06-30T01:00:00Z'::timestamptz),
    (77, 'round_of_32', '2026-06-30T17:00:00Z'::timestamptz),
    (78, 'round_of_32', '2026-06-30T21:00:00Z'::timestamptz),
    (79, 'round_of_32', '2026-07-01T01:00:00Z'::timestamptz),
    (80, 'round_of_32', '2026-07-01T16:00:00Z'::timestamptz),
    (81, 'round_of_32', '2026-07-01T20:00:00Z'::timestamptz),
    (82, 'round_of_32', '2026-07-02T00:00:00Z'::timestamptz),
    (83, 'round_of_32', '2026-07-02T19:00:00Z'::timestamptz),
    (84, 'round_of_32', '2026-07-02T23:00:00Z'::timestamptz),
    (85, 'round_of_32', '2026-07-03T03:00:00Z'::timestamptz),
    (86, 'round_of_32', '2026-07-03T18:00:00Z'::timestamptz),
    (87, 'round_of_32', '2026-07-03T22:00:00Z'::timestamptz),
    (88, 'round_of_32', '2026-07-04T01:30:00Z'::timestamptz),
    (89, 'round_of_16', '2026-07-04T17:00:00Z'::timestamptz),
    (90, 'round_of_16', '2026-07-04T21:00:00Z'::timestamptz),
    (91, 'round_of_16', '2026-07-05T20:00:00Z'::timestamptz),
    (92, 'round_of_16', '2026-07-06T00:00:00Z'::timestamptz),
    (93, 'round_of_16', '2026-07-06T19:00:00Z'::timestamptz),
    (94, 'round_of_16', '2026-07-07T00:00:00Z'::timestamptz),
    (95, 'round_of_16', '2026-07-07T16:00:00Z'::timestamptz),
    (96, 'round_of_16', '2026-07-07T20:00:00Z'::timestamptz),
    (97, 'quarter_final', '2026-07-09T20:00:00Z'::timestamptz),
    (98, 'quarter_final', '2026-07-10T19:00:00Z'::timestamptz),
    (99, 'quarter_final', '2026-07-11T21:00:00Z'::timestamptz),
    (100, 'quarter_final', '2026-07-12T01:00:00Z'::timestamptz),
    (101, 'semi_final', '2026-07-14T19:00:00Z'::timestamptz),
    (102, 'semi_final', '2026-07-15T19:00:00Z'::timestamptz),
    (103, 'third_place', '2026-07-18T21:00:00Z'::timestamptz),
    (104, 'final', '2026-07-19T19:00:00Z'::timestamptz)
)
insert into public.matches (
  match_number,
  phase,
  group_name,
  home_team_id,
  away_team_id,
  match_date,
  home_score,
  away_score,
  winner_team_id,
  status
)
select
  match_number,
  phase::public.match_phase,
  null,
  null,
  null,
  match_date,
  null,
  null,
  null,
  'scheduled'::public.match_status
from knockout_schedule
on conflict (match_number) do update
set
  phase = excluded.phase,
  match_date = excluded.match_date;

create or replace function public.save_knockout_prediction(
  p_match_number integer,
  p_home_team_id bigint,
  p_away_team_id bigint,
  p_home_score integer,
  p_away_score integer,
  p_winner_id bigint
)
returns public.user_knockout_predictions
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  current_user_id uuid := auth.uid();
  target_match public.matches;
  saved_prediction public.user_knockout_predictions;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  select *
  into target_match
  from public.matches
  where match_number = p_match_number
    and phase <> 'group_stage';

  if not found then
    raise exception 'MATCH_NOT_FOUND' using errcode = 'P0002';
  end if;

  if now() >= target_match.match_date then
    raise exception 'PREDICTION_LOCKED' using errcode = 'P0001';
  end if;

  if p_match_number = 103
    or p_home_team_id is null
    or p_away_team_id is null
    or p_home_team_id = p_away_team_id
    or p_winner_id is null
    or p_winner_id not in (p_home_team_id, p_away_team_id)
    or p_home_score not between 0 and 99
    or p_away_score not between 0 and 99
  then
    raise exception 'INVALID_KNOCKOUT_PREDICTION' using errcode = '22023';
  end if;

  insert into public.user_knockout_predictions (
    user_id,
    match_number,
    home_team_id,
    away_team_id,
    predicted_home_score,
    predicted_away_score,
    predicted_winner_id,
    points_awarded,
    updated_at
  )
  values (
    current_user_id,
    p_match_number,
    p_home_team_id,
    p_away_team_id,
    p_home_score,
    p_away_score,
    p_winner_id,
    0,
    now()
  )
  on conflict (user_id, match_number) do update
  set
    home_team_id = excluded.home_team_id,
    away_team_id = excluded.away_team_id,
    predicted_home_score = excluded.predicted_home_score,
    predicted_away_score = excluded.predicted_away_score,
    predicted_winner_id = excluded.predicted_winner_id,
    points_awarded = 0,
    updated_at = now()
  returning *
  into saved_prediction;

  return saved_prediction;
end;
$$;

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

create or replace function public.recalculate_knockout_points_after_match_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if new.match_number between 73 and 104 then
    perform public.recalculate_knockout_match_points(new.match_number);
  end if;
  return new;
end;
$$;

drop trigger if exists recalculate_knockout_points_on_match_result
  on public.matches;

create trigger recalculate_knockout_points_on_match_result
  after update of home_score, away_score, winner_team_id, status
  on public.matches
  for each row
  execute function public.recalculate_knockout_points_after_match_change();

create or replace function public.sync_world_cup_match_result(
  p_match_number integer,
  p_match_date timestamptz,
  p_home_team_code text,
  p_away_team_code text,
  p_home_score integer,
  p_away_score integer,
  p_winner_team_code text,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  home_id bigint;
  away_id bigint;
  winner_id bigint;
begin
  select id into home_id from public.teams where fifa_code = p_home_team_code;
  select id into away_id from public.teams where fifa_code = p_away_team_code;
  select id into winner_id from public.teams where fifa_code = p_winner_team_code;

  update public.matches
  set
    match_date = coalesce(p_match_date, match_date),
    home_team_id = coalesce(home_id, home_team_id),
    away_team_id = coalesce(away_id, away_team_id),
    home_score = p_home_score,
    away_score = p_away_score,
    winner_team_id = winner_id,
    status = p_status::public.match_status
  where match_number = p_match_number;
end;
$$;

revoke all on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, text, text
) from public;
grant execute on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, text, text
) to service_role;

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
