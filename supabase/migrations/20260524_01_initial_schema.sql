-- =====================================================================
-- BuildPilot — Initial Schema
-- 10 core tables for the SPDD product memory system
-- Run this in Supabase SQL Editor BEFORE the RLS policies migration.
-- =====================================================================

-- profiles: one row per auth user (auto-created via trigger)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- projects: top-level container, one row per user product
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  current_stage text default 'idea_capture',
  status text default 'active',
  preferred_stack jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status);

-- artifacts: product_brief, prd, architecture, data_model, etc.
create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null,
  title text not null,
  content_markdown text,
  content_json jsonb default '{}'::jsonb,
  status text default 'draft',
  version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index artifacts_project_id_idx on public.artifacts(project_id);
create index artifacts_type_idx on public.artifacts(type);

-- decisions: architectural and product decisions extracted by AI or added manually
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  decision text not null,
  rationale text,
  alternatives jsonb default '[]'::jsonb,
  category text default 'technical',
  status text default 'active',
  source_artifact_id uuid references public.artifacts(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index decisions_project_id_idx on public.decisions(project_id);
create index decisions_status_idx on public.decisions(status);

-- tasks: build tasks generated from PRD + architecture
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  phase text,
  priority text default 'medium',
  complexity text default 'medium',
  status text default 'not_started',
  recommended_tool text,
  acceptance_criteria jsonb default '[]'::jsonb,
  dependencies jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_status_idx on public.tasks(status);

-- missions: one mission brief per task per tool session
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  tool_name text,
  mission_brief text,
  return_prompt text,
  status text default 'draft',
  sent_at timestamptz,
  returned_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index missions_project_id_idx on public.missions(project_id);
create index missions_task_id_idx on public.missions(task_id);

-- tool_sessions: raw return briefs + parsed analysis from external tools
create table public.tool_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete set null,
  tool_name text,
  raw_summary text,
  parsed_summary jsonb default '{}'::jsonb,
  status text default 'pending',
  created_at timestamptz default now()
);
create index tool_sessions_project_id_idx on public.tool_sessions(project_id);
create index tool_sessions_mission_id_idx on public.tool_sessions(mission_id);

-- risks: risk register, populated by AI from return analysis + manual entries
create table public.risks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  severity text default 'medium',
  category text default 'technical',
  source text,
  status text default 'open',
  recommended_action text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index risks_project_id_idx on public.risks(project_id);
create index risks_severity_idx on public.risks(severity);

-- open_questions: unresolved product/technical questions
create table public.open_questions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  question text not null,
  category text default 'product',
  status text default 'open',
  answer text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index open_questions_project_id_idx on public.open_questions(project_id);

-- ai_logs: audit trail for every AI call (debugging + cost tracking)
create table public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  task_type text not null,
  provider text default 'anthropic',
  model text,
  input jsonb default '{}'::jsonb,
  output jsonb default '{}'::jsonb,
  raw_output text,
  status text default 'success',
  error text,
  created_at timestamptz default now()
);
create index ai_logs_project_id_idx on public.ai_logs(project_id);
create index ai_logs_task_type_idx on public.ai_logs(task_type);

-- =====================================================================
-- Auto-create profile row when a new auth user signs up
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- updated_at auto-update trigger for all timestamped tables
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger artifacts_set_updated_at before update on public.artifacts for each row execute function public.set_updated_at();
create trigger decisions_set_updated_at before update on public.decisions for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger missions_set_updated_at before update on public.missions for each row execute function public.set_updated_at();
create trigger risks_set_updated_at before update on public.risks for each row execute function public.set_updated_at();
create trigger open_questions_set_updated_at before update on public.open_questions for each row execute function public.set_updated_at();
