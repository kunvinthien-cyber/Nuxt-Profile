-- ============================================================
-- NexusApp — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- ─── Enable UUID extension ────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES table ──────────────────────────────────────────
-- Mirrors auth.users with extra public fields
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  first_name  text,
  last_name   text,
  avatar_url  text,
  bio         text,
  location    text,
  website     text,
  role        text not null default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

-- Attach trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── TEAM MEMBERS table ──────────────────────────────────────
create table if not exists public.team_members (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'member' check (role in ('admin', 'member', 'viewer')),
  status      text not null default 'pending' check (status in ('active', 'pending', 'removed')),
  invited_at  timestamptz not null default now(),
  accepted_at timestamptz,
  unique (owner_id, email)
);

alter table public.team_members enable row level security;

create policy "Owner can manage team"
  on public.team_members for all
  using (auth.uid() = owner_id);

-- ─── PROJECTS table ──────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  status      text not null default 'active' check (status in ('active', 'archived', 'completed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can manage own projects"
  on public.projects for all
  using (auth.uid() = user_id);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

-- ─── ACTIVITY LOG table ──────────────────────────────────────
create table if not exists public.activity_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  event       text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "Users can view own activity"
  on public.activity_log for select
  using (auth.uid() = user_id);

create policy "System can insert activity"
  on public.activity_log for insert
  with check (auth.uid() = user_id);

-- ─── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_profiles_email        on public.profiles(email);
create index if not exists idx_team_members_owner    on public.team_members(owner_id);
create index if not exists idx_projects_user         on public.projects(user_id);
create index if not exists idx_activity_user_created on public.activity_log(user_id, created_at desc);

-- ─── Done! ───────────────────────────────────────────────────
-- Your schema is ready. Make sure to:
-- 1. Enable "Email" provider in Auth → Providers
-- 2. Add your site URL in Auth → URL Configuration
-- 3. (Optional) Enable Google/GitHub OAuth in Auth → Providers
