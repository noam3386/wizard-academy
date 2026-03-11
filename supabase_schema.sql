-- הרץ את זה ב-Supabase → SQL Editor

create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  reading_current_level integer default 1,
  reading_stars jsonb default '{}'::jsonb,
  math_current_level integer default 1,
  math_stars jsonb default '{}'::jsonb,
  grammar_current_level integer default 1,
  grammar_stars jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
