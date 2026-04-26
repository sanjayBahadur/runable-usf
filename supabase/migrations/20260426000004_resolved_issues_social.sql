-- Add fix description to issues
alter table public.issues
add column fix_description text;

-- Issue comments table
create table public.issue_comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Issue likes table
create table public.issue_likes (
  issue_id uuid not null references public.issues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (issue_id, user_id)
);

-- False completions reports table
create table public.false_completions (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  description text not null,
  verification_result jsonb,
  is_verified boolean,
  created_at timestamptz not null default timezone('utc', now())
);

-- Indexes
create index issue_comments_issue_id_idx on public.issue_comments (issue_id);
create index issue_likes_issue_id_idx on public.issue_likes (issue_id);
create index false_completions_issue_id_idx on public.false_completions (issue_id);

-- RLS
alter table public.issue_comments enable row level security;
alter table public.issue_likes enable row level security;
alter table public.false_completions enable row level security;

-- Comments policies
create policy "issue comments are readable by authenticated users"
on public.issue_comments for select
to authenticated
using (true);

create policy "users can insert their own issue comments"
on public.issue_comments for insert
to authenticated
with check (user_id = auth.uid());

-- Likes policies
create policy "issue likes are readable by authenticated users"
on public.issue_likes for select
to authenticated
using (true);

create policy "users can insert their own issue likes"
on public.issue_likes for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can delete their own issue likes"
on public.issue_likes for delete
to authenticated
using (user_id = auth.uid());

-- False completions policies
create policy "false completions are readable by authenticated users"
on public.false_completions for select
to authenticated
using (true);

create policy "users can insert their own false completions"
on public.false_completions for insert
to authenticated
with check (reporter_id = auth.uid());
