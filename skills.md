# Claude Code Skills & Skill Repositories for BuildPilot

This document collects Claude Code / Agent Skills that are relevant for building BuildPilot: an AI Product OS for guided vibe coding, SPDD-style workflows, Next.js, TypeScript, Supabase, shadcn/ui, GitHub, documentation, review, and security.

Use this as a starting reference, not as a blind install list. Prefer official or well-maintained sources first.

---

## 1. Highest-Priority Skills / Repositories

### 1. Supabase Agent Skills

Link: https://github.com/supabase/agent-skills

Why it matters:
BuildPilot uses Supabase for auth, Postgres, RLS, and possibly storage. This is one of the most relevant skill packs because it comes directly from Supabase and is designed to help AI agents work more accurately with Supabase projects.

Use for:
- Supabase Auth
- Database schema design
- RLS policies
- migrations
- generated SQL
- Supabase project structure
- security-sensitive database work

Priority: Very high

Recommended action:
Install or at least study before building the database layer.

---

### 2. Claude Code AI Skills for Next.js AI Apps

Link: https://github.com/laguagu/claude-code-nextjs-skills

Why it matters:
This repository focuses on skills for building AI applications, especially with Next.js. BuildPilot is itself an AI app built with Next.js, TypeScript, and AI SDK, so this is very relevant.

Use for:
- Next.js app architecture
- AI application patterns
- app router conventions
- prompt/agent workflow implementation
- AI SDK-style development

Priority: Very high

Recommended action:
Review and selectively install relevant skills.

---

### 3. Code Review Skill

Link: https://github.com/awesome-skills/code-review-skill

Why it matters:
BuildPilot’s core promise is not just generation, but review, guardrails, drift detection, and best practices. A strong code review skill is useful both for building BuildPilot and for designing its own review logic.

Use for:
- reviewing generated code
- checking TypeScript/React quality
- maintainability review
- framework-specific review
- pre-commit or PR review workflows

Priority: High

Recommended action:
Use as a review companion after each implementation mission.

---

### 4. Claude Code Security Review

Link: https://github.com/anthropics/claude-code-security-review

Why it matters:
This is an Anthropic security review GitHub Action using Claude Code. BuildPilot will handle auth, user projects, database access, RLS, and maybe API keys, so security review is important from the start.

Use for:
- GitHub pull request security review
- auth-related changes
- database/RLS changes
- API route changes
- environment variable handling
- preventing obvious vulnerabilities

Priority: High

Recommended action:
Add when the GitHub workflow is ready. Especially useful before production.

---

### 5. Structured Prompt-Driven Development Reference

Link: https://martinfowler.com/articles/structured-prompt-driven/

Why it matters:
This is not a Claude Code skill, but it is the conceptual backbone for BuildPilot’s SPDD layer. It explains why structured prompts should become versioned, reusable, reviewable assets rather than ad-hoc chat messages.

Use for:
- product philosophy
- prompt contract design
- SPDD documentation
- Mission Brief / Return Brief logic
- artifact-driven workflows

Priority: High

Recommended action:
Use it as a conceptual reference when designing BuildPilot’s internal workflow engine.

---

## 2. Skill Directories / Discovery Repositories

### 6. VoltAgent Awesome Agent Skills

Link: https://github.com/VoltAgent/awesome-agent-skills

Why it matters:
A large curated collection of agent skills compatible with Claude Code, Codex, Gemini CLI, Cursor, and other agents.

Use for:
- discovering new skills
- comparing skill patterns
- finding reusable workflows
- multi-agent inspiration

Priority: High for discovery, medium for direct installation

Recommended action:
Use as a catalog, not as a bulk install source.

---

### 7. Awesome Agent Skills Website

Link: https://www.awesomeskills.dev/en

Why it matters:
A web directory for discovering reusable agent skills across Claude Code, Codex, Cursor, and other tools.

Use for:
- browsing skill categories
- finding maintained skills
- comparing skill descriptions

Priority: Medium-high

Recommended action:
Use when looking for a specific skill category.

---

### 8. TravisVN Awesome Claude Skills

Link: https://github.com/travisvn/awesome-claude-skills

Why it matters:
A curated list of Claude Skills, resources, and tools, especially around Claude Code workflows.

Use for:
- discovering community skills
- learning skill organization patterns
- finding inspiration for your own BuildPilot-specific skill

Priority: Medium-high

Recommended action:
Browse when you want to expand beyond the core stack.

---

### 9. Composio Awesome Claude Skills

Link: https://github.com/ComposioHQ/awesome-claude-skills

Why it matters:
Explains and catalogs Claude Skills as reusable instruction packages. Useful for understanding the expected structure of a skill: SKILL.md, YAML frontmatter, instructions, and optional assets/scripts.

Use for:
- understanding skill anatomy
- designing your own BuildPilot skill
- examples of reusable agent instructions

Priority: Medium

Recommended action:
Use as a format reference.

---

### 10. Awesome Claude Skills Visual Directory

Link: https://awesomeclaude.ai/awesome-claude-skills

Why it matters:
A visual directory for exploring skill categories such as development, data, writing, research, collaboration, and security.

Use for:
- quick discovery
- browsing categories
- non-code workflow inspiration

Priority: Medium

Recommended action:
Useful for exploration, less important than official repos.

---

## 3. Larger Community Skill Libraries

### 11. alirezarezvani/claude-skills

Link: https://github.com/alirezarezvani/claude-skills

Why it matters:
A large open-source library of Claude Code skills and agent plugins covering engineering, DevOps, marketing, compliance, and executive personas.

Use for:
- product/business personas
- CPO/CTO-style workflows
- compliance and DevOps inspiration
- broad experimentation

Priority: Medium

Caution:
Large community libraries may vary in quality. Install selectively.

---

### 12. daymade/claude-code-skills

Link: https://github.com/daymade/claude-code-skills

Why it matters:
A marketplace-style repository of production-oriented Claude Code skills.

Use for:
- enhanced development workflows
- reusable coding skills
- workflow inspiration

Priority: Medium

Caution:
Review each skill before installing.

---

### 13. heilcheng/awesome-agent-skills

Link: https://github.com/heilcheng/awesome-agent-skills

Why it matters:
A community-curated list focused on practical agent skills used by real teams, compatible with Claude Code, Codex, Cursor, Copilot, Gemini CLI, and more.

Use for:
- practical real-world skills
- cross-agent patterns
- non-bulk-generated examples

Priority: Medium

Recommended action:
Use for discovery and quality comparison.

---

## 4. Relevant Templates / Frameworks

### 14. Next.js + Supabase AI Template

Link: https://github.com/gvago/nextjs-supabase-ai-template

Why it matters:
A Next.js + Supabase template optimized for Claude Code-style agentic development. It includes a production-oriented full-stack pattern and a Claude Code framework.

Use for:
- project structure inspiration
- Supabase + Next.js patterns
- AI-assisted starter architecture
- Claude Code conventions

Priority: Medium-high

Caution:
It may include architectural choices beyond your preferred stack, so copy ideas rather than adopting blindly.

---

### 15. Next.js + Supabase Starter for AI-assisted Development

Link: https://www.reddit.com/r/ClaudeAI/comments/1l30p37/i_built_a_free_nextjs_supabase_starter/

Why it matters:
A community-shared starter reportedly built for AI-assisted development with Next.js, Supabase, TypeScript, Tailwind, shadcn/ui, auth, helpers, and AI-readable docs.

Use for:
- starter inspiration
- comparing project organization
- seeing what AI-readable project docs look like

Priority: Medium

Caution:
Reddit source. Verify the linked repo and code quality before using.

---

### 16. CLAUDE.md — Next.js + TypeScript + Tailwind + shadcn Guidelines

Link: https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a

Why it matters:
A practical CLAUDE.md-style guide for Next.js, TypeScript, Tailwind, shadcn/ui, testing, and component conventions.

Use for:
- creating your own CLAUDE.md
- coding conventions
- shadcn usage rules
- testing conventions
- project consistency

Priority: Medium-high

Recommended action:
Use as inspiration for the first BuildPilot CLAUDE.md file.

---

## 5. Product / PM-Oriented Skills

### 17. Snyk — Top Claude Skills for Product Managers

Link: https://snyk.io/de/articles/7-claude-skills-product-managers/

Why it matters:
Covers Claude Skills for product workflows such as PRD generation, prioritization, and JTBD analysis. Useful because BuildPilot itself is a product-guidance system, not just an engineering tool.

Use for:
- PRD generation ideas
- prioritization frameworks
- JTBD analysis
- product critique workflows

Priority: Medium

Recommended action:
Use for product-management skill inspiration.

---

## 6. Subagents / Multi-Agent Inspiration

### 18. Awesome Claude Code Subagents

Link: https://github.com/VoltAgent/awesome-claude-code-subagents

Why it matters:
A collection of specialized Claude Code subagents for many development use cases.

Use for:
- designing future BuildPilot tool routing
- specialized review agents
- architecture/design/debug agents
- understanding how others split agent responsibilities

Priority: Medium

Caution:
Do not overbuild multi-agent flows in the MVP. Use this mainly for inspiration.

---

## 7. Official Docs / Must-Read References

### 19. Anthropic Agent Skills Docs

Link: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

Why it matters:
Official Claude documentation for Agent Skills. Explains how skills package domain expertise and organizational knowledge.

Use for:
- understanding official skill behavior
- writing your own skills
- avoiding outdated community assumptions

Priority: Very high

Recommended action:
Read before installing or writing custom skills.

---

### 20. Claude Code Code Review Docs

Link: https://code.claude.com/docs/en/code-review

Why it matters:
Official Claude Code documentation for code review workflows on GitHub pull requests.

Use for:
- PR review workflow
- GitHub integration planning
- security and regression review patterns

Priority: High

Recommended action:
Read before setting up review automation.

---

## 8. Recommended Install / Review Order

### First wave — directly relevant to your stack

1. Supabase Agent Skills
   - https://github.com/supabase/agent-skills

2. Claude Code AI Skills for Next.js AI Apps
   - https://github.com/laguagu/claude-code-nextjs-skills

3. Code Review Skill
   - https://github.com/awesome-skills/code-review-skill

4. Claude Code Security Review
   - https://github.com/anthropics/claude-code-security-review

5. CLAUDE.md Next.js/shadcn conventions
   - https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a

---

### Second wave — discovery and expansion

6. Awesome Agent Skills
   - https://github.com/VoltAgent/awesome-agent-skills

7. Awesome Agent Skills Website
   - https://www.awesomeskills.dev/en

8. Awesome Claude Skills
   - https://github.com/travisvn/awesome-claude-skills

9. Composio Awesome Claude Skills
   - https://github.com/ComposioHQ/awesome-claude-skills

10. Awesome Claude Code Subagents
   - https://github.com/VoltAgent/awesome-claude-code-subagents

---

## 9. BuildPilot-Specific Custom Skills Worth Creating

Beyond installing external skills, BuildPilot should probably define its own Claude Code skills.

### 9.1 buildpilot-spdd-guardian

Purpose:
Ensure every coding task respects the current PRD, architecture, decisions, constraints, and acceptance criteria.

Use when:
- starting any implementation task
- reviewing generated code
- checking for drift

Core instruction:
Do not start implementation before reading the project artifacts and confirming the task boundary.

---

### 9.2 buildpilot-return-brief

Purpose:
At the end of a Claude Code session, summarize exactly what happened in the structured Return Brief format.

Use when:
- finishing an external coding session
- preparing to paste back into BuildPilot

Core instruction:
Include changed files, commands run, decisions made, assumptions, risks, blockers, and next step.

---

### 9.3 buildpilot-nextjs-supabase-reviewer

Purpose:
Review code for Next.js, TypeScript, Supabase, RLS, shadcn/ui, and Vercel readiness.

Use when:
- auth/database code changed
- project structure changed
- deployment config changed

Core instruction:
Prioritize security, maintainability, and simplicity over cleverness.

---

### 9.4 buildpilot-doc-sync

Purpose:
Update living documentation after code changes.

Use when:
- a mission is completed
- architecture changes
- database schema changes
- user flows change

Core instruction:
Update docs without inventing new decisions. If a decision changed, flag it explicitly.

---

### 9.5 buildpilot-task-slicer

Purpose:
Break large product/engineering goals into bounded AI-executable tasks.

Use when:
- turning PRD into build tasks
- splitting a failed task into smaller pieces

Core instruction:
Each task must have clear acceptance criteria and be small enough for one AI coding session.

---

## 10. Recommended Initial CLAUDE.md for the BuildPilot Repo

```markdown
# BuildPilot — Claude Code Project Instructions

BuildPilot is an AI-guided product development operating system for independent builders.

Core stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth + Postgres
- Vercel
- GitHub
- Vercel AI SDK

Core product principle:
BuildPilot is not a coding agent. It is a guided product workflow, memory, and SPDD orchestration layer.

Before implementing features:
1. Check the PRD.
2. Check the SPSD/SPDD spec.
3. Identify relevant decisions and constraints.
4. Keep scope small.
5. Do not introduce new frameworks without explicit approval.
6. Prefer simple, maintainable implementation.
7. Use Supabase RLS-safe patterns.
8. Use shadcn/ui components where appropriate.
9. Keep AI outputs structured and validated where possible.
10. At the end, produce a Return Brief.

Do not:
- overengineer
- silently change architecture
- introduce unnecessary state management
- bypass Supabase RLS assumptions
- create generic chatbot UX when a workflow/state-machine UX is needed
- mark risky work as complete without review

After each significant task, summarize:
- files changed
- what was implemented
- decisions made
- assumptions
- risks
- tests run
- next recommended step
```

---

## 11. Bottom Line

For BuildPilot, the most important Claude Code setup is not only installing random skills.

The strongest setup is:

1. Official/serious stack skills:
   - Supabase
   - Next.js
   - code review
   - security review

2. A strong project-level CLAUDE.md.

3. Custom BuildPilot-specific skills around:
   - SPDD guardrails
   - return briefs
   - drift detection
   - documentation sync
   - task slicing

That combination is much more valuable than chasing every new agent skill that appears.
