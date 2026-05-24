# SPSD / SPDD — Structured Prompt-Driven Development Spec

## For: BuildPilot — AI Product OS for Guided Vibe Coding

---

# 1. Purpose

This document defines the **Structured Prompt-Driven Development** layer for BuildPilot.

BuildPilot is not only a product planning tool. It is a system that turns human intent into structured, persistent product artifacts, and then uses those artifacts to guide AI-assisted software development across multiple tools.

The goal of this SPSD/SPDD layer is to ensure that every AI interaction is grounded in:

- approved product intent
- current project state
- explicit constraints
- previous decisions
- known risks
- current implementation phase
- expected outputs
- review criteria

This prevents AI tools from improvising, forgetting, drifting, or rebuilding the product inconsistently.

---

# 2. Core Definition

Structured Prompt-Driven Development in BuildPilot means:

> Every prompt sent to an AI tool is generated from structured product memory, and every result returned from an AI tool is parsed back into structured product memory.

In other words:

```text
Human idea
  ↓
Structured product artifacts
  ↓
Generated mission prompts
  ↓
External AI tool execution
  ↓
Structured return brief
  ↓
Memory update / review / next action
```

---

# 3. Key Principle

## Prompts are not random messages.

In BuildPilot, prompts are **runtime views of the project state**.

A Mission Brief is generated from:

- Product Brief
- PRD
- Architecture
- Decisions
- Constraints
- Current task
- Current stage
- Risks
- Open questions
- Tool-specific instructions

A Return Brief is parsed back into:

- completed work
- new decisions
- assumptions
- risks
- blockers
- drift signals
- documentation updates
- next-step recommendations

---

# 4. Strategic Objective

The SPDD layer should make BuildPilot feel simple to users while enforcing a rigorous development process behind the scenes.

Users should experience:

- guidance
- confidence
- clarity
- continuity
- learning

The system should internally enforce:

- structured requirements
- task boundaries
- architecture consistency
- decision persistence
- review loops
- artifact updates
- tool handoff contracts

---

# 5. Visible vs Invisible SPDD

## 5.1 Visible to User

The user sees:

- project stages
- recommended next action
- simple explanations
- copy-paste mission briefs
- return brief prompts
- warnings
- decisions
- risks
- documentation

## 5.2 Invisible to User

The system maintains:

- artifact graph
- decision graph
- dependency graph
- prompt contracts
- schema validation
- drift checks
- AI routing logic
- project memory state

The user should not need to understand the methodology to benefit from it.

---

# 6. Core SPDD Entities

The system should maintain the following structured entities.

## 6.1 Project

Represents the entire product being built.

Fields:

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "current_stage": "idea_capture | clarification | prd | architecture | task_planning | build | return_review | iteration | testing | deployment | live",
  "status": "active | paused | archived",
  "preferred_stack": {},
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## 6.2 Artifact

A durable source-of-truth document or structured object.

Artifact types:

- product_brief
- prd
- architecture
- design_system
- data_model
- user_flows
- analytics_plan
- security_plan
- build_plan
- docs_export

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "type": "string",
  "title": "string",
  "content_markdown": "string",
  "content_json": {},
  "status": "draft | approved | deprecated",
  "version": 1,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

SPDD rule:

> Approved artifacts override draft artifacts when generating mission prompts.

---

## 6.3 Decision

A persistent record of a choice that future AI work must respect.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "title": "string",
  "decision": "string",
  "rationale": "string",
  "category": "product | technical | design | data | auth | security | business | ai_tooling",
  "status": "active | changed | deprecated",
  "alternatives_considered": [],
  "impact": "string",
  "created_at": "timestamp"
}
```

SPDD rule:

> Active decisions must be included in any mission prompt where they are relevant.

---

## 6.4 Constraint

A hard or soft boundary that AI tools must respect.

Examples:

- Use Next.js and TypeScript.
- Use Supabase for auth and database.
- Avoid vendor lock-in.
- Do not introduce custom backend unless approved.
- Keep UX simple for non-technical users.
- Do not overbuild MVP.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "text": "string",
  "type": "technical | product | business | legal | privacy | UX | cost",
  "strictness": "hard | soft",
  "status": "active | inactive"
}
```

SPDD rule:

> Hard constraints must appear explicitly in mission briefs. Soft constraints may appear as guidance.

---

## 6.5 Task

A bounded unit of work.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "title": "string",
  "description": "string",
  "phase": "string",
  "status": "not_started | ready | sent_to_tool | returned | needs_review | approved | blocked",
  "priority": "low | medium | high",
  "complexity": "small | medium | large",
  "recommended_tool": "string",
  "dependencies": [],
  "acceptance_criteria": []
}
```

SPDD rule:

> No external mission should be generated without a task and acceptance criteria.

---

## 6.6 Mission

A structured prompt package sent to an external AI tool.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "task_id": "uuid",
  "tool_name": "string",
  "mission_brief": "string",
  "return_prompt": "string",
  "status": "draft | copied | sent | returned | reviewed",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

SPDD rule:

> A Mission Brief must contain enough context for the external AI tool to complete the task without inventing unrelated scope.

---

## 6.7 Tool Session

A record of what happened in an external AI tool.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "mission_id": "uuid",
  "tool_name": "string",
  "raw_summary": "string",
  "parsed_summary": {},
  "confidence": "low | medium | high",
  "created_at": "timestamp"
}
```

SPDD rule:

> Tool session summaries are evidence, not truth. They must be reviewed against existing project memory.

---

## 6.8 Risk

A potential issue that could affect product quality, delivery, security, or maintainability.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "title": "string",
  "description": "string",
  "category": "product | technical | UX | security | privacy | scope | dependency | AI_hallucination",
  "severity": "low | medium | high | critical",
  "status": "open | resolved | accepted | dismissed",
  "recommended_action": "string"
}
```

SPDD rule:

> High or critical unresolved risks should affect next-step recommendations.

---

## 6.9 Open Question

A missing decision or unanswered requirement.

Fields:

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "question": "string",
  "category": "product | technical | design | business | legal | data | security",
  "status": "open | answered | dismissed",
  "answer": "string | null"
}
```

SPDD rule:

> If an open question blocks a task, the system should ask the user before generating a mission.

---

# 7. Artifact Hierarchy

BuildPilot should treat artifacts as a hierarchy of authority.

Highest authority:

1. Explicit user instructions
2. Active hard constraints
3. Approved decisions
4. Approved architecture
5. Approved PRD
6. Approved product brief
7. Draft artifacts
8. AI suggestions
9. External tool summaries

SPDD rule:

> AI suggestions and external summaries may never silently override approved decisions or hard constraints.

---

# 8. Prompt Contract Model

Every AI prompt generated by BuildPilot should follow a contract.

## 8.1 Prompt Contract Fields

```json
{
  "prompt_type": "product_brief | prd | architecture | task_plan | mission_brief | return_analysis | drift_review | next_step",
  "project_context": {},
  "source_artifacts": [],
  "active_decisions": [],
  "active_constraints": [],
  "current_task": {},
  "expected_output_schema": {},
  "forbidden_actions": [],
  "review_criteria": []
}
```

## 8.2 Prompt Contract Rule

Every AI call must define:

- what the AI is allowed to do
- what it must not change
- what output format is expected
- what project memory it must respect

---

# 9. Mission Brief Structure

Every external mission should include the following sections.

```markdown
# Mission Brief

## Product Context
[Short summary of the product]

## Current Stage
[Current project lifecycle stage]

## Current Task
[Specific task to complete]

## Why This Task Matters
[Plain-language explanation]

## Relevant Product Decisions
- [Decision]

## Relevant Technical Decisions
- [Decision]

## Constraints
- [Hard constraints]
- [Soft constraints]

## Existing Assumptions
- [Assumption]

## Acceptance Criteria
- [Criterion]

## What Not To Do
- [Forbidden action]

## Expected Output
[What the external tool should produce]

## Return Instructions
At the end, use the Return Brief Prompt to summarize what happened.
```

---

# 10. Return Brief Structure

Every external AI session should end with a structured summary.

```markdown
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

---

# 11. Return Brief Ingestion Rules

When a user pastes a Return Brief, BuildPilot should perform the following steps.

## Step 1 — Parse

Extract:

- tool used
- task attempted
- completion status
- changes made
- new decisions
- assumptions
- risks
- blockers
- suggested next step

## Step 2 — Compare

Compare the summary against:

- current task
- acceptance criteria
- PRD
- architecture
- active decisions
- constraints

## Step 3 — Classify

Classify the result as:

- completed_aligned
- completed_with_risks
- partially_completed
- blocked
- drift_detected
- unclear

## Step 4 — Update

Update:

- task status
- mission status
- tool session log
- decision log
- risk register
- open questions
- artifacts if needed

## Step 5 — Recommend

Recommend one of:

- approve and continue
- review manually
- send back to same tool
- send to another tool for review
- revise PRD/architecture
- pause and answer open question

---

# 12. Drift Detection Rules

Drift means that external work may have moved away from approved project intent.

## 12.1 Drift Categories

### Product Drift

The tool built or suggested functionality outside MVP scope.

### Architecture Drift

The tool introduced architecture that conflicts with approved architecture.

### Stack Drift

The tool introduced unapproved libraries, services, or frameworks.

### Data Model Drift

The tool changed entities, fields, or relationships without approval.

### Auth/Security Drift

The tool implemented security-sensitive logic that was not approved.

### Design Drift

The tool changed visual or interaction principles inconsistently.

### Scope Creep

The tool expanded the task beyond the requested unit of work.

---

## 12.2 Drift Severity

Low:
- small inconsistency
- easy to fix
- no architectural impact

Medium:
- affects current feature
- may require review

High:
- conflicts with approved architecture or core decision

Critical:
- security/privacy issue
- major product direction conflict
- deployment-breaking issue

---

## 12.3 Drift Response

If low:
- log warning
- continue with caution

If medium:
- ask user to review
- recommend fix

If high:
- block next mission until resolved

If critical:
- mark project as needing immediate attention
- recommend rollback or expert review

---

# 13. AI Routing Rules

BuildPilot should recommend tools based on task type.

## 13.1 Routing Matrix

| Task Type | Recommended Tool |
|---|---|
| Product strategy | Claude / GPT |
| PRD critique | Claude / GPT |
| Architecture reasoning | Claude |
| UI generation | v0 / Lovable |
| Full-stack prototype | Replit / Lovable |
| Codebase editing | Cursor / Claude Code |
| Debugging | Claude / GPT |
| Research | Gemini / Perplexity-like tool |
| Visual polish | v0 / Lovable |
| Security review | Claude / GPT |
| Documentation | GPT / Claude |

## 13.2 Routing Output

For each recommendation, explain:

- selected tool
- why this tool
- what to paste
- what to expect back
- what risks to watch for

---

# 14. Project Lifecycle State Machine

## 14.1 States

```text
idea_capture
clarification
product_brief_draft
product_brief_approved
prd_draft
prd_approved
architecture_draft
architecture_approved
task_plan_draft
task_plan_approved
mission_ready
mission_sent
return_received
return_reviewed
iteration_ready
testing_ready
deployment_ready
live
```

## 14.2 State Transition Rules

- Cannot generate PRD before Product Brief exists.
- Cannot approve architecture before PRD exists.
- Cannot generate build tasks before architecture exists.
- Cannot generate mission before task exists.
- Cannot mark task approved before return brief is reviewed.
- Cannot move to deployment_ready if high/critical risks are open.

---

# 15. Best Practice Guardrails

Before generating a mission, BuildPilot should check:

- Is the task clear?
- Is there an approved artifact relevant to this task?
- Are there unresolved blocking questions?
- Are acceptance criteria defined?
- Are constraints included?
- Is the recommended tool appropriate?
- Is the task too large?
- Could this create architecture drift?

If guardrails fail, system should show a friendly warning and suggest a fix.

---

# 16. Structured Output Requirements

AI-generated internal outputs should use structured JSON when possible.

## 16.1 Product Brief JSON

```json
{
  "product_name": "string",
  "one_liner": "string",
  "target_users": [],
  "problem": "string",
  "solution": "string",
  "mvp_scope": [],
  "non_goals": [],
  "success_criteria": [],
  "risks": [],
  "open_questions": []
}
```

## 16.2 Decision JSON

```json
{
  "title": "string",
  "decision": "string",
  "rationale": "string",
  "category": "string",
  "alternatives_considered": [],
  "impact": "string"
}
```

## 16.3 Return Analysis JSON

```json
{
  "classification": "completed_aligned | completed_with_risks | partially_completed | blocked | drift_detected | unclear",
  "completed_work": [],
  "new_decisions": [],
  "new_assumptions": [],
  "risks": [],
  "drift_signals": [],
  "recommended_next_step": "string",
  "task_status_recommendation": "string",
  "requires_user_review": true
}
```

---

# 17. Prompt Templates

## 17.1 Generate Mission Brief

```text
You are BuildPilot, an AI product development control tower.

Generate a Mission Brief for an external AI tool.

Use the following source-of-truth project memory:
- Product Brief
- PRD
- Architecture
- Active Decisions
- Active Constraints
- Current Task
- Risks
- Open Questions

The Mission Brief must be clear, bounded, and copy-paste ready.

Do not expand the scope beyond the current task.
Do not introduce new architecture unless explicitly requested.
Include acceptance criteria and what not to do.

Return structured markdown only.
```

---

## 17.2 Analyze Return Brief

```text
You are BuildPilot, the project memory and review layer.

Analyze the Tool Session Summary against the current project memory.

Treat the summary as evidence, not absolute truth.

Identify:
- completed work
- new decisions
- new assumptions
- risks
- blockers
- possible drift
- required documentation updates
- recommended next step

Classify the session result.

Return valid JSON matching the required schema.
```

---

## 17.3 Detect Drift

```text
You are reviewing whether an external AI tool has drifted from the approved product and architecture.

Compare the session summary against:
- approved PRD
- approved architecture
- active constraints
- active decisions
- current task acceptance criteria

Flag any drift. Assign severity. Recommend whether to continue, revise, or block progress.

Return structured JSON.
```

---

# 18. Human Review Model

BuildPilot should not pretend that every AI decision is automatically correct.

## 18.1 Review Levels

No review needed:
- low-risk documentation updates
- summaries
- simple non-technical decisions

User review needed:
- product scope changes
- design direction changes
- medium risks
- task completion approval

Strong review needed:
- auth changes
- database changes
- security/privacy changes
- stack changes
- deployment changes
- high/critical drift

---

# 19. Documentation Sync Rules

When a return brief is ingested:

- New decisions update Decision Log.
- New risks update Risk Register.
- New assumptions update Open Questions or Assumptions.
- Completed work updates Tasks.
- Architecture-impacting changes should propose architecture update, not silently edit it.
- PRD-impacting changes should propose PRD update, not silently edit it.

---

# 20. MVP Implementation Requirements

For MVP, implement only the minimum SPDD loop:

1. Store structured artifacts.
2. Generate Mission Brief from artifacts.
3. Generate Return Brief Prompt.
4. Ingest pasted Return Brief.
5. Extract structured summary.
6. Detect basic risks and drift.
7. Update task status.
8. Recommend next step.

Do not implement full autonomous agents in MVP.

---

# 21. Database Mapping

The SPDD layer maps directly to these database tables:

- projects
- artifacts
- decisions
- constraints
- tasks
- missions
- tool_sessions
- risks
- open_questions
- ai_logs

If `constraints` is not implemented as a separate table in MVP, constraints may initially live inside `artifacts.content_json` or `decisions`.

---

# 22. MVP Acceptance Criteria

The SPDD system is working when:

1. A user can create structured product artifacts from a raw idea.
2. A task can generate a context-aware Mission Brief.
3. The Mission Brief includes relevant decisions and constraints.
4. The user can paste a Return Brief back into the system.
5. The system extracts changes, decisions, assumptions, risks, and next steps.
6. The system flags at least basic drift.
7. The system updates project memory.
8. The next recommended action changes based on the returned work.

---

# 23. Example End-to-End SPDD Flow

## User Idea

```text
I want to build an app that helps teachers create AI-assisted learning activities.
```

## BuildPilot Generates

- Product Brief
- PRD
- Architecture
- Decisions
- Tasks

## Active Decision Example

```text
Use Supabase Auth and Postgres for MVP to avoid custom backend complexity.
```

## Current Task

```text
Create authentication and protected dashboard skeleton.
```

## Mission Brief Includes

- Use Next.js
- Use Supabase Auth
- Use shadcn/ui
- Do not add Firebase
- Do not add custom auth
- Acceptance criteria for login/dashboard

## External Tool Returns

```text
I created login/signup pages, Supabase client helpers, protected /app route, and project dashboard.
I also added Zustand for state management.
```

## BuildPilot Detects

- Auth work likely aligned.
- Zustand may be unnecessary stack drift.
- Need review before accepting.

## BuildPilot Recommends

```text
Review whether Zustand is needed. If not, ask Cursor to remove it and use server data fetching/simple local state.
```

---

# 24. Product Differentiation

The SPDD layer differentiates BuildPilot from regular AI builders because it turns AI work into a governed loop:

```text
Plan → Prompt → Build Elsewhere → Return → Review → Update Memory → Continue
```

Most AI coding tools optimize the “Build” step.

BuildPilot owns the full loop.

---

# 25. Summary

BuildPilot’s SPDD layer is the core product moat.

It ensures that:

- prompts are generated from structured memory
- AI tools receive bounded missions
- external results are reviewed before being accepted
- decisions persist
- drift is detected
- documentation stays alive
- users learn while building
- the product remains independent from any single AI tool

The MVP should prove one thing:

> A guided SPDD loop can help independent builders use many AI tools without losing context, control, or confidence.

