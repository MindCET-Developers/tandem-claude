# Tandem — Claude Code Project Instructions

Tandem is an AI-guided product development OS for independent builders.
It implements an SPDD loop: Plan → Mission → Build Elsewhere → Return → Review → Update Memory.

## Tech Stack
- Next.js 16 App Router
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui
- Supabase Auth + Postgres + RLS
- Vercel AI SDK + Anthropic Claude (claude-sonnet-4-5)
- Vercel deployment

## UI Language
Hebrew labels/copy, English technical terms and AI prompts.
- Hebrew for: page titles, nav items, button labels, form labels, error messages
- English for: code, API routes, console logs, database fields, AI prompts, variable names

## Before Implementing Anything
1. Check plan.md (project root) for current phase
2. Check prd.md for feature requirements
3. Check spdd.md for SPDD rules and artifact hierarchy
4. Check current database schema in supabase/migrations/
5. Keep scope small — implement exactly the current task, nothing more
6. Use Supabase RLS-safe patterns (never bypass RLS)
7. Use shadcn/ui components — do not create custom UI primitives
8. Keep AI outputs structured and Zod-validated
9. Do not add state management libraries — use React state + server actions

## Do NOT
- Overengineer — no abstractions beyond what the task needs
- Silently change architecture or database schema
- Add unapproved libraries or services
- Bypass Supabase RLS
- Mark work as done without meeting acceptance criteria
- Create generic chatbot UX when a structured workflow UI is needed

## After Each Task
Provide a summary:
- Files changed
- What was implemented
- Decisions made
- Assumptions
- Risks
- Next recommended step

## Key File Locations
- Unified project root (code + planning docs): `C:\dev\buildpilot`
- Same folder via OneDrive shortcut: `...\MindCET\Tandem - Claude Code` (junction)
