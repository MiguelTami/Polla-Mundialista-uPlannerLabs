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
  where
    (
      p_match_number is not null
      and match_number = p_match_number
    )
    or (
      home_id is not null
      and away_id is not null
      and home_team_id = home_id
      and away_team_id = away_id
      and abs(extract(epoch from (match_date - p_match_date))) < 43200
    );
end;
$$;

revoke all on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, text, text
) from public;
grant execute on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, text, text
) to service_role;
