create or replace function public.sync_world_cup_match_result(
  p_match_number integer,
  p_match_date timestamptz,
  p_home_team_code text,
  p_away_team_code text,
  p_home_score integer,
  p_away_score integer,
  p_home_penalty_score integer,
  p_away_penalty_score integer,
  p_winner_team_code text,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  incoming_home_id bigint;
  incoming_away_id bigint;
  current_home_id bigint;
  current_away_id bigint;
  normalized_home_id bigint;
  normalized_away_id bigint;
  normalized_home_score integer := p_home_score;
  normalized_away_score integer := p_away_score;
  normalized_home_penalty_score integer := p_home_penalty_score;
  normalized_away_penalty_score integer := p_away_penalty_score;
  winner_id bigint;
begin
  if p_match_number is null then
    return;
  end if;

  select id into incoming_home_id from public.teams where fifa_code = p_home_team_code;
  select id into incoming_away_id from public.teams where fifa_code = p_away_team_code;
  select id into winner_id from public.teams where fifa_code = p_winner_team_code;

  select home_team_id, away_team_id
  into current_home_id, current_away_id
  from public.matches
  where match_number = p_match_number;

  normalized_home_id := incoming_home_id;
  normalized_away_id := incoming_away_id;

  if current_home_id is not null
    and current_away_id is not null
    and incoming_home_id is not null
    and incoming_away_id is not null
  then
    if current_home_id = incoming_home_id
      and current_away_id = incoming_away_id
    then
      normalized_home_id := current_home_id;
      normalized_away_id := current_away_id;
    elsif current_home_id = incoming_away_id
      and current_away_id = incoming_home_id
    then
      normalized_home_id := current_home_id;
      normalized_away_id := current_away_id;
      normalized_home_score := p_away_score;
      normalized_away_score := p_home_score;
      normalized_home_penalty_score := p_away_penalty_score;
      normalized_away_penalty_score := p_home_penalty_score;
    end if;
  end if;

  update public.matches
  set
    match_date = coalesce(p_match_date, match_date),
    home_team_id = coalesce(normalized_home_id, home_team_id),
    away_team_id = coalesce(normalized_away_id, away_team_id),
    home_score = normalized_home_score,
    away_score = normalized_away_score,
    home_penalty_score = normalized_home_penalty_score,
    away_penalty_score = normalized_away_penalty_score,
    winner_team_id = winner_id,
    status = p_status::public.match_status
  where match_number = p_match_number;
end;
$$;

revoke all on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, integer, integer, text, text
) from public;
grant execute on function public.sync_world_cup_match_result(
  integer, timestamptz, text, text, integer, integer, integer, integer, text, text
) to service_role;
