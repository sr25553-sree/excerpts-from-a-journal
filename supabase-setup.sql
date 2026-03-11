-- Excerpts from a Journal — Database Setup
-- Run this in your Supabase project's SQL Editor (supabase.com → your project → SQL Editor)

-- Create tables
create table entries (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  mood text check (mood in ('grief', 'joy', 'longing', 'anger', 'tenderness', 'confusion', 'relief')),
  location text,
  entry_date date default current_date,
  created_at timestamp with time zone default now(),
  is_approved boolean default true
);

create table reactions (
  id uuid default gen_random_uuid() primary key,
  entry_id uuid references entries(id) on delete cascade,
  type text check (type in ('felt_this', 'not_alone', 'thank_you')),
  created_at timestamp with time zone default now()
);

-- Content length constraint (1–5000 characters)
alter table entries add constraint content_length
  check (char_length(trim(content)) >= 1 and char_length(content) <= 5000);

-- Indexes for performance
create index idx_entries_created_at on entries (created_at desc);
create index idx_entries_approved_created on entries (is_approved, created_at desc);

-- Row Level Security
alter table entries enable row level security;
alter table reactions enable row level security;

-- Anyone can read approved entries
create policy "Anyone can read approved entries"
  on entries for select
  using (is_approved = true);

-- Anyone can insert entries
create policy "Anyone can insert entries"
  on entries for insert
  with check (true);

-- Function for efficient random entry selection
create or replace function get_random_entry()
returns setof entries
language sql
as $$
  select * from entries
  where is_approved = true
  offset floor(random() * (select count(*) from entries where is_approved = true))
  limit 1;
$$;

-- Phase 2: Reactions RLS and additional indexes

-- Anyone can insert a reaction (anonymous)
create policy "Anyone can insert reactions"
  on reactions for insert
  with check (true);

-- No one can read reactions via the public API
create policy "No public read access to reactions"
  on reactions for select
  using (false);

-- Indexes for reactions performance
create index idx_reactions_entry_id on reactions (entry_id);
create index idx_reactions_entry_type on reactions (entry_id, type);

-- Index for mood-based browsing
create index idx_entries_mood_approved on entries (mood, is_approved, created_at desc);
