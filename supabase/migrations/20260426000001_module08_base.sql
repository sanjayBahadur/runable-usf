create extension if not exists pgcrypto;

create type public.run_status as enum ('draft', 'recording', 'completed', 'invalid');
create type public.issue_status as enum ('open', 'fixed');
create type public.issue_category as enum ('Litter', 'Broken Infrastructure', 'Pavement Damage', 'Other');
create type public.sighting_category as enum ('wildlife', 'hazard', 'landmark', 'event', 'other');
create type public.feed_item_type as enum (
  'run_completed',
  'territory_claimed',
  'issue_reported',
  'issue_fixed',
  'sighting_added',
  'landmark_named',
  'art_updated'
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  primary_color text not null,
  accent_color text not null,
  member_count integer not null default 0,
  total_points integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar_url text,
  home_group_id uuid references public.groups(id) on delete set null,
  points integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default timezone('utc', now()),
  unique (user_id, group_id)
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete restrict,
  path jsonb not null default '[]'::jsonb,
  distance_meters double precision not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz,
  status public.run_status not null default 'draft',
  loop_result jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.territory_claims (
  id uuid primary key default gen_random_uuid(),
  run_session_id uuid not null references public.runs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete restrict,
  boundary jsonb not null,
  area_square_meters double precision not null,
  period_id text not null,
  period_name text not null,
  score double precision not null,
  distance_meters double precision not null,
  duration_seconds double precision not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.cell_scores (
  id uuid primary key default gen_random_uuid(),
  cell_id text not null,
  group_id uuid not null references public.groups(id) on delete cascade,
  period_id text not null,
  score double precision not null,
  source_claim_ids uuid[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cell_id, group_id, period_id)
);

create table public.cell_ownership (
  id uuid primary key default gen_random_uuid(),
  cell_id text not null,
  period_id text not null,
  group_id uuid not null references public.groups(id) on delete cascade,
  score double precision not null,
  runner_up_group_id uuid references public.groups(id) on delete set null,
  runner_up_score double precision,
  source_claim_ids uuid[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cell_id, period_id)
);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category public.issue_category not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  status public.issue_status not null default 'open',
  reported_by_user_id uuid not null references public.profiles(id) on delete cascade,
  fixed_by_user_id uuid references public.profiles(id) on delete set null,
  photo_path text,
  after_photo_path text,
  created_at timestamptz not null default timezone('utc', now()),
  fixed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.sightings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category public.sighting_category not null,
  latitude double precision not null,
  longitude double precision not null,
  reported_by_user_id uuid not null references public.profiles(id) on delete cascade,
  photo_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cell_art (
  cell_id text primary key,
  group_id uuid not null references public.groups(id) on delete cascade,
  color text not null,
  pixels jsonb,
  pattern_id text,
  updated_by_user_id uuid not null references public.profiles(id) on delete cascade,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.feed_items (
  id uuid primary key default gen_random_uuid(),
  type public.feed_item_type not null,
  actor_user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  title text not null,
  body text not null,
  related_entity_id text,
  created_at timestamptz not null default timezone('utc', now())
);

create index runs_user_id_idx on public.runs (user_id);
create index runs_group_id_idx on public.runs (group_id);
create index territory_claims_group_id_idx on public.territory_claims (group_id);
create index territory_claims_period_id_idx on public.territory_claims (period_id);
create index cell_scores_cell_id_idx on public.cell_scores (cell_id);
create index cell_ownership_cell_id_idx on public.cell_ownership (cell_id);
create index issues_status_idx on public.issues (status);
create index sightings_category_idx on public.sightings (category);
create index feed_items_created_at_idx on public.feed_items (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_username text;
begin
  generated_username := coalesce(
    nullif(split_part(new.email, '@', 1), ''),
    'user-' || substr(new.id::text, 1, 8)
  );

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    generated_username || '-' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data ->> 'display_name', generated_username)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.sync_group_member_count()
returns trigger
language plpgsql
as $$
declare
  target_group_id uuid;
begin
  target_group_id := coalesce(new.group_id, old.group_id);

  update public.groups
  set member_count = (
    select count(*)
    from public.group_memberships
    where group_id = target_group_id
  ),
  updated_at = timezone('utc', now())
  where id = target_group_id;

  return coalesce(new, old);
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger groups_set_updated_at
before update on public.groups
for each row execute function public.set_updated_at();

create trigger runs_set_updated_at
before update on public.runs
for each row execute function public.set_updated_at();

create trigger issues_set_updated_at
before update on public.issues
for each row execute function public.set_updated_at();

create trigger sightings_set_updated_at
before update on public.sightings
for each row execute function public.set_updated_at();

create trigger handle_new_user_after_signup
after insert on auth.users
for each row execute function public.handle_new_user();

create trigger group_memberships_sync_member_count_insert
after insert on public.group_memberships
for each row execute function public.sync_group_member_count();

create trigger group_memberships_sync_member_count_delete
after delete on public.group_memberships
for each row execute function public.sync_group_member_count();

alter table public.groups enable row level security;
alter table public.profiles enable row level security;
alter table public.group_memberships enable row level security;
alter table public.runs enable row level security;
alter table public.territory_claims enable row level security;
alter table public.cell_scores enable row level security;
alter table public.cell_ownership enable row level security;
alter table public.issues enable row level security;
alter table public.sightings enable row level security;
alter table public.cell_art enable row level security;
alter table public.feed_items enable row level security;

create policy "groups are readable by authenticated users"
on public.groups for select
to authenticated
using (true);

create policy "authenticated users can create groups"
on public.groups for insert
to authenticated
with check (true);

create policy "authenticated users can update groups for mvp"
on public.groups for update
to authenticated
using (true)
with check (true);

create policy "profiles are readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "group memberships are readable by authenticated users"
on public.group_memberships for select
to authenticated
using (true);

create policy "users can join groups as themselves"
on public.group_memberships for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can leave their own group memberships"
on public.group_memberships for delete
to authenticated
using (user_id = auth.uid());

create policy "runs are readable by authenticated users"
on public.runs for select
to authenticated
using (true);

create policy "users can insert their own runs"
on public.runs for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update their own runs"
on public.runs for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "territory claims are readable by authenticated users"
on public.territory_claims for select
to authenticated
using (true);

create policy "users can insert their own territory claims"
on public.territory_claims for insert
to authenticated
with check (user_id = auth.uid());

create policy "cell scores are readable by authenticated users"
on public.cell_scores for select
to authenticated
using (true);

create policy "cell ownership is readable by authenticated users"
on public.cell_ownership for select
to authenticated
using (true);

create policy "authenticated users can write cell scores for mvp"
on public.cell_scores for all
to authenticated
using (true)
with check (true);

create policy "authenticated users can write cell ownership for mvp"
on public.cell_ownership for all
to authenticated
using (true)
with check (true);

create policy "issues are readable by authenticated users"
on public.issues for select
to authenticated
using (true);

create policy "users can report issues as themselves"
on public.issues for insert
to authenticated
with check (reported_by_user_id = auth.uid());

create policy "authenticated users can update issues for mvp"
on public.issues for update
to authenticated
using (true)
with check (true);

create policy "sightings are readable by authenticated users"
on public.sightings for select
to authenticated
using (true);

create policy "users can report sightings as themselves"
on public.sightings for insert
to authenticated
with check (reported_by_user_id = auth.uid());

create policy "users can update their own sightings"
on public.sightings for update
to authenticated
using (reported_by_user_id = auth.uid())
with check (reported_by_user_id = auth.uid());

create policy "cell art is readable by authenticated users"
on public.cell_art for select
to authenticated
using (true);

create policy "users can insert cell art as themselves"
on public.cell_art for insert
to authenticated
with check (updated_by_user_id = auth.uid());

create policy "authenticated users can update cell art for mvp"
on public.cell_art for update
to authenticated
using (true)
with check (updated_by_user_id = auth.uid());

create policy "feed items are readable by authenticated users"
on public.feed_items for select
to authenticated
using (true);

create policy "authenticated users can insert feed items for mvp"
on public.feed_items for insert
to authenticated
with check (actor_user_id = auth.uid());
