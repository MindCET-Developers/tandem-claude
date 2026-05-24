# PRD — AI Product OS for Guided Vibe Coding

## 1. Product Name

Working names:
- BuildPilot
- ProductPilot
- VibeOps
- BuilderOS
- ForgeGuide

For this PRD, the product will be called **BuildPilot**.

---

## 2. One-liner

**BuildPilot is an AI-guided product development operating system that helps independent builders turn an idea into a real, maintainable software product by guiding the process, preserving decisions, generating living documentation, and coordinating work across external AI tools.**

---

## 3. Product Vision

AI coding tools are becoming extremely powerful, but they mostly optimize for fast generation. They help users create code quickly, but they do not reliably help them build products well.

BuildPilot exists to solve the missing layer:

> The guided, opinionated, memory-based product development layer for people building real software with AI.

The system does not try to replace Cursor, Claude Code, Lovable, Replit, v0, Gemini, or GPT. Instead, it helps users know what to do next, what to ask each tool, how to evaluate the result, and how to preserve continuity across the whole product-building journey.

---

## 4. Core Thesis

The future of AI-assisted product building will not be won only by the best coding agent.

It will also require:
- product memory
- decision persistence
- guided workflows
- structured artifacts
- tool orchestration
- best-practice enforcement
- contextual learning
- continuity across tools and sessions

BuildPilot should become the **system of record** for the product-building process.

---

## 5. Target Users

### 5.1 Primary User: Independent AI Builder

People who want to build real digital products using AI, but are not full-time software engineers.

Examples:
- founders
- product managers
- educators
- designers
- no-code builders
- innovation teams
- creators
- consultants
- startup operators

They are comfortable experimenting with AI but need guidance, structure, and confidence.

### 5.2 Secondary User: Semi-technical Product Builder

People who can read code, use tools like Cursor, Bubble, Supabase, GitHub, or Vercel, but do not want to manually manage the full complexity of product development.

### 5.3 Future User: Teams

Small teams that want a shared AI-native product memory and decision record.

Not part of MVP.

---

## 6. User Problems

### 6.1 Lack of Process

Users can generate code, but they do not know:
- what to do first
- what to ask
- when to stop planning and start building
- when to test
- when to refactor
- how to avoid overbuilding

### 6.2 Tool Overload

There are many AI tools:
- Cursor
- Claude Code
- Lovable
- Replit
- v0
- ChatGPT
- Gemini
- Perplexity

Users do not know which tool is best for which task.

### 6.3 Context Loss

Work happens across multiple tools and chats. Decisions disappear. The next AI does not know what the previous AI did.

### 6.4 Architecture Drift

AI-generated products often evolve inconsistently:
- changing database assumptions
- duplicated logic
- inconsistent design patterns
- unclear auth model
- poor file organization
- hidden technical debt

### 6.5 False Confidence

AI often says something is done, but the user does not know:
- what was actually created
- whether it follows the original plan
- whether it is secure
- whether it is maintainable
- what remains incomplete

### 6.6 No Learning Loop

Users build things but do not understand their own product enough to maintain it.

---

## 7. Product Goals

BuildPilot should help users:

1. Clarify product ideas.
2. Convert ideas into structured requirements.
3. Make better product and architecture decisions.
4. Generate implementation tasks.
5. Route tasks to the right AI tool or external environment.
6. Bring results back from external tools.
7. Update living product documentation.
8. Detect inconsistencies, risks, and drift.
9. Teach users while they build.
10. Maintain independence from any single AI vendor.

---

## 8. Non-goals for MVP

BuildPilot V1 should NOT try to:

- become a full IDE
- replace Cursor or Claude Code
- run autonomous coding agents internally
- fully automate deployment
- support team collaboration
- support marketplace extensions
- support billing for external AI usage
- manage complex enterprise permissions
- become a generic project management app
- become a Notion clone

---

## 9. Product Positioning

### 9.1 Not This

BuildPilot is not:
- an AI code generator
- a chatbot wrapper
- a tutorial platform
- a project management board
- an IDE
- a no-code app builder

### 9.2 This

BuildPilot is:
- a guided product development system
- a decision memory layer
- an AI orchestration layer
- a best-practice coach
- a structured product-building workflow
- a bridge between human intent and AI execution

### 9.3 Positioning Statement

**Build real software with AI, without losing the plot.**

Alternative:

**The control tower for AI-assisted product building.**

---

## 10. Core Product Principles

### 10.1 Guided, Not Magical

The product should not pretend that one prompt can build a serious product. It should guide the user step by step.

### 10.2 Opinionated, Not Overwhelming

The system should recommend a default path while still explaining tradeoffs.

### 10.3 Tool-agnostic

The product should not be married to one AI model or platform.

### 10.4 Human-readable

The user should understand what is happening without needing to understand all technical details.

### 10.5 Structured Under the Hood

The user experience should feel simple, but internally the system should maintain structured artifacts.

### 10.6 Decision Persistence

Decisions should be saved, referenced, and enforced later.

### 10.7 Evidence-based Updates

When external tools report what they did, BuildPilot should treat the report as evidence, not absolute truth.

### 10.8 Teach Through Building

The system should explain relevant concepts only when they matter for the user’s current step.

---

## 11. Invisible SPDD Model

BuildPilot should implement SPDD-like principles invisibly.

SPDD here means:

> Product/spec-driven development where requirements, constraints, decisions, and architecture become persistent structured artifacts that guide AI-assisted development.

Users should not need to see this methodology directly.

Instead of asking users to manage specs manually, BuildPilot maintains living artifacts such as:

- Product Brief
- PRD
- Architecture Map
- Tech Stack Decisions
- User Flows
- Entity/Data Model
- Design Principles
- API Plan
- Analytics Plan
- Build Tasks
- Decision Log
- Risks
- Open Questions
- Tool Session Summaries

---

## 12. MVP Product Scope

The MVP should include the following core modules:

1. Authentication
2. Project dashboard
3. New project wizard
4. Product brief generator
5. PRD generator
6. Architecture recommendation
7. Stack confirmation
8. Task planner
9. External tool mission generator
10. Return brief ingestion
11. Project memory viewer
12. Decision log
13. Risk and drift detector
14. Next-step recommendation
15. Living documentation export

---

## 13. Recommended Tech Stack

User-preferred stack:

- Next.js
- TypeScript
- AI SDK
- shadcn/ui
- Supabase
- Vercel
- GitHub

### 13.1 Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### 13.2 Backend

- Next.js Route Handlers / Server Actions
- Supabase Postgres
- Supabase Auth
- Supabase Row Level Security
- Supabase Storage if needed later

### 13.3 AI Layer

- Vercel AI SDK
- Initial model providers:
  - OpenAI
  - Anthropic
  - Google Gemini

MVP may start with one provider but should abstract model calls behind an internal service layer.

### 13.4 Deployment

- Vercel
- Supabase hosted project
- GitHub repo

---

## 14. Core User Journey

### 14.1 First-time User Flow

1. User signs up.
2. User creates a new project.
3. User describes the idea in plain language.
4. BuildPilot asks targeted clarification questions.
5. BuildPilot generates a Product Brief.
6. User confirms or edits the brief.
7. BuildPilot generates a PRD draft.
8. User confirms product scope.
9. BuildPilot recommends architecture and stack.
10. User confirms stack.
11. BuildPilot generates build phases and tasks.
12. User selects first task.
13. BuildPilot generates a Mission Brief for an external tool.
14. User completes work externally.
15. User returns with a Tool Session Summary.
16. BuildPilot ingests the summary.
17. BuildPilot updates project memory.
18. BuildPilot recommends next step.

---

## 15. Main App Structure

### 15.1 Pages

#### Public Pages

- `/`
  - Landing page
  - Product explanation
  - CTA to sign up

- `/login`
  - Login/sign up

#### Authenticated Pages

- `/app`
  - Project dashboard

- `/app/projects/new`
  - New project wizard

- `/app/projects/[projectId]`
  - Project home / command center

- `/app/projects/[projectId]/brief`
  - Product brief

- `/app/projects/[projectId]/prd`
  - PRD viewer/editor

- `/app/projects/[projectId]/architecture`
  - Architecture map

- `/app/projects/[projectId]/tasks`
  - Task planner

- `/app/projects/[projectId]/missions/[missionId]`
  - External tool mission page

- `/app/projects/[projectId]/return`
  - Paste return brief

- `/app/projects/[projectId]/decisions`
  - Decision log

- `/app/projects/[projectId]/risks`
  - Risks and warnings

- `/app/projects/[projectId]/docs`
  - Living docs export

- `/app/settings`
  - User settings

---

## 16. Navigation Model

Project-level navigation should include:

- Overview
- Brief
- PRD
- Architecture
- Tasks
- Missions
- Decisions
- Risks
- Docs

The Overview page should always answer:

1. What are we building?
2. What stage are we in?
3. What is the next recommended step?
4. What is blocked?
5. What changed recently?

---

## 17. Project Lifecycle Stages

Each project should have a current lifecycle stage:

1. Idea Capture
2. Product Clarification
3. PRD Drafting
4. Architecture Planning
5. Stack Confirmation
6. Task Planning
7. External Build
8. Return Review
9. Iteration
10. Testing
11. Deployment Prep
12. Live Product

MVP can support stages 1–9.

---

## 18. Core Feature Details

## 18.1 Authentication

### Description

Users can create an account and manage their own projects.

### Requirements

- Supabase Auth
- Email/password login
- Magic link optional later
- Each user can only access their own projects
- RLS must be enabled on all user-owned tables

### Acceptance Criteria

- User can sign up
- User can log in
- User can log out
- User cannot access another user’s project

---

## 18.2 Project Dashboard

### Description

A home screen showing all user projects.

### Requirements

Each project card should show:
- project name
- one-line description
- current stage
- last updated date
- next recommended action

### Empty State

If no projects exist:
- explain what BuildPilot does
- show CTA: “Start your first product”

### Acceptance Criteria

- User sees only their projects
- User can create new project
- User can open existing project

---

## 18.3 New Project Wizard

### Description

A guided flow that captures the initial product idea.

### Input Fields

Required:
- project name
- raw idea description
- target user
- problem being solved

Optional:
- preferred platform
- technical comfort level
- existing assets/links
- constraints
- monetization goal
- deadline

### AI Behavior

After user submits, AI should generate:
- clarified summary
- assumptions
- missing questions
- suggested MVP direction

### UX

The user should not be overwhelmed. Ask up to 5 high-value clarification questions.

### Acceptance Criteria

- User can create project from idea
- AI generates Product Brief draft
- User can accept or edit the brief

---

## 18.4 Product Brief Generator

### Description

Creates a short structured product brief.

### Output Structure

- Product name
- One-liner
- Target users
- Problem
- Proposed solution
- MVP scope
- Non-goals
- Success criteria
- Key risks
- Open questions

### Acceptance Criteria

- Brief is saved to project memory
- Brief can be edited manually
- Changes are versioned or logged as updates

---

## 18.5 PRD Generator

### Description

Generates a more detailed PRD from the Product Brief.

### Output Structure

- Overview
- Goals
- Non-goals
- Personas
- User journeys
- Core features
- Functional requirements
- Non-functional requirements
- Data model draft
- Permissions/auth model
- Analytics events
- Edge cases
- Acceptance criteria
- MVP scope
- Future scope

### AI Behavior

The PRD generator should:
- stay aligned with the Product Brief
- avoid overbuilding
- identify missing assumptions
- mark uncertainty explicitly

### Acceptance Criteria

- User can generate PRD
- User can approve/edit sections
- Approved PRD becomes source-of-truth artifact

---

## 18.6 Architecture Recommendation

### Description

Recommends an architecture based on the PRD and user preferences.

### MVP Default Stack

If the user has no strong preference, recommend:

- Next.js
- TypeScript
- Supabase
- Vercel
- GitHub
- shadcn/ui

### Output Structure

- Recommended stack
- Why this stack
- System diagram in text
- Data model
- Auth model
- File/storage model if relevant
- API routes/server actions
- Deployment plan
- Security considerations
- Risks
- Alternatives considered

### Acceptance Criteria

- Architecture is saved
- Key decisions are added to Decision Log
- User can approve/edit stack

---

## 18.7 Decision Log

### Description

Persistent record of important decisions.

### Decision Types

- product
- design
- technical
- architecture
- business
- security
- data
- AI/tooling

### Decision Fields

- title
- decision
- rationale
- alternatives considered
- impact
- date
- status
- linked artifact

### Acceptance Criteria

- Decisions are created automatically from AI outputs
- User can manually add decisions
- User can mark decisions as changed/deprecated

---

## 18.8 Task Planner

### Description

Converts PRD and architecture into manageable build tasks.

### Task Fields

- title
- description
- phase
- priority
- complexity
- dependencies
- recommended tool
- mission brief
- status
- acceptance criteria

### Task Statuses

- not_started
- ready
- sent_to_tool
- returned
- needs_review
- approved
- blocked

### Example Phases

1. Project setup
2. Data model
3. Auth
4. Core UI
5. Core workflows
6. AI features
7. Testing
8. Deployment prep

### Acceptance Criteria

- System generates task list
- User can select a task
- Task creates a Mission Brief

---

## 18.9 AI Tool Router

### Description

Recommends the best external tool/model for a given task.

### MVP Tool Types

- ChatGPT / GPT
- Claude / Claude Code
- Cursor
- Lovable
- v0
- Gemini
- Replit

### Routing Logic

Examples:

- UI screen generation → v0 or Lovable
- deep architecture review → Claude
- codebase editing → Cursor or Claude Code
- bug diagnosis → Claude or GPT
- product critique → GPT or Claude
- research → Gemini or Perplexity-like tool
- visual polish → v0 or Lovable

### Output

For each task, BuildPilot should show:

- recommended tool
- why this tool
- copy-paste mission brief
- expected output
- return brief prompt

### Acceptance Criteria

- Every build task gets a recommended tool
- User can override recommendation
- Tool choice is saved

---

## 18.10 Mission Brief Generator

### Description

Generates a copy-paste prompt for an external AI tool.

### Mission Brief Structure

- Context
- Product summary
- Current task
- Relevant decisions
- Constraints
- Files/artifacts to consider
- Exact requested output
- Acceptance criteria
- What not to do
- Return instructions

### Example Mission Brief

```text
You are helping me build a product called [Product Name].

Project context:
[short product summary]

Current task:
[task description]

Important decisions to respect:
- [decision]
- [decision]

Constraints:
- Use Next.js, TypeScript, Supabase, shadcn/ui.
- Do not introduce a new backend framework.
- Keep implementation simple and maintainable.

Please complete this task:
[task]

Acceptance criteria:
- [criteria]

At the end, summarize what changed and any risks.
```

### Acceptance Criteria

- Mission Brief can be copied
- Mission Brief includes relevant project memory
- User can mark mission as sent

---

## 18.11 Return Brief Prompt

### Description

A reusable prompt the user pastes into the external tool at the end of a work session.

### Default Return Brief Prompt

```text
Summarize everything that happened in this session for my external product-building system.

Return ONLY structured markdown in this format:

# Tool Session Summary

## Tool used
[Name of tool/model]

## Original task
[What I asked you to do]

## What was changed or created
- [Files, screens, components, flows, database changes, prompts, configs]

## Key decisions made
- [Decision]
- [Reason]

## Assumptions made
- [Assumption]

## Problems encountered
- [Bug, limitation, uncertainty]

## Current status
[Done / partially done / blocked]

## What still needs review
- [Item]

## Suggested next step
[One clear next action]

## Copy-paste artifacts
[Important code, config, schema, commands, links, or generated text]

## Risks / warnings
- [Anything that may break, be insecure, be incomplete, or need human review]
```

### Acceptance Criteria

- Return Brief Prompt is available on every mission page
- User can copy it
- User can paste returned summary into BuildPilot

---

## 18.12 Return Brief Ingestion

### Description

The user pastes the Tool Session Summary back into BuildPilot.

BuildPilot analyzes it and updates project state.

### AI Analysis Tasks

The system should identify:

- what was completed
- what changed
- new decisions
- assumptions
- risks
- blockers
- drift from PRD/architecture
- docs that need updates
- recommended next step

### Output After Ingestion

Show user:

- summary of what happened
- updated task status
- new decisions detected
- risks detected
- recommended action

### Acceptance Criteria

- User can paste return brief
- System saves raw summary
- System extracts structured data
- System updates task status
- System suggests next step

---

## 18.13 Drift Detector

### Description

Detects when external work may conflict with project memory.

### Drift Types

- Product drift
- Architecture drift
- Stack drift
- Data model drift
- Auth/security drift
- Design drift
- Scope creep

### Example

If architecture says Supabase Auth, but return brief says custom JWT auth was added, flag as architecture drift.

### Output

- Drift title
- Severity
- Explanation
- Suggested fix
- Should user continue or go back?

### Acceptance Criteria

- Drift is detected from return briefs
- Drift is shown on project overview
- Drift can be dismissed or resolved

---

## 18.14 Risk Register

### Description

A persistent list of risks and warnings.

### Risk Fields

- title
- description
- severity
- category
- source
- status
- recommended action

### Categories

- product
- technical
- security
- privacy
- UX
- scope
- dependency
- deployment
- AI hallucination

### Acceptance Criteria

- Risks can be created by AI analysis
- Risks can be manually added
- User can mark resolved

---

## 18.15 Living Documentation

### Description

BuildPilot generates and maintains living documentation.

### MVP Docs

- Product Brief
- PRD
- Architecture
- Decisions
- Tasks
- Risks
- Tool Sessions

### Export Formats

MVP:
- Markdown copy

Later:
- GitHub commit
- PDF
- Notion
- Google Docs

### Acceptance Criteria

- User can view docs
- User can copy markdown
- Docs reflect current project state

---

## 18.16 Next Step Recommendation

### Description

The project overview should always show the best next step.

### Inputs

- project stage
- open tasks
- unresolved risks
- open questions
- recent return briefs
- approved artifacts

### Output

- recommended next step
- why this is next
- estimated difficulty
- suggested tool
- CTA

### Acceptance Criteria

- Every project has a next recommended action
- Next action updates after return brief ingestion

---

## 19. AI System Architecture

### 19.1 AI Service Layer

Create a clean internal AI service wrapper.

Example:

```ts
interface AIRequest {
  taskType: string;
  projectId: string;
  input: unknown;
  modelPreference?: string;
}

interface AIResponse<T> {
  data: T;
  rawText?: string;
  provider: string;
  model: string;
}
```

### 19.2 Suggested AI Task Types

- generate_product_brief
- generate_prd
- generate_architecture
- generate_tasks
- generate_mission_brief
- analyze_return_brief
- detect_drift
- recommend_next_step
- summarize_project

### 19.3 Structured Output

Where possible, use Zod schemas or JSON schema validation for AI outputs.

If AI output fails validation:
- retry once with correction prompt
- save raw output for debugging
- show friendly error

---

## 20. Suggested Database Schema

### 20.1 `profiles`

- id uuid primary key references auth.users
- email text
- full_name text nullable
- created_at timestamp
- updated_at timestamp

### 20.2 `projects`

- id uuid primary key
- user_id uuid references profiles(id)
- name text
- slug text
- description text
- current_stage text
- status text
- preferred_stack jsonb
- created_at timestamp
- updated_at timestamp

### 20.3 `artifacts`

Stores generated and edited project artifacts.

- id uuid primary key
- project_id uuid references projects(id)
- type text
- title text
- content_markdown text
- content_json jsonb
- status text
- version integer
- created_at timestamp
- updated_at timestamp

Artifact types:
- product_brief
- prd
- architecture
- design_system
- data_model
- analytics_plan
- docs_export

### 20.4 `decisions`

- id uuid primary key
- project_id uuid references projects(id)
- title text
- decision text
- rationale text
- alternatives jsonb
- category text
- status text
- source_artifact_id uuid nullable
- created_at timestamp
- updated_at timestamp

### 20.5 `tasks`

- id uuid primary key
- project_id uuid references projects(id)
- title text
- description text
- phase text
- priority text
- complexity text
- status text
- recommended_tool text
- acceptance_criteria jsonb
- dependencies jsonb
- created_at timestamp
- updated_at timestamp

### 20.6 `missions`

- id uuid primary key
- project_id uuid references projects(id)
- task_id uuid references tasks(id)
- tool_name text
- mission_brief text
- return_prompt text
- status text
- sent_at timestamp nullable
- returned_at timestamp nullable
- created_at timestamp
- updated_at timestamp

### 20.7 `tool_sessions`

- id uuid primary key
- project_id uuid references projects(id)
- mission_id uuid references missions(id)
- tool_name text
- raw_summary text
- parsed_summary jsonb
- status text
- created_at timestamp

### 20.8 `risks`

- id uuid primary key
- project_id uuid references projects(id)
- title text
- description text
- severity text
- category text
- source text
- status text
- recommended_action text
- created_at timestamp
- updated_at timestamp

### 20.9 `open_questions`

- id uuid primary key
- project_id uuid references projects(id)
- question text
- category text
- status text
- answer text nullable
- created_at timestamp
- updated_at timestamp

### 20.10 `ai_logs`

- id uuid primary key
- project_id uuid nullable
- task_type text
- provider text
- model text
- input jsonb
- output jsonb
- raw_output text
- status text
- error text nullable
- created_at timestamp

---

## 21. Supabase RLS Requirements

All project-owned tables must enforce:

- users can only select rows where project.user_id = auth.uid()
- users can only insert rows into their own projects
- users can only update rows in their own projects
- users can only delete rows in their own projects

Tables requiring RLS:
- projects
- artifacts
- decisions
- tasks
- missions
- tool_sessions
- risks
- open_questions
- ai_logs

---

## 22. UI/UX Requirements

### 22.1 Design Style

Use shadcn/ui with:
- clean dashboard layout
- cards
- progress indicators
- step-based flows
- calm visual hierarchy
- generous spacing
- no overwhelming technical clutter

### 22.2 Product Tone

The product should feel:
- calm
- expert
- encouraging
- practical
- opinionated but not arrogant

### 22.3 Key UX Components

- Project cards
- Stage progress bar
- Next action card
- Artifact viewer/editor
- Copy prompt button
- Paste return brief textarea
- Risk badges
- Decision timeline
- Task board/list
- Tool recommendation card

---

## 23. Project Overview Page Requirements

The project overview is the command center.

It should show:

1. Project one-liner
2. Current stage
3. Next recommended action
4. Active task
5. Open risks
6. Open questions
7. Recent decisions
8. Recent tool sessions
9. Key artifacts status

### Main CTA Logic

- If no brief: “Clarify idea”
- If brief exists but no PRD: “Generate PRD”
- If PRD exists but no architecture: “Plan architecture”
- If architecture exists but no tasks: “Create build plan”
- If ready tasks exist: “Start next mission”
- If mission sent: “Paste return brief”
- If return needs review: “Review result”

---

## 24. MVP User Stories

### Account

- As a user, I can create an account so my projects are saved.
- As a user, I can log in and see only my projects.

### Project Creation

- As a user, I can describe my product idea in plain language.
- As a user, I can answer a small number of clarification questions.
- As a user, I can receive a structured Product Brief.

### PRD

- As a user, I can generate a PRD from my Product Brief.
- As a user, I can edit and approve the PRD.

### Architecture

- As a user, I can receive a recommended architecture.
- As a user, I can see why this stack was recommended.
- As a user, I can approve or modify the stack.

### Tasks

- As a user, I can generate a build task list.
- As a user, I can see what to do next.
- As a user, I can get a copy-paste mission prompt for an external AI tool.

### External Tool Loop

- As a user, I can copy a mission brief.
- As a user, I can copy a return brief prompt.
- As a user, I can paste a returned summary back into BuildPilot.
- As a user, I can see what changed and what to do next.

### Memory

- As a user, I can view decisions made during the project.
- As a user, I can view risks and open questions.
- As a user, I can export the current project documentation.

---

## 25. AI Prompting Requirements

### 25.1 Global AI Behavior

AI should:
- be practical
- be concise but sufficiently detailed
- avoid overengineering
- identify assumptions
- ask only high-value questions
- respect project decisions
- preserve user constraints
- explain tradeoffs
- produce structured outputs

AI should not:
- invent unsupported facts
- silently change stack
- recommend unnecessary tools
- produce huge irrelevant documentation
- mark uncertain work as definitely complete

---

## 26. Suggested AI Prompts

### 26.1 Product Brief Prompt

```text
You are a senior product strategist helping an independent builder turn a raw idea into a clear MVP.

Use the user’s idea and constraints to generate a structured Product Brief.

Be practical. Avoid overbuilding. Mark assumptions clearly. Ask only the most important missing questions.

Return structured JSON matching the required schema.
```

### 26.2 PRD Prompt

```text
You are a senior product manager creating a PRD for an AI-assisted software product.

Use the approved Product Brief as the source of truth.

Generate a clear MVP-focused PRD with goals, non-goals, personas, user journeys, functional requirements, data model draft, analytics events, edge cases, and acceptance criteria.

Do not add unnecessary complexity. Mark uncertainty explicitly.
```

### 26.3 Architecture Prompt

```text
You are a senior software architect advising a semi-technical independent builder.

Recommend a simple, maintainable architecture based on the PRD and user preferences.

Default preferred stack:
Next.js, TypeScript, Supabase, shadcn/ui, Vercel, GitHub.

Explain tradeoffs in plain language. Avoid vendor lock-in where possible. Identify risks.
```

### 26.4 Task Planner Prompt

```text
You are a technical product lead converting a PRD and architecture into a practical build plan.

Create small, ordered implementation tasks.

Each task should include title, description, phase, dependencies, recommended tool, acceptance criteria, and return expectations.

Avoid tasks that are too large. Each task should be suitable for an AI coding session.
```

### 26.5 Return Brief Analysis Prompt

```text
You are the project memory and review layer for an AI-assisted product build.

Analyze the external tool session summary against the project’s PRD, architecture, decisions, and current task.

Identify:
- completed work
- new decisions
- assumptions
- risks
- blockers
- possible drift
- documentation updates
- recommended next step

Treat the summary as evidence, not absolute truth.
```

---

## 27. MVP Build Plan

### Phase 0 — Repo Setup

- Create Next.js app
- Add TypeScript
- Add Tailwind
- Add shadcn/ui
- Configure Supabase client
- Add environment variables
- Set up GitHub repo
- Deploy to Vercel

### Phase 1 — Auth and Project Dashboard

- Supabase Auth
- Protected app routes
- Project CRUD
- Project dashboard

### Phase 2 — Project Wizard and Product Brief

- New project wizard
- AI Product Brief generation
- Artifact storage
- Brief viewer/editor

### Phase 3 — PRD and Architecture

- PRD generator
- PRD viewer/editor
- Architecture generator
- Decision extraction

### Phase 4 — Task Planner and Mission Briefs

- Task generation
- Task list UI
- Mission Brief generator
- Copy prompt UI
- Mission status tracking

### Phase 5 — Return Brief Loop

- Return Brief paste page
- AI analysis
- Tool session storage
- Risk extraction
- Drift detection
- Next step recommendation

### Phase 6 — Living Docs

- Docs page
- Markdown export
- Decision log
- Risk register

---

## 28. Success Metrics

### MVP Product Metrics

- % of users who create first project
- % of projects with generated Product Brief
- % of projects with generated PRD
- % of projects with at least one Mission Brief copied
- % of projects with at least one Return Brief submitted
- average number of sessions per project
- number of decisions captured per project
- number of risks detected per project

### Qualitative Success

Users should say:

- “I know what to do next.”
- “This keeps my project organized.”
- “I understand what the AI built.”
- “I feel more confident using multiple AI tools.”
- “This prevents me from getting lost.”

---

## 29. Key Risks

### 29.1 Too Much Documentation

Risk: users feel buried in artifacts.

Mitigation:
- show simple summaries first
- hide complexity behind progressive disclosure
- always connect docs to next action

### 29.2 Too Passive

Risk: product becomes a documentation tool.

Mitigation:
- always recommend next action
- flag issues proactively
- guide user through workflow

### 29.3 Too Abstract

Risk: users do not see immediate value.

Mitigation:
- get to first Mission Brief quickly
- show tangible prompts users can paste into tools

### 29.4 Bad AI Outputs

Risk: generated PRDs/tasks are generic.

Mitigation:
- use structured prompts
- ask targeted clarifying questions
- let users edit/approve
- keep artifacts versioned

### 29.5 Tool Ecosystem Changes

Risk: external tools change quickly.

Mitigation:
- keep routing generic
- avoid relying on deep integrations in MVP
- make tools configurable

---

## 30. Future Features

Not MVP, but possible later:

- GitHub integration
- automatic repo inspection
- automatic diff analysis
- direct Cursor/Claude Code handoff files
- browser extension
- MCP server
- team collaboration
- shared project memory
- model benchmarking
- cost tracking
- deployment checklist
- Supabase schema generation
- Vercel deployment verification
- automated screenshots
- product analytics integration
- learning paths based on user confusion
- marketplace of build workflows

---

## 31. MVP Definition of Done

The MVP is successful when a user can:

1. Sign up.
2. Create a project from a raw idea.
3. Generate and edit a Product Brief.
4. Generate and edit a PRD.
5. Generate architecture recommendations.
6. Generate build tasks.
7. Copy a Mission Brief for an external AI tool.
8. Paste a Return Brief back into the system.
9. See updated project memory, risks, decisions, and next step.
10. Export living documentation as markdown.

---

## 32. Recommended First Build Task for Vibe Coding

Start with the skeleton and database, not AI.

First task:

> Build the authenticated project dashboard with Supabase Auth, project CRUD, and a basic project overview page.

Why:
- creates the core container
- validates stack
- enables persistence
- avoids premature AI complexity

---

## 33. Initial Cursor / Claude Code Build Prompt

```text
You are helping me build BuildPilot, an AI-guided product development operating system for independent builders.

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth + Postgres
- Vercel deployment

Your first task:
Create the initial app skeleton with authentication and project management.

Requirements:
1. Set up a clean Next.js App Router project structure.
2. Add Supabase client setup for browser and server usage.
3. Implement auth pages for login/signup/logout.
4. Protect /app routes.
5. Create a project dashboard at /app.
6. Add ability to create a project with name and description.
7. Save projects to Supabase.
8. Show project cards with name, description, current stage, and updated date.
9. Add a project detail page at /app/projects/[projectId].
10. Use shadcn/ui components and keep the UI clean.

Important constraints:
- Use TypeScript.
- Do not overengineer.
- Do not introduce unnecessary state management libraries.
- Use Supabase RLS-ready patterns.
- Keep components organized and readable.

Acceptance criteria:
- User can sign up/login.
- User can create a project.
- User can see only their own projects.
- User can open a project detail page.
- The app can be deployed to Vercel.

After completing the task, provide a structured summary of files changed, decisions made, risks, and next recommended step.
```

---

## 34. Summary

BuildPilot should not compete with AI coding tools.

It should become the missing layer around them:

- product memory
- workflow guidance
- invisible SPDD
- tool orchestration
- best-practice coaching
- return brief ingestion
- living documentation

The strongest MVP is not autonomous coding.

The strongest MVP is:

> A guided product-building workflow that helps users move between AI tools without losing context, decisions, or direction.

