-- Secures prediction writes behind a validated RPC.

create unique index if not exists predictions_user_match_key
  on public.predictions (user_id, match_id);

alter table public.predictions
  drop constraint if exists predictions_home_score_range,
  drop constraint if exists predictions_away_score_range;

alter table public.predictions
  add constraint predictions_home_score_range
    check (predicted_home_score between 0 and 99),
  add constraint predictions_away_score_range
    check (predicted_away_score between 0 and 99);

alter table public.predictions enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'predictions'
  loop
    execute format(
      'drop policy if exists %I on public.predictions',
      policy_record.policyname
    );
  end loop;
end
$$;

create policy "Users can read their own predictions"
  on public.predictions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.save_match_prediction(
  p_match_id bigint,
  p_home_score integer,
  p_away_score integer
)
returns public.predictions
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  current_user_id uuid := auth.uid();
  target_match public.matches;
  saved_prediction public.predictions;
  predicted_winner bigint;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED'
      using errcode = '42501';
  end if;

  if p_home_score is null
    or p_away_score is null
    or p_home_score not between 0 and 99
    or p_away_score not between 0 and 99
  then
    raise exception 'INVALID_SCORE'
      using errcode = '22023';
  end if;

  select *
  into target_match
  from public.matches
  where id = p_match_id;

  if not found then
    raise exception 'MATCH_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  if now() >= target_match.match_date then
    raise exception 'PREDICTION_LOCKED'
      using errcode = 'P0001';
  end if;

  predicted_winner := case
    when p_home_score > p_away_score then target_match.home_team_id
    when p_away_score > p_home_score then target_match.away_team_id
    else null
  end;

  insert into public.predictions (
    user_id,
    match_id,
    predicted_home_score,
    predicted_away_score,
    predicted_winner_id,
    points_awarded,
    updated_at
  )
  values (
    current_user_id,
    p_match_id,
    p_home_score,
    p_away_score,
    predicted_winner,
    0,
    now()
  )
  on conflict (user_id, match_id) do update
  set
    predicted_home_score = excluded.predicted_home_score,
    predicted_away_score = excluded.predicted_away_score,
    predicted_winner_id = excluded.predicted_winner_id,
    updated_at = now()
  returning *
  into saved_prediction;

  return saved_prediction;
end;
$$;

revoke all on function public.save_match_prediction(bigint, integer, integer)
  from public;

grant execute on function public.save_match_prediction(bigint, integer, integer)
  to authenticated;
