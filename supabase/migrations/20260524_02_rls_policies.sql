-- =====================================================================
-- BuildPilot — Row Level Security (RLS) Policies
-- Run AFTER 20260524_01_initial_schema.sql
-- Every user can only see/modify their own data.
-- =====================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.artifacts enable row level security;
alter table public.decisions enable row level security;
alter table public.tasks enable row level security;
alter table public.missions enable row level security;
alter table public.tool_sessions enable row level security;
alter table public.risks enable row level security;
alter table public.open_questions enable row level security;
alter table public.ai_logs enable row level security;

-- profiles: user can only see/update their own row
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- projects: user can only manage their own projects
create policy "projects: select own"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "projects: insert own"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "projects: update own"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "projects: delete own"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Generic policy template for all project-child tables:
-- user can do ALL operations if they own the parent project.

-- artifacts
create policy "artifacts: all own project"
  on public.artifacts for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = artifacts.project_id
        and projects.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = artifacts.project_id
        and projects.user_id = auth.uid()
    )
  );

-- decisions
create policy "decisions: all own project"
  on public.decisions for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- tasks
create policy "tasks: all own project"
  on public.tasks for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- missions
create policy "missions: all own project"
  on public.missions for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- tool_sessions
create policy "tool_sessions: all own project"
  on public.tool_sessions for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- risks
create policy "risks: all own project"
  on public.risks for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- open_questions
create policy "open_questions: all own project"
  on public.open_questions for all
  using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- ai_logs: allow rows with null project_id (system-level logs) for any auth'd user,
-- and project-scoped logs only for project owner.
create policy "ai_logs: select own or system"
  on public.ai_logs for select
  using (
    project_id is null
    or exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "ai_logs: insert own or system"
  on public.ai_logs for insert
  with check (
    project_id is null
    or exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
