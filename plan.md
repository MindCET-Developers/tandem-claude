# BuildPilot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build BuildPilot — an AI-guided product development OS that helps independent builders turn ideas into maintainable software through a structured SPDD loop (Plan → Prompt → Build Elsewhere → Return → Review → Update Memory → Continue).

**Architecture:** Next.js 14 App Router with Supabase Auth + Postgres for persistence, Vercel AI SDK with Anthropic Claude for all AI features, shadcn/ui for components. The SPDD engine generates structured Mission Briefs from project memory and parses Return Briefs back into structured artifacts, decisions, risks, and next-step recommendations.

**Tech Stack:** Next.js 16.2.6 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase Auth + Postgres + RLS · Vercel AI SDK · Anthropic `claude-sonnet-4-5` · Vercel deployment · GitHub

**Project location:** `C:\dev\buildpilot` (moved from documents folder — shadcn CLI fails on paths with spaces)
**Planning docs:** `C:\Users\User\OneDrive - Center For Education Technology\Documents\MindCET\Tandem - Claude Code\`

**UI Language:** Hebrew + English bilingual (Hebrew labels/copy, English technical terms and AI prompts)

---

## Phase Overview

| Phase | Name | Status | Key Deliverable |
|-------|------|--------|----------------|
| Pre | Skill Installation | [x] | Claude Code skills: Supabase + Next.js + Code Review |
| 0 | Repo Setup | [~] | Working Next.js app on Vercel with CLAUDE.md |
| 1 | Auth + Dashboard | [ ] | Supabase auth + project CRUD + project cards |
| 2 | Project Wizard + Brief | [ ] | AI Product Brief generation from raw idea |
| 3 | PRD + Architecture | [ ] | PRD & architecture generators + decision extraction |
| 4 | Task Planner + Missions | [ ] | Task generation + Mission Brief copy-paste UI |
| 5 | Return Brief Loop | [ ] | Paste return brief + AI analysis + drift detection |
| 6 | Living Docs | [x] | Markdown export + decision log + risk register |
| 7 | AI Companion | [ ] | Context-aware chatbot: tool routing, prompts, memory ingestion |

---

## Project File Structure

```
buildpilot/                                 ← New folder in current directory
├── CLAUDE.md                               ← Claude Code project instructions (Phase 0)
├── .env.local                              ← Environment variables (gitignored)
├── .env.example                            ← Environment template (committed)
├── middleware.ts                           ← Next.js auth route protection
│
├── app/
│   ├── layout.tsx                          ← Root layout, fonts, providers
│   ├── page.tsx                            ← Landing page /
│   │
│   ├── (auth)/
│   │   ├── layout.tsx                      ← Auth layout (centered card)
│   │   └── login/
│   │       └── page.tsx                    ← Login + signup (email/password)
│   │
│   ├── (app)/
│   │   ├── layout.tsx                      ← App shell with sidebar nav
│   │   ├── app/
│   │   │   └── page.tsx                    ← /app — Project dashboard
│   │   └── app/projects/
│   │       ├── new/
│   │       │   └── page.tsx                ← /app/projects/new — Wizard
│   │       └── [projectId]/
│   │           ├── layout.tsx              ← Project nav (sidebar tabs)
│   │           ├── page.tsx                ← /app/projects/[id] — Overview
│   │           ├── brief/page.tsx          ← Product brief
│   │           ├── prd/page.tsx            ← PRD viewer/editor
│   │           ├── architecture/page.tsx   ← Architecture map
│   │           ├── tasks/page.tsx          ← Task planner
│   │           ├── missions/
│   │           │   ├── page.tsx            ← Missions list
│   │           │   └── [missionId]/page.tsx← Mission detail + copy brief
│   │           ├── return/page.tsx         ← Paste return brief
│   │           ├── decisions/page.tsx      ← Decision log
│   │           ├── risks/page.tsx          ← Risk register
│   │           └── docs/page.tsx           ← Living docs export
│   │
│   └── api/
│       └── ai/
│           ├── generate-brief/route.ts     ← POST: generate product brief
│           ├── generate-prd/route.ts       ← POST: generate PRD
│           ├── generate-architecture/route.ts ← POST: generate architecture
│           ├── generate-tasks/route.ts     ← POST: generate task list
│           ├── generate-mission/route.ts   ← POST: generate mission brief
│           └── analyze-return/route.ts     ← POST: analyze return brief
│
├── components/
│   ├── ui/                                 ← shadcn/ui auto-generated
│   ├── layout/
│   │   ├── AppNav.tsx                      ← App sidebar
│   │   └── ProjectNav.tsx                  ← Per-project tab nav
│   ├── dashboard/
│   │   ├── ProjectCard.tsx                 ← Card: name, stage, next action
│   │   └── EmptyState.tsx                  ← Empty dashboard prompt
│   ├── project/
│   │   ├── ProjectOverview.tsx             ← Command center layout
│   │   ├── NextActionCard.tsx              ← "What to do next" card
│   │   └── StageProgress.tsx               ← Lifecycle stage progress bar
│   ├── wizard/
│   │   ├── ProjectWizard.tsx               ← Multi-step form shell
│   │   ├── IdeaStep.tsx                    ← Step 1: raw idea input
│   │   ├── ClarifyStep.tsx                 ← Step 2: AI clarification Q&A
│   │   └── BriefPreviewStep.tsx            ← Step 3: review generated brief
│   ├── artifacts/
│   │   ├── ArtifactViewer.tsx              ← Markdown renderer
│   │   └── ArtifactEditor.tsx              ← Editable markdown + approve button
│   ├── tasks/
│   │   ├── TaskList.tsx                    ← Full task list
│   │   └── TaskCard.tsx                    ← Task row with status + tool badge
│   ├── missions/
│   │   ├── MissionBriefCard.tsx            ← Copy-paste brief with copy button
│   │   ├── ReturnBriefInput.tsx            ← Textarea + submit for paste
│   │   └── ToolRecommendation.tsx          ← "Use this tool" card
│   ├── decisions/
│   │   └── DecisionCard.tsx                ← Title, decision, rationale
│   └── risks/
│       └── RiskCard.tsx                    ← Title, severity badge, action
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       ← createBrowserClient()
│   │   ├── server.ts                       ← createServerClient()
│   │   └── middleware.ts                   ← updateSession() for middleware.ts
│   ├── ai/
│   │   ├── client.ts                       ← Anthropic SDK init
│   │   ├── prompts.ts                      ← All system + user prompt templates
│   │   ├── schemas.ts                      ← Zod schemas for all AI outputs
│   │   └── service.ts                      ← AIService class wrapping all tasks
│   └── utils.ts                            ← cn(), formatDate(), etc.
│
├── types/
│   ├── database.ts                         ← Supabase generated types (supabase gen types)
│   └── index.ts                            ← Domain types: Project, Artifact, Task, etc.
│
├── hooks/
│   ├── useProject.ts                       ← Project + artifacts data fetching
│   └── useAI.ts                            ← AI generation hooks with loading state
│
└── supabase/
    └── migrations/
        ├── 20240101_initial_schema.sql     ← All tables
        └── 20240102_rls_policies.sql       ← RLS policies for all tables
```

---

## Pre-Phase: Skill Installation

> Install Claude Code skills that improve accuracy when working with Supabase and Next.js AI apps.

### Task P-1: Install Supabase Agent Skills

- [ ] Open terminal in the `buildpilot/` project root (once created in Phase 0) and run:
  ```bash
  claude skills install https://github.com/supabase/agent-skills
  ```
- [ ] Verify the skill appears in Claude Code settings
- [ ] Note: This skill improves AI accuracy for RLS policies, migrations, and auth patterns

### Task P-2: Install Next.js AI Skills

- [ ] Run:
  ```bash
  claude skills install https://github.com/laguagu/claude-code-nextjs-skills
  ```
- [ ] Verify installation

### Task P-3: Install Code Review Skill

- [ ] Run:
  ```bash
  claude skills install https://github.com/awesome-skills/code-review-skill
  ```
- [ ] Use this skill after completing each phase to review generated code

---

## Phase 0: Repo Setup

> Create a clean, deployable Next.js skeleton with CLAUDE.md, GitHub, and Vercel.

### Task 0-1: Bootstrap Next.js App

- [ ] From the current documents directory, run:
  ```bash
  npx create-next-app@latest buildpilot \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir=false \
    --import-alias="@/*"
  ```
- [ ] Enter the project:
  ```bash
  cd buildpilot
  ```
- [ ] Verify it builds:
  ```bash
  npm run build
  ```
  Expected: successful build with no errors

### Task 0-2: Add shadcn/ui

- [ ] Initialize shadcn/ui:
  ```bash
  npx shadcn@latest init
  ```
  Select: Default style, Slate base color, CSS variables: Yes
- [ ] Add required components:
  ```bash
  npx shadcn@latest add button card badge input label textarea
  npx shadcn@latest add select separator sheet sidebar tabs
  npx shadcn@latest add toast sonner progress
  ```
- [ ] Verify by running `npm run dev` and checking `http://localhost:3000`

### Task 0-3: Add Dependencies

- [ ] Install Supabase, AI SDK, and utilities:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  npm install ai @ai-sdk/anthropic
  npm install zod react-hook-form @hookform/resolvers
  npm install @uiw/react-md-editor
  npm install date-fns
  ```
- [ ] Verify: `npm run build` passes

### Task 0-4: Create CLAUDE.md

- [ ] Create `buildpilot/CLAUDE.md` with the following content:

```markdown
# BuildPilot — Claude Code Project Instructions

BuildPilot is an AI-guided product development OS for independent builders.
It implements an SPDD loop: Plan → Mission → Build Elsewhere → Return → Review → Update Memory.

## Tech Stack
- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- Supabase Auth + Postgres + RLS
- Vercel AI SDK + Anthropic Claude (claude-sonnet-4-5)
- Vercel deployment

## UI Language
Hebrew labels/copy, English technical terms and AI prompts.
Use Hebrew for: page titles, nav items, button labels, form labels, error messages.
Use English for: code, API routes, console logs, database fields, AI prompts.

## Before Implementing Anything
1. Check prd.md for feature requirements
2. Check spdd.md for SPDD rules
3. Check current database schema in supabase/migrations/
4. Keep scope small — no feature beyond current task
5. Use Supabase RLS-safe patterns (never bypass RLS)
6. Use shadcn/ui components — do not create custom UI primitives
7. Keep AI outputs structured and Zod-validated

## Do NOT
- Overengineer — no abstractions beyond what the task needs
- Silently change architecture or database schema
- Add state management libraries (use React state + server actions)
- Bypass Supabase RLS
- Mark work as done without meeting acceptance criteria

## After Each Task
Provide a summary: files changed · decisions made · risks · next step.
```

- [ ] Commit CLAUDE.md:
  ```bash
  git add CLAUDE.md
  git commit -m "docs: add CLAUDE.md with project instructions"
  ```

### Task 0-5: Set Up Environment Variables

- [ ] Create `.env.example`:
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
  ANTHROPIC_API_KEY=your-anthropic-api-key
  ```
- [ ] Create `.env.local` (not committed) and fill in real values
  - Get Anthropic API key from: https://console.anthropic.com
  - Supabase values will be added in Phase 1
- [ ] Add `.env.local` to `.gitignore` (verify it's already there from Next.js template)

### Task 0-6: Create Supabase Client Helpers

- [ ] Create `lib/supabase/client.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'
  
  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```

- [ ] Create `lib/supabase/server.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  
  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options))
            } catch {}
          },
        },
      }
    )
  }
  ```

- [ ] Create `lib/supabase/middleware.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'
  
  export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options))
          },
        },
      }
    )
    await supabase.auth.getUser()
    return supabaseResponse
  }
  ```

### Task 0-7: Create Auth Middleware

- [ ] Create `middleware.ts` in project root:
  ```typescript
  import { type NextRequest } from 'next/server'
  import { updateSession } from '@/lib/supabase/middleware'
  
  export async function middleware(request: NextRequest) {
    return await updateSession(request)
  }
  
  export const config = {
    matcher: [
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
  }
  ```

### Task 0-8: Set Up GitHub Repository

- [ ] Initialize git (if not already done by create-next-app):
  ```bash
  git init
  git add .
  git commit -m "feat: initial Next.js + shadcn/ui + Supabase skeleton"
  ```
- [ ] Create GitHub repo (using GitHub CLI):
  ```bash
  gh repo create buildpilot --private --source=. --remote=origin --push
  ```
  If no GitHub CLI: create repo manually at github.com, then:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/buildpilot.git
  git push -u origin main
  ```

### Task 0-9: Deploy to Vercel

- [ ] Connect to Vercel:
  ```bash
  npx vercel
  ```
  - Select: create new project
  - Project name: buildpilot
  - Framework: Next.js (auto-detected)
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ANTHROPIC_API_KEY`
- [ ] Verify deployment at the generated `.vercel.app` URL

**Phase 0 Done:** Next.js + shadcn/ui + Supabase helpers + CLAUDE.md + GitHub + Vercel live.

---

## Phase 1: Auth + Project Dashboard

> Supabase Auth + database schema + project CRUD + project dashboard UI.

### Task 1-1: Create Supabase Project

- [ ] Go to https://supabase.com → New project
- [ ] Name: `buildpilot-mvp`, choose region, set database password
- [ ] Copy Project URL and anon key into `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Update Vercel environment variables with the same values

### Task 1-2: Create Database Schema

- [ ] Create `supabase/migrations/20240101_initial_schema.sql`:

```sql
-- profiles: one per auth user
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  current_stage text default 'idea_capture',
  status text default 'active',
  preferred_stack jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- artifacts: product_brief, prd, architecture, etc.
create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null,
  title text not null,
  content_markdown text,
  content_json jsonb default '{}',
  status text default 'draft',
  version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- decisions
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  decision text not null,
  rationale text,
  alternatives jsonb default '[]',
  category text default 'technical',
  status text default 'active',
  source_artifact_id uuid references public.artifacts(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- tasks
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
  acceptance_criteria jsonb default '[]',
  dependencies jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- missions
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id),
  tool_name text,
  mission_brief text,
  return_prompt text,
  status text default 'draft',
  sent_at timestamptz,
  returned_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- tool_sessions: what happened in an external tool
create table public.tool_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  mission_id uuid references public.missions(id),
  tool_name text,
  raw_summary text,
  parsed_summary jsonb default '{}',
  status text default 'pending',
  created_at timestamptz default now()
);

-- risks
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

-- open_questions
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

-- ai_logs: audit trail for all AI calls
create table public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  task_type text not null,
  provider text default 'anthropic',
  model text,
  input jsonb default '{}',
  output jsonb default '{}',
  raw_output text,
  status text default 'success',
  error text,
  created_at timestamptz default now()
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

- [ ] Create `supabase/migrations/20240102_rls_policies.sql`:

```sql
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

-- profiles: users can only see/edit their own profile
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- projects: users can only see their own projects
create policy "projects: own rows" on public.projects
  for all using (auth.uid() = user_id);

-- all project-child tables: user owns if they own the parent project
create policy "artifacts: own project" on public.artifacts
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "decisions: own project" on public.decisions
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "tasks: own project" on public.tasks
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "missions: own project" on public.missions
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "tool_sessions: own project" on public.tool_sessions
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "risks: own project" on public.risks
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "open_questions: own project" on public.open_questions
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "ai_logs: own project" on public.ai_logs
  for all using (
    project_id is null or
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );
```

- [ ] Run migrations in Supabase SQL editor (copy-paste both files)
- [ ] Verify tables appear in Supabase Table Editor

### Task 1-3: Generate TypeScript Types

- [ ] Install Supabase CLI if not installed:
  ```bash
  npm install supabase --save-dev
  ```
- [ ] Generate types:
  ```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
  ```
- [ ] Create `types/index.ts` with domain types:

```typescript
import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Artifact = Database['public']['Tables']['artifacts']['Row']
export type Decision = Database['public']['Tables']['decisions']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Mission = Database['public']['Tables']['missions']['Row']
export type ToolSession = Database['public']['Tables']['tool_sessions']['Row']
export type Risk = Database['public']['Tables']['risks']['Row']
export type OpenQuestion = Database['public']['Tables']['open_questions']['Row']

export type ProjectStage =
  | 'idea_capture' | 'clarification' | 'product_brief_draft'
  | 'product_brief_approved' | 'prd_draft' | 'prd_approved'
  | 'architecture_draft' | 'architecture_approved' | 'task_plan_draft'
  | 'task_plan_approved' | 'mission_ready' | 'mission_sent'
  | 'return_received' | 'return_reviewed' | 'iteration_ready'
  | 'testing_ready' | 'deployment_ready' | 'live'

export type ArtifactType =
  | 'product_brief' | 'prd' | 'architecture'
  | 'data_model' | 'analytics_plan' | 'docs_export'

export type TaskStatus =
  | 'not_started' | 'ready' | 'sent_to_tool'
  | 'returned' | 'needs_review' | 'approved' | 'blocked'

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'
```

### Task 1-4: Auth Pages

- [ ] Create `app/(auth)/layout.tsx`:
  ```typescript
  export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8">{children}</div>
      </div>
    )
  }
  ```

- [ ] Create `app/(auth)/login/page.tsx` — Login/signup page with:
  - Tab toggle: "כניסה" / "הרשמה"
  - Email + password inputs (Hebrew labels)
  - Submit button
  - Uses `createClient()` from `@/lib/supabase/client`
  - On success: redirect to `/app`
  - On error: show toast message

- [ ] Test: can sign up, receive confirmation email (or disable email confirmation in Supabase dashboard for dev), log in, see redirect to /app

### Task 1-5: Route Protection

- [ ] Update `middleware.ts` to redirect unauthenticated users from `/app` routes to `/login`:
  ```typescript
  import { type NextRequest, NextResponse } from 'next/server'
  import { updateSession } from '@/lib/supabase/middleware'
  import { createServerClient } from '@supabase/ssr'
  
  export async function middleware(request: NextRequest) {
    const response = await updateSession(request)
    
    if (request.nextUrl.pathname.startsWith('/app')) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
    return response
  }
  ```
- [ ] Test: visiting `/app` without auth redirects to `/login`

### Task 1-6: Project Dashboard

- [ ] Create `app/(app)/layout.tsx` — App shell with:
  - Top header with logo + "BuildPilot" + user menu (logout)
  - Hebrew navigation: "הפרויקטים שלי"
  
- [ ] Create `components/dashboard/ProjectCard.tsx`:
  - Props: `project: Project`
  - Shows: project name, description (truncated), current stage badge, "עודכן: X ימים" date
  - Click → navigate to `/app/projects/[id]`

- [ ] Create `components/dashboard/EmptyState.tsx`:
  - Headline: "ברוכים הבאים ל-BuildPilot"
  - Sub: "בנה מוצרי תוכנה עם AI — בלי לאבד את הכיוון"
  - CTA button: "התחל פרויקט ראשון"

- [ ] Create `app/(app)/app/page.tsx`:
  - Server component — fetch projects from Supabase for current user
  - Render `ProjectCard` grid or `EmptyState`
  - "+ פרויקט חדש" button → `/app/projects/new`

- [ ] Test: sign in, see empty state, button navigates to new project page

### Task 1-7: Project CRUD

- [ ] Create basic project creation form at `app/(app)/app/projects/new/page.tsx`:
  - Fields: שם פרויקט, תיאור קצר
  - Submit → insert into `projects` table → redirect to `/app/projects/[id]`
  
- [ ] Create project detail placeholder at `app/(app)/app/projects/[projectId]/page.tsx`:
  - Fetch project by ID (verify ownership via RLS)
  - Show project name and stage
  - Placeholder "בקרוב" sections

- [ ] Test: create project, see it in dashboard, open it

**Phase 1 Done:** Auth + dashboard + project CRUD working end-to-end.

---

## Phase 2: Project Wizard + Product Brief

> Multi-step wizard collects the idea and generates a structured Product Brief using Claude.

### Task 2-1: AI Service Layer

- [ ] Create `lib/ai/client.ts`:
  ```typescript
  import Anthropic from '@anthropic-ai/sdk'
  
  export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  
  export const MODEL = 'claude-sonnet-4-5'
  ```

- [ ] Create `lib/ai/schemas.ts` with Zod schemas for all AI outputs:
  ```typescript
  import { z } from 'zod'
  
  export const ProductBriefSchema = z.object({
    product_name: z.string(),
    one_liner: z.string(),
    target_users: z.array(z.string()),
    problem: z.string(),
    solution: z.string(),
    mvp_scope: z.array(z.string()),
    non_goals: z.array(z.string()),
    success_criteria: z.array(z.string()),
    risks: z.array(z.string()),
    open_questions: z.array(z.string()),
  })
  
  export const ClarificationQuestionsSchema = z.object({
    questions: z.array(z.object({
      id: z.string(),
      question: z.string(),
      why: z.string(),
    })).max(5),
    assumptions: z.array(z.string()),
    suggested_direction: z.string(),
  })
  
  // Add more schemas as phases are built
  export type ProductBrief = z.infer<typeof ProductBriefSchema>
  export type ClarificationQuestions = z.infer<typeof ClarificationQuestionsSchema>
  ```

- [ ] Create `lib/ai/prompts.ts` with all prompt templates:
  ```typescript
  export const PRODUCT_BRIEF_SYSTEM = `You are a senior product strategist helping an independent builder turn a raw idea into a clear MVP.
  
  Use the user's idea and constraints to generate a structured Product Brief.
  Be practical. Avoid overbuilding. Mark assumptions clearly.
  Ask only the most important missing questions (max 5).
  
  Return ONLY valid JSON matching the required schema. No markdown, no explanation.`
  
  export const CLARIFICATION_SYSTEM = `You are a product strategist helping clarify a raw product idea.
  
  Ask up to 5 high-value clarifying questions that will significantly improve the product brief.
  Identify the key assumptions and suggest a clear MVP direction.
  
  Return ONLY valid JSON. No markdown, no explanation.`
  ```

- [ ] Create `lib/ai/service.ts`:
  ```typescript
  import { anthropic, MODEL } from './client'
  import { ProductBriefSchema, ClarificationQuestionsSchema } from './schemas'
  import { PRODUCT_BRIEF_SYSTEM, CLARIFICATION_SYSTEM } from './prompts'
  
  async function callAI<T>(
    schema: { parse: (data: unknown) => T },
    systemPrompt: string,
    userMessage: string,
    projectId?: string
  ): Promise<T> {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    
    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(raw)
    return schema.parse(parsed)
  }
  
  export async function generateClarificationQuestions(idea: string, context: Record<string, string>) {
    const userMessage = `Product idea: ${idea}\n\nAdditional context: ${JSON.stringify(context)}`
    return callAI(ClarificationQuestionsSchema, CLARIFICATION_SYSTEM, userMessage)
  }
  
  export async function generateProductBrief(idea: string, answers: Record<string, string>) {
    const userMessage = `Product idea: ${idea}\n\nClarification answers: ${JSON.stringify(answers)}`
    return callAI(ProductBriefSchema, PRODUCT_BRIEF_SYSTEM, userMessage)
  }
  ```

### Task 2-2: AI API Routes

- [ ] Create `app/api/ai/generate-brief/route.ts`:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import { generateProductBrief } from '@/lib/ai/service'
  
  export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { projectId, idea, answers } = await req.json()
    
    try {
      const brief = await generateProductBrief(idea, answers)
      
      // Save as artifact
      const { data: artifact } = await supabase.from('artifacts').upsert({
        project_id: projectId,
        type: 'product_brief',
        title: brief.product_name,
        content_json: brief,
        content_markdown: briefToMarkdown(brief),
        status: 'draft',
      }).select().single()
      
      // Update project stage
      await supabase.from('projects')
        .update({ current_stage: 'product_brief_draft', updated_at: new Date().toISOString() })
        .eq('id', projectId)
      
      return NextResponse.json({ artifact })
    } catch (error) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }
  }
  
  function briefToMarkdown(brief: Record<string, unknown>): string {
    return `# ${brief.product_name}\n\n**${brief.one_liner}**\n\n...`
  }
  ```

### Task 2-3: Project Wizard UI

- [ ] Replace basic new-project form with multi-step wizard at `app/(app)/app/projects/new/page.tsx`
- [ ] Create `components/wizard/ProjectWizard.tsx` — 3-step wizard shell:
  - Step 1: Idea input (שם + תיאור + קהל יעד + בעיה)
  - Step 2: AI clarification questions (auto-generated, user answers)
  - Step 3: Preview generated brief + approve/edit

- [ ] Create `components/wizard/IdeaStep.tsx`:
  - Fields (Hebrew labels): שם הפרויקט, תאר את הרעיון, מי קהל היעד, מה הבעיה
  - Optional: פלטפורמה, רמת טכנולוגיה, אילוצים
  - Submit → creates project in DB → calls clarification AI

- [ ] Create `components/wizard/ClarifyStep.tsx`:
  - Displays AI-generated questions (max 5) with text inputs
  - "נקה הכל" / "המשך" buttons
  - Submit → calls generate-brief API

- [ ] Create `components/wizard/BriefPreviewStep.tsx`:
  - Display generated brief in formatted card layout
  - "אשר תדריך" button → marks artifact as 'approved', redirects to project page
  - "ערוך" → editable markdown view

- [ ] Test full wizard flow: input idea → answer questions → see brief → approve

**Phase 2 Done:** AI-generated Product Brief saved to Supabase, visible in project.

---

## Phase 3: PRD + Architecture

> Generate PRD from approved brief, generate architecture from PRD, extract decisions.

### Task 3-1: PRD Generator

- [ ] Add `PRDSchema` to `lib/ai/schemas.ts`:
  ```typescript
  export const PRDSchema = z.object({
    overview: z.string(),
    goals: z.array(z.string()),
    non_goals: z.array(z.string()),
    personas: z.array(z.object({ name: z.string(), description: z.string() })),
    core_features: z.array(z.object({ name: z.string(), description: z.string(), priority: z.string() })),
    functional_requirements: z.array(z.string()),
    non_functional_requirements: z.array(z.string()),
    data_model_draft: z.string(),
    auth_model: z.string(),
    mvp_scope: z.array(z.string()),
    future_scope: z.array(z.string()),
    edge_cases: z.array(z.string()),
    acceptance_criteria: z.array(z.string()),
  })
  ```

- [ ] Add `generatePRD(brief)` to `lib/ai/service.ts`
- [ ] Create `app/api/ai/generate-prd/route.ts`
- [ ] Create `app/(app)/app/projects/[projectId]/prd/page.tsx`:
  - If PRD exists: show `ArtifactViewer` + approve button
  - If no PRD: show "Generate PRD" button that calls API
- [ ] Create `components/artifacts/ArtifactViewer.tsx` — markdown renderer
- [ ] Create `components/artifacts/ArtifactEditor.tsx` — editable with save button

### Task 3-2: Architecture Generator

- [ ] Add `ArchitectureSchema` to `lib/ai/schemas.ts`:
  ```typescript
  export const ArchitectureSchema = z.object({
    recommended_stack: z.array(z.string()),
    why_this_stack: z.string(),
    system_diagram_text: z.string(),
    data_model: z.string(),
    auth_model: z.string(),
    api_routes: z.array(z.string()),
    deployment_plan: z.string(),
    security_considerations: z.array(z.string()),
    risks: z.array(z.string()),
    alternatives_considered: z.array(z.object({ option: z.string(), reason_rejected: z.string() })),
    decisions: z.array(z.object({
      title: z.string(),
      decision: z.string(),
      rationale: z.string(),
      category: z.string(),
    })),
  })
  ```

- [ ] Add `generateArchitecture(prd, preferences)` to `lib/ai/service.ts`
- [ ] Create `app/api/ai/generate-architecture/route.ts`
- [ ] After generation: **auto-save decisions array** to `decisions` table
- [ ] Create `app/(app)/app/projects/[projectId]/architecture/page.tsx`

### Task 3-3: Decision Log Page

- [ ] Create `components/decisions/DecisionCard.tsx`:
  - Shows: title, decision text, rationale, category badge, status (active/deprecated)
- [ ] Create `app/(app)/app/projects/[projectId]/decisions/page.tsx`:
  - List all project decisions from Supabase
  - Filter by category
  - "הוסף החלטה ידנית" button

**Phase 3 Done:** PRD + Architecture generated, decisions auto-saved, all viewable/editable.

---

## Phase 4: Task Planner + Mission Briefs

> Generate build tasks from PRD + architecture, create Mission Briefs for external tools.

### Task 4-1: Task Generator

- [ ] Add `TaskListSchema` to `lib/ai/schemas.ts`:
  ```typescript
  export const TaskListSchema = z.object({
    tasks: z.array(z.object({
      title: z.string(),
      description: z.string(),
      phase: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      complexity: z.enum(['small', 'medium', 'large']),
      recommended_tool: z.string(),
      dependencies: z.array(z.string()),
      acceptance_criteria: z.array(z.string()),
    })),
  })
  ```

- [ ] Add `generateTasks(prd, architecture)` to `lib/ai/service.ts`
- [ ] Create `app/api/ai/generate-tasks/route.ts`
- [ ] After generation: save all tasks to `tasks` table with status `not_started`

### Task 4-2: Task List UI

- [ ] Create `components/tasks/TaskCard.tsx`:
  - Shows: title, phase badge, priority badge, complexity, recommended tool, status
  - "צור משימה" button → creates mission for this task
- [ ] Create `app/(app)/app/projects/[projectId]/tasks/page.tsx`:
  - Group tasks by phase
  - Phase headers: "הגדרת פרויקט", "מודל נתונים", "אימות", etc.
  - Each task has status indicator

### Task 4-3: Mission Brief Generator

- [ ] Add `MissionBriefSchema` to `lib/ai/schemas.ts`:
  ```typescript
  export const MissionBriefSchema = z.object({
    product_context: z.string(),
    current_stage: z.string(),
    current_task: z.string(),
    why_this_task: z.string(),
    relevant_decisions: z.array(z.string()),
    constraints: z.array(z.string()),
    acceptance_criteria: z.array(z.string()),
    what_not_to_do: z.array(z.string()),
    expected_output: z.string(),
    return_instructions: z.string(),
    recommended_tool: z.string(),
    tool_reasoning: z.string(),
  })
  ```

- [ ] Add `generateMissionBrief(task, project, decisions, artifacts)` to `lib/ai/service.ts`
- [ ] Create `app/api/ai/generate-mission/route.ts`
- [ ] Create `components/missions/MissionBriefCard.tsx`:
  - Formatted mission brief text
  - "העתק משימה" copy button (navigator.clipboard)
  - Return brief prompt section with copy button

- [ ] Create `components/missions/ToolRecommendation.tsx`:
  - Shows recommended tool with explanation
  - Override dropdown: select different tool
  - "סמן כנשלח" button → updates mission status to `sent`

- [ ] Create `app/(app)/app/projects/[projectId]/missions/[missionId]/page.tsx`

**Phase 4 Done:** Tasks generated, Mission Briefs copyable, tool routing working.

---

## Phase 5: Return Brief Loop

> Paste return brief, AI analyzes it, updates project state, detects drift.

### Task 5-1: Return Analysis AI

- [ ] Add `ReturnAnalysisSchema` to `lib/ai/schemas.ts`:
  ```typescript
  export const ReturnAnalysisSchema = z.object({
    classification: z.enum([
      'completed_aligned', 'completed_with_risks',
      'partially_completed', 'blocked', 'drift_detected', 'unclear'
    ]),
    completed_work: z.array(z.string()),
    new_decisions: z.array(z.object({
      title: z.string(),
      decision: z.string(),
      rationale: z.string(),
      category: z.string(),
    })),
    new_assumptions: z.array(z.string()),
    risks: z.array(z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      category: z.string(),
    })),
    drift_signals: z.array(z.object({
      type: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
    })),
    recommended_next_step: z.string(),
    task_status_recommendation: z.enum(['approved', 'needs_review', 'send_back', 'blocked']),
    requires_user_review: z.boolean(),
  })
  ```

- [ ] Add `analyzeReturnBrief(rawSummary, projectContext)` to `lib/ai/service.ts`
- [ ] Create `app/api/ai/analyze-return/route.ts`:
  - Parse return brief
  - Auto-save new decisions to `decisions` table
  - Auto-save new risks to `risks` table
  - Save tool_session record
  - Update task status
  - Return analysis result

### Task 5-2: Return Brief Page

- [ ] Create `components/missions/ReturnBriefInput.tsx`:
  - Large textarea: "הדבק את סיכום הכלי כאן"
  - Include return brief prompt template to copy
  - "נתח סיכום" submit button
  - Loading state: "מנתח..."

- [ ] Create `app/(app)/app/projects/[projectId]/return/page.tsx`:
  - ReturnBriefInput component
  - After submit: show analysis results card
  - Classification badge (aligned / risks / drift / blocked)
  - Completed work list
  - New decisions detected
  - Risks detected
  - "המשך לשלב הבא" CTA

### Task 5-3: Drift Detection Display

- [ ] Create drift warning component in return analysis result:
  - If `drift_signals.length > 0`: show orange/red warning cards
  - Each drift signal: type, description, severity badge
  - "פתר" / "התעלם" buttons

- [ ] Create `app/(app)/app/projects/[projectId]/risks/page.tsx`:
  - All risks from Supabase
  - Severity filter (critical / high / medium / low)
  - Status toggle: open / resolved

### Task 5-4: Project Overview Command Center

- [ ] Update `app/(app)/app/projects/[projectId]/page.tsx` into full command center:
  - Project one-liner + current stage
  - `NextActionCard` — smart CTA based on stage
  - Active task + mission status
  - Open risks count + top critical risk
  - Recent decisions (last 3)
  - Recent tool sessions

- [ ] Create `components/project/NextActionCard.tsx`:
  - Reads project stage and computes CTA:
    - No brief → "הגדר רעיון"
    - Brief, no PRD → "צור PRD"
    - PRD, no architecture → "תכנן ארכיטקטורה"
    - Architecture, no tasks → "צור תוכנית בנייה"
    - Tasks ready → "התחל משימה"
    - Mission sent → "הדבק סיכום כלי"
    - Return needs review → "סקור תוצאה"

- [ ] Create `components/project/StageProgress.tsx`:
  - Linear progress bar with stage labels in Hebrew

**Phase 5 Done:** Full SPDD loop working — mission out, return in, memory updated.

---

## Phase 6: Living Docs

> Export project documentation as markdown, final polish.

### Task 6-1: Living Docs Page

- [ ] Create `app/(app)/app/projects/[projectId]/docs/page.tsx`:
  - Generates markdown export from all project data
  - Sections: Brief, PRD, Architecture, Decisions, Tasks, Risks
  - "העתק Markdown" button

- [ ] Server action to compile docs:
  ```typescript
  async function compileProjectDocs(projectId: string): Promise<string> {
    // fetch all artifacts, decisions, tasks, risks for project
    // compile into single markdown document
    // return as string
  }
  ```

### Task 6-2: Landing Page

- [ ] Create `app/page.tsx` — landing page:
  - Hero: "בנה תוכנה עם AI — בלי לאבד את הכיוון"
  - Sub: "BuildPilot מנחה אותך בכל שלב, שומר על ההחלטות, ומתאם את הכלים"
  - CTA: "התחל בחינם" → `/login`
  - Features grid: 6 key benefits
  - Clean, calm design with shadcn/ui

### Task 6-3: Final Polish + Review

- [ ] Run code review skill on each phase
- [ ] Test full user journey:
  1. Sign up
  2. Create project via wizard
  3. Generate Product Brief → approve
  4. Generate PRD → approve
  5. Generate Architecture → approve + see decisions
  6. Generate Tasks
  7. Create Mission Brief for first task → copy
  8. Paste simulated Return Brief → see analysis
  9. See updated dashboard: next action, risks, decisions
  10. Export docs as markdown
- [ ] Deploy to Vercel and verify production build
- [ ] Update `.env.example` with all required keys

**Phase 6 Done:** Full MVP complete and deployed.

---

## Phase 7: AI Companion Chatbot

> A context-aware AI companion accessible from every page. Knows your project state, recommends the right tool, generates platform-specific prompts, and ingests return summaries back into product memory.

### Overview

The Companion is a floating side-panel chat that:
1. **Answers questions** — "מה שלב הבא?", "למה בחרנו ב-Supabase?", "מה הסיכונים הפתוחים?"
2. **Routes to the right tool** — recommends Cursor / Claude Code / v0 / Lovable based on task type
3. **Generates the mission prompt** — platform-specific prompt to paste at the start of a build session
4. **Generates the return prompt** — platform-specific prompt to paste at the *end* of a session to extract a structured summary
5. **Ingests the return summary** — user pastes the summary back into the chat; Companion parses and saves decisions/risks/next steps to Supabase

### Architecture

```
components/companion/
├── CompanionButton.tsx        ← Floating button (bottom-right, all /app pages)
├── CompanionPanel.tsx         ← Side sheet with chat UI
├── CompanionMessage.tsx       ← Message bubble (user / assistant / system)
├── CompanionInput.tsx         ← Textarea + send button
└── CompanionActionCard.tsx    ← Structured card for prompts/actions (copy button)

app/api/ai/companion/
└── route.ts                   ← POST: streaming chat with project context injection

lib/ai/companion/
├── context.ts                 ← buildProjectContext(projectId) → string
├── prompts.ts                 ← System prompt + tool routing templates
├── platforms.ts               ← Platform definitions + prompt templates
└── ingestion.ts               ← parseReturnSummary() → decisions/risks/nextStep
```

### Platform Definitions (`lib/ai/companion/platforms.ts`)

```typescript
export const PLATFORMS = {
  cursor: {
    name: 'Cursor',
    bestFor: ['implementation', 'refactoring', 'debugging'],
    missionPromptTemplate: (brief: string) => `
# Mission Brief — Cursor Session

${brief}

---
IMPORTANT: At the end of this session, run this command in chat:
"Summarize this session as a Tandem Return Brief with: completed work, decisions made, files changed, risks discovered, and recommended next step."
    `,
    returnPrompt: `Please generate a Tandem Return Brief for this session. Include:
1. **Completed Work** — what was built/fixed (bullet list)
2. **Decisions Made** — any architectural or technical choices with rationale
3. **Files Changed** — key files modified
4. **Risks / Issues** — anything that could cause problems
5. **Recommended Next Step** — what to do in the next session

Format as structured markdown.`,
  },
  claude_code: {
    name: 'Claude Code',
    bestFor: ['architecture', 'planning', 'complex features', 'migrations'],
    missionPromptTemplate: (brief: string) => `${brief}

When done, generate a Return Brief with: completed work, decisions, risks, and next step.`,
    returnPrompt: `Generate a Return Brief for this Claude Code session:
1. Completed Work
2. Decisions Made (with rationale)
3. Risks / Blockers
4. Recommended Next Step`,
  },
  v0: {
    name: 'v0',
    bestFor: ['UI components', 'landing pages', 'forms', 'dashboards'],
    missionPromptTemplate: (brief: string) => `${brief}

After generating the component, describe: what was built, any design decisions made, and what comes next.`,
    returnPrompt: `Describe this v0 session: what component was built, design decisions made, and what needs to be integrated.`,
  },
  lovable: {
    name: 'Lovable',
    bestFor: ['full-stack features', 'CRUD', 'forms with backend'],
    missionPromptTemplate: (brief: string) => `${brief}`,
    returnPrompt: `Summarize what was built in this Lovable session, any decisions made, and the recommended next step.`,
  },
}
```

### Task 7-1: Companion UI Shell

- [ ] Add `CompanionButton.tsx` — floating button, fixed bottom-right on all `/app` pages:
  - Icon: `MessageCircle` from lucide-react
  - Badge with unread count (future)
  - Click → opens `CompanionPanel`
  - Add to `app/(app)/layout.tsx` so it appears on every app page

- [ ] Create `CompanionPanel.tsx` — shadcn/ui `Sheet` (side="right", width 420px):
  - Header: "Tandem Companion" + project name + close button
  - Message list (scrollable)
  - Input area at bottom
  - Initial greeting message with project summary and suggested actions

- [ ] Create `CompanionMessage.tsx`:
  - `role: 'user' | 'assistant' | 'action'`
  - `action` type renders `CompanionActionCard` (copyable prompt block)
  - Markdown rendering for assistant messages

- [ ] Create `CompanionActionCard.tsx`:
  - Title (e.g., "Cursor Mission Prompt")
  - Monospace code block with full prompt text
  - "העתק" copy button
  - Platform badge

### Task 7-2: Streaming Chat API

- [ ] Create `app/api/ai/companion/route.ts`:
  ```typescript
  import { streamText } from 'ai'
  import { anthropic } from '@ai-sdk/anthropic'
  import { buildProjectContext } from '@/lib/ai/companion/context'
  import { createClient } from '@/lib/supabase/server'

  export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const { messages, projectId } = await req.json()
    const projectContext = projectId ? await buildProjectContext(projectId, supabase) : ''

    const result = streamText({
      model: anthropic('claude-sonnet-4-5'),
      system: buildCompanionSystem(projectContext),
      messages,
    })

    return result.toDataStreamResponse()
  }
  ```

- [ ] Create `lib/ai/companion/context.ts`:
  ```typescript
  export async function buildProjectContext(projectId: string, supabase): Promise<string> {
    const [project, artifacts, decisions, tasks, missions] = await Promise.all([
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('artifacts').select('type, title, status').eq('project_id', projectId),
      supabase.from('decisions').select('title, decision, category').eq('project_id', projectId).eq('status', 'active').limit(10),
      supabase.from('tasks').select('title, status, recommended_tool').eq('project_id', projectId).limit(20),
      supabase.from('missions').select('status, tool_name').eq('project_id', projectId).order('created_at', { ascending: false }).limit(3),
    ])

    return `
## Current Project: ${project.data?.name}
Stage: ${project.data?.current_stage}
Description: ${project.data?.description}

## Artifacts
${artifacts.data?.map(a => `- ${a.type}: ${a.title} (${a.status})`).join('\n')}

## Active Decisions (last 10)
${decisions.data?.map(d => `- [${d.category}] ${d.title}: ${d.decision}`).join('\n')}

## Tasks
${tasks.data?.map(t => `- ${t.title} [${t.status}] → ${t.recommended_tool}`).join('\n')}
    `.trim()
  }
  ```

- [ ] Create `lib/ai/companion/prompts.ts` — system prompt:
  ```typescript
  export function buildCompanionSystem(projectContext: string): string {
    return `You are Tandem Companion, an AI guide embedded in a product development OS.
  
  You help builders who use AI coding tools (Cursor, Claude Code, v0, Lovable) to stay on track.
  
  Your responsibilities:
  1. Answer questions about the current project, stage, decisions, and tasks
  2. Recommend the right tool (Cursor / Claude Code / v0 / Lovable) for each task
  3. Generate mission prompts — tailored for the chosen platform
  4. Generate return prompts — what to paste at the END of a build session to get a structured summary
  5. When the user pastes a return summary, parse it and list what should be saved to memory
  
  Rules:
  - Be concise. Builders are in flow — don't over-explain.
  - When generating a prompt, output it in a code block so it's easy to copy.
  - When recommending a tool, explain why in one sentence.
  - When parsing a return summary, extract: decisions (with rationale), risks, completed work, next step.
  
  ${projectContext ? `## Project Context\n${projectContext}` : 'No project context loaded. Ask the user which project they are working on.'}
  `
  }
  ```

### Task 7-3: Platform Routing + Prompt Generation

- [ ] Create `lib/ai/companion/platforms.ts` with platform definitions (see above)

- [ ] Companion detects intent and offers actions:
  - If user says "איזה כלי להשתמש?" or "start a session" → shows tool recommendation + "Generate Mission Prompt" button
  - If user clicks "Generate Mission Prompt" → fetches active task + calls platform template → renders `CompanionActionCard`
  - User copies prompt, opens their tool, works

- [ ] Add intent detection in companion system prompt:
  - "tool recommendation" intent → respond with tool name + reasoning + offer to generate prompt
  - "generate prompt" intent → output mission prompt in code block
  - "return prompt" intent → output platform-specific return prompt in code block

### Task 7-4: Return Prompt Generation

- [ ] Companion responds to "מה לדביק בסוף הסשן?" / "return prompt" / "how do I wrap up?" with:
  - Asks which platform they used (if unknown)
  - Returns the platform-specific return prompt as a `CompanionActionCard`
  - Explains: "הדבק את הפרומפט הזה בסוף הסשן ב-[platform], קבל את הסיכום, ותדביק אותו חזרה כאן"

- [ ] Add quick-action buttons below companion input (optional):
  - "📋 Mission Prompt" → generate for active task
  - "↩️ Return Prompt" → generate return prompt for current platform
  - "💾 Paste Summary" → trigger ingestion mode

### Task 7-5: Return Summary Ingestion

- [ ] Create `lib/ai/companion/ingestion.ts`:
  ```typescript
  export const INGESTION_SCHEMA = z.object({
    completed_work: z.array(z.string()),
    decisions: z.array(z.object({
      title: z.string(),
      decision: z.string(),
      rationale: z.string(),
      category: z.string(),
    })),
    risks: z.array(z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
    })),
    recommended_next_step: z.string(),
    files_changed: z.array(z.string()).optional(),
  })
  ```

- [ ] Create `app/api/ai/companion/ingest/route.ts`:
  - Receives: `{ rawSummary, projectId }`
  - Uses Claude to parse `rawSummary` into `INGESTION_SCHEMA`
  - Saves decisions → `decisions` table
  - Saves risks → `risks` table
  - Updates mission status → `returned`
  - Returns parsed result

- [ ] When companion detects pasted summary (long text block), automatically:
  - Shows "זיהיתי סיכום סשן — רוצה שאשמור את זה לזיכרון המוצר?"
  - Confirm → calls ingest API → shows what was saved
  - Renders summary: X decisions saved, Y risks logged, next step: [...]

### Task 7-6: Context Awareness + Project Switching

- [ ] Companion always knows which project page the user is on (via URL params or context prop)
- [ ] When user navigates between projects, companion context refreshes
- [ ] Companion can answer cross-project questions: "מה ההבדל בין שני הפרויקטים?"
- [ ] Add "Switch Project" option in companion header dropdown

**Phase 7 Done:** Companion is live — guides prompting, captures return summaries, updates product memory automatically.

---

## Open Questions / Decisions

| # | Question | Status | Answer |
|---|----------|--------|--------|
| 1 | Email confirmation required for signup? | Open | Disable in dev, enable in prod |
| 2 | Streaming AI responses or wait for full response? | Open | Start with full response (simpler), add streaming in Phase 3+ |
| 3 | Hebrew RTL layout? | Open | Add `dir="rtl"` to root layout if needed |
| 4 | Markdown editor for artifacts — which library? | Decided | `@uiw/react-md-editor` |
| 5 | AI model version | Decided | `claude-sonnet-4-5` via Vercel AI SDK |

---

## Environment Variables Reference

```bash
# Required from day one
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon/public key
ANTHROPIC_API_KEY=                 # From console.anthropic.com

# Optional (for future multi-provider support)
OPENAI_API_KEY=
```

---

## Useful Commands

```bash
# Dev
npm run dev                         # Start dev server

# Build
npm run build                       # Production build check

# Types
npx supabase gen types typescript --project-id PROJ_ID > types/database.ts

# Deploy
npx vercel                          # Deploy to Vercel

# Skills
claude skills install URL           # Install a Claude Code skill
```

---

## 🎯 Current Status & Updated Next Steps (May 2026)

### Environmental changes since last update
- ✅ **Project unified** via Windows junction — `...\Tandem - Claude Code` and `C:\dev\buildpilot` now point to the same files. Either path works.
- ✅ **ANTHROPIC_API_KEY** added to `.env.local` (no longer commented out).
- ✅ **Supabase project active** — `Tandem - Antigravity` (`sgqhguvkjfqvlsmbdswi`).
- ✅ **Phase 1 code complete + build passes** — auth pages, route protection, project CRUD (list/new/detail), TypeScript types, RLS migrations.
- ⚠️ **SQL schema conflict detected** — two parallel SQL definitions exist:
  - `database.sql` (root) — older, 5 tables: `projects, artifacts, tasks, decisions, user_settings`
  - `supabase/migrations/20260524_0{1,2}_*.sql` — newer, 10 tables matching this plan
  - **Action required:** decide which schema is canonical (see Step 1 below).
- 📋 **New planning docs found:** `tandem_project_status.html`, `future_proposals.html` (BYOK, Drift, E2E testing).

### What to do next (in order)

**Step 1 — Resolve schema conflict (BLOCKER, 5 min):**
Open Supabase Dashboard → Table Editor and check which tables exist. Three scenarios:
- **(a) Only `database.sql` tables exist** (projects, artifacts, tasks, decisions, user_settings) → run my migrations to add `profiles, missions, tool_sessions, risks, open_questions, ai_logs` PLUS the `handle_new_user()` trigger. The `user_settings` table from BYOK proposal can stay.
- **(b) My migrations already ran** (10 tables) → optionally add a `user_settings` table to support BYOK (see Step 3).
- **(c) Nothing ran yet** → run **both** my migrations (`20260524_01_*.sql` then `20260524_02_*.sql`) in SQL Editor. Then proceed.

**Step 2 — Smoke test the Phase 1 flow (10 min):**
1. `cd C:\dev\buildpilot && npm run dev`
2. `http://localhost:3000/login` → signup with a real email
3. Confirm email (or disable confirmation in Supabase Auth → Providers → Email)
4. Verify redirect to `/app`
5. Navigate to `/app/projects` → empty state should appear
6. Click "+ פרויקט חדש" → fill form → submit
7. Verify project saves and you see `/app/projects/[id]` with next-action card

**Step 3 — BYOK decision: ✅ DECIDED → Quick MVP (defer to v0.2)**
`future_proposals.html` proposes Bring-Your-Own-Key. **Decision (May 2026):** stick with server-level `ANTHROPIC_API_KEY` from `.env.local` for v0.1. Build Phase 2 fast against the env key. Add BYOK + `/app/settings` page in v0.2 once usage validates the product. Drop the `user_settings` table from `database.sql` (root) when cleaning up.

**Step 3b — Companion smoke test (5 min, QUICK WIN):**
The Companion code (Phase 7) already exists at `app/api/ai/companion/route.ts` + `components/companion/*` and is wired into `app/(app)/app/layout.tsx`. The context builder (`lib/ai/companion/context.ts`) is RESILIENT — it try/catches schema mismatches and returns empty context if tables are missing. To test:
1. `npm run dev`
2. Sign in → land on any `/app/*` page
3. Click the floating circle (bottom-right corner) → CompanionPanel opens
4. Send: `"what should I do next?"` — expect a streamed reply from Claude
5. If it works → Phase 7 is partially live, and AI plumbing is validated before Phase 2.

**Step 4 — Phase 2 (next dev session):**
- Create `lib/ai/{client,schemas,prompts,service}.ts` (skeleton in section 7 of this plan)
- Create `app/api/ai/generate-clarification/route.ts` + `generate-brief/route.ts`
- Replace `/app/projects/new` simple form with `components/wizard/ProjectWizard.tsx` (3 steps: Idea → Clarify → Brief preview)
- AI generation saves Product Brief to `artifacts` table + advances project stage

**Step 5 — Decisions still pending:**
- Should `/app` overview (Control Tower) replace its mock data, or stay aspirational for now? Suggest: stay mock for v0.1, replace with real aggregate stats in v0.2.
- Are the Companion routes in `app/api/ai/companion/` already working with the new `ANTHROPIC_API_KEY`? Should be tested as a quick win.
- `database.sql` file (root) — delete once Step 1 is resolved? Keeping two definitions causes confusion.

### Critical files to review before next dev session
- `supabase/migrations/20260524_01_initial_schema.sql` — canonical schema
- `supabase/migrations/20260524_02_rls_policies.sql` — RLS for all 10 tables
- `app/(auth)/login/page.tsx` — auth UI pattern (replicate for any future auth-related UI)
- `app/(app)/app/projects/[projectId]/page.tsx` — see `computeNextAction()` — the stage→CTA mapping logic
- `lib/ai/companion/*` — companion code already exists, verify it works with new API key
- `types/index.ts` — domain types + Hebrew labels (`STAGE_LABELS_HE`)

---

## Progress Tracker

### Pre-Phase
- [x] P-1: Supabase agent-skills installed
- [x] P-2: Next.js AI skills installed
- [x] P-3: Code review skill installed

### Phase 0
- [x] 0-1: Next.js bootstrapped
- [x] 0-2: shadcn/ui added (all components installed)
- [x] 0-3: Dependencies installed (Supabase, AI SDK, Zod, framer-motion, etc.)
- [x] 0-4: CLAUDE.md created
- [x] 0-5: Environment variables set (.env.example)
- [x] 0-6: Supabase client helpers created (lib/supabase/)
- [x] 0-7: Auth middleware created
- [x] 0-8: GitHub repo created (ilanmichalby/tandem-claude)
- [ ] 0-9: Vercel deployment live

### Phase 1
- [ ] 1-1: Supabase project created
- [ ] 1-2: Database schema + RLS deployed
- [ ] 1-3: TypeScript types generated
- [ ] 1-4: Auth pages working
- [ ] 1-5: Route protection working
- [ ] 1-6: Project dashboard working
- [ ] 1-7: Project CRUD working

### Phase 2
- [x] 2-1: AI service layer created (lib/ai/{client,schemas,prompts,service}.ts)
- [x] 2-2: AI API routes working (generate-clarification + generate-brief)
- [x] 2-3: Project wizard + brief generation working (3-step wizard: Idea → Clarify → Brief)

### Phase 3
- [x] 3-1: PRD generator working (schemas + service + API route + page + ArtifactViewer)
- [x] 3-2: Architecture generator + auto-save decisions + risks to DB
- [x] 3-3: Decision log page + DecisionCard component
- [x] 3-extra: Brief viewer page + approve/regen flow on PRD + Architecture pages
- [x] 3-bugfix: Fixed all Phase 3 bugs (infinite re-render, unused imports, error handling, PRD gate on Architecture page, ArtifactViewer CSS variables)

### Phase 4
- [x] 4-1: Task generator working (TaskListSchema + generateTasks() + /api/ai/generate-tasks)
- [x] 4-2: Task list UI working (TaskCard + tasks/page.tsx grouped by phase)
- [x] 4-3: Mission Brief generator + copy UI working (MissionBriefSchema + generateMissionBrief() + /api/ai/generate-mission + MissionBriefCard + missions pages)

### Phase 5
- [x] 5-1: Return analysis AI working (ReturnAnalysisSchema + analyzeReturnBrief() + /api/ai/analyze-return)
- [x] 5-2: Return brief page working (return/page.tsx — paste, analyze, display results)
- [x] 5-3: Drift detection display working (drift alert in return page + risks/page.tsx register)
- [x] 5-4: Project overview nav updated (Return Brief + Decisions links, computeNextAction for all stages)

### Phase 6
- [x] 6-1: Living docs export working (docs/page.tsx — aggregates all artifacts, decisions, tasks, risks → markdown + copy button)
- [x] 6-2: Landing page working (app/page.tsx — dark themed, framer-motion, features/workflow/CTA sections)
- [x] 6-3: Production build passes (npx next build — all 31 routes compile clean)
- [x] 6-4: Vercel deploy live — https://tandem-claude.vercel.app (deployed 2026-05-24)

### Phase 7
- [x] 7-1: Companion UI shell (floating button + side panel) — already built in `components/companion/*`
- [x] 7-2: Streaming chat API with project context injection — `app/api/ai/companion/route.ts` + `lib/ai/companion/context.ts` (resilient try/catch)
- [x] 7-3: Platform routing + mission prompt generation — `lib/ai/companion/platforms.ts` + system prompt intent detection; AI outputs code blocks with copy button
- [x] 7-4: Return prompt generation (platform-specific) — system prompt handles "return prompt" intent; code blocks rendered with copy button in CompanionMessage
- [x] 7-5: Return summary ingestion → decisions/risks saved to Supabase — `app/api/ai/companion/ingest/route.ts` + `lib/ai/companion/ingestion.ts` wired via `handleIngestion` in CompanionPanel
- [x] 7-6: Context awareness + project switching — layout extracts projectId from URL regex, fetches project name, passes both to CompanionButton → CompanionPanel
