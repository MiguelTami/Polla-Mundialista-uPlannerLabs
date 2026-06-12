-- Participants need read access to render the tournament calendar.

alter table public.teams enable row level security;
alter table public.matches enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'teams'
      and policyname = 'Authenticated users can read teams'
  ) then
    create policy "Authenticated users can read teams"
      on public.teams
      for select
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'matches'
      and policyname = 'Authenticated users can read matches'
  ) then
    create policy "Authenticated users can read matches"
      on public.matches
      for select
      to authenticated
      using (true);
  end if;
end
$$;
