-- ============================================================
-- BASE APP — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- PROFILES
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text not null,
  role            text not null default 'client' check (role in ('client', 'mentor')),
  age             integer,
  height_cm       numeric,
  weight_kg       numeric,
  goal_weight_kg  numeric,
  daily_kcal_goal integer not null default 2500,
  training_days   text[] not null default array['lunes','miercoles','viernes'],
  meals_per_day   integer not null default 3 check (meals_per_day between 3 and 5),
  start_date      date not null default current_date,
  created_at      timestamptz not null default now()
);

-- NON NEGOTIABLES
create table if not exists public.non_negotiables (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  date            date not null,
  rest_done       boolean not null default false,
  movement_done   boolean not null default false,
  nutrition_done  boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (user_id, date)
);

-- MEALS
create table if not exists public.meals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  date            date not null,
  meal_type       text not null check (meal_type in ('desayuno','media_manana','comida','merienda','cena')),
  foods           text,
  kcal_estimated  integer,
  hunger_before   integer check (hunger_before between 1 and 10),
  satiety_after   integer check (satiety_after between 1 and 10),
  mood            text check (mood in ('bien','neutro','bajo','estres','ansiedad')),
  photo_url       text,
  notes           text,
  created_at      timestamptz not null default now()
);

-- TRAININGS
create table if not exists public.trainings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  date            date not null,
  completed       boolean not null default false,
  energy_level    integer check (energy_level between 1 and 10),
  difficulty      integer check (difficulty between 1 and 10),
  notes           text,
  created_at      timestamptz not null default now(),
  unique (user_id, date)
);

-- EVIDENCES
create table if not exists public.evidences (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  date            date not null,
  evidence_1      text,
  evidence_2      text,
  evidence_3      text,
  created_at      timestamptz not null default now(),
  unique (user_id, date)
);

-- MENTOR FEEDBACK
create table if not exists public.mentor_feedback (
  id              uuid primary key default gen_random_uuid(),
  mentor_id       uuid not null references public.profiles(id) on delete cascade,
  client_id       uuid not null references public.profiles(id) on delete cascade,
  message         text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.non_negotiables  enable row level security;
alter table public.meals            enable row level security;
alter table public.trainings        enable row level security;
alter table public.evidences        enable row level security;
alter table public.mentor_feedback  enable row level security;

-- PROFILES policies
create policy "Own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Mentor can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'mentor')
  );

-- Non-negotiables policies
create policy "Client owns non_negotiables" on public.non_negotiables
  for all using (auth.uid() = user_id);

create policy "Mentor reads all non_negotiables" on public.non_negotiables
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'mentor')
  );

-- Meals policies
create policy "Client owns meals" on public.meals
  for all using (auth.uid() = user_id);

create policy "Mentor reads all meals" on public.meals
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'mentor')
  );

-- Trainings policies
create policy "Client owns trainings" on public.trainings
  for all using (auth.uid() = user_id);

create policy "Mentor reads all trainings" on public.trainings
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'mentor')
  );

-- Evidences policies
create policy "Client owns evidences" on public.evidences
  for all using (auth.uid() = user_id);

create policy "Mentor reads all evidences" on public.evidences
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'mentor')
  );

-- Mentor feedback policies
create policy "Client reads own feedback" on public.mentor_feedback
  for select using (auth.uid() = client_id);

create policy "Client marks own feedback read" on public.mentor_feedback
  for update using (auth.uid() = client_id);

create policy "Mentor manages own feedback" on public.mentor_feedback
  for all using (auth.uid() = mentor_id);

-- ============================================================
-- SAMPLE CLIENT (Oscar) — optional, run after creating users
-- ============================================================
-- UPDATE public.profiles
-- SET age = 31, height_cm = 180, weight_kg = 120, goal_weight_kg = 85, daily_kcal_goal = 2500
-- WHERE email = 'oscar@ejemplo.com';
