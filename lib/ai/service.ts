import { generateObject } from 'ai'
import { anthropic, MODEL } from './client'
import {
  ClarificationQuestionsSchema,
  ProductBriefSchema,
  PRDSchema,
  ArchitectureSchema,
  TaskListSchema,
  MissionBriefSchema,
  ReturnAnalysisSchema,
  type ClarificationQuestions,
  type ProductBrief,
  type PRD,
  type Architecture,
  type TaskList,
  type MissionBrief,
  type ReturnAnalysis,
} from './schemas'
import {
  CLARIFICATION_SYSTEM,
  PRODUCT_BRIEF_SYSTEM,
  PRD_SYSTEM,
  ARCHITECTURE_SYSTEM,
  TASKS_SYSTEM,
  MISSION_SYSTEM,
  RETURN_SYSTEM,
  formatIdeaContext,
  formatClarificationContext,
} from './prompts'

// ─── Clarification Questions ────────────────────────────────────────────────

export async function generateClarificationQuestions(
  idea: {
    name: string
    description: string
    targetUsers: string
    problem: string
    platform?: string
    constraints?: string
  }
): Promise<ClarificationQuestions> {
  const userMessage = formatIdeaContext(idea)

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: ClarificationQuestionsSchema,
    system: CLARIFICATION_SYSTEM,
    prompt: userMessage,
  })

  return object
}

// ─── Product Brief ───────────────────────────────────────────────────────────

export async function generateProductBrief(
  idea: {
    name: string
    description: string
    targetUsers: string
    problem: string
    platform?: string
    constraints?: string
  },
  questions: Array<{ id: string; question: string }>,
  answers: Record<string, string>
): Promise<ProductBrief> {
  const ideaContext = formatIdeaContext(idea)
  const userMessage = formatClarificationContext(ideaContext, questions, answers)

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: ProductBriefSchema,
    system: PRODUCT_BRIEF_SYSTEM,
    prompt: userMessage,
  })

  return object
}

// ─── PRD ─────────────────────────────────────────────────────────────────────

export async function generatePRD(brief: ProductBrief): Promise<PRD> {
  const prompt = `Generate a detailed PRD based on this approved Product Brief:

Product: ${brief.product_name}
One-liner: ${brief.one_liner}

Target users: ${brief.target_users.join(', ')}

Problem: ${brief.problem}

Solution: ${brief.solution}

MVP Scope:
${brief.mvp_scope.map((s) => `- ${s}`).join('\n')}

Non-goals:
${brief.non_goals.map((s) => `- ${s}`).join('\n')}

Success criteria:
${brief.success_criteria.map((s) => `- ${s}`).join('\n')}

Known risks:
${brief.risks.map((s) => `- ${s}`).join('\n')}

Open questions:
${brief.open_questions.map((s) => `- ${s}`).join('\n')}`

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: PRDSchema,
    system: PRD_SYSTEM,
    prompt,
  })

  return object
}

// ─── Architecture ────────────────────────────────────────────────────────────

export async function generateArchitecture(
  prd: PRD,
  brief: ProductBrief,
  preferences?: string
): Promise<Architecture> {
  const prompt = `Design the technical architecture for this product.

Product: ${brief.product_name}
${brief.one_liner}

PRD Overview: ${prd.overview}

Core Features:
${prd.core_features.map((f) => `- [${f.priority}] ${f.name}: ${f.description}`).join('\n')}

Data Model Draft: ${prd.data_model_draft}
Auth Model: ${prd.auth_model}

Functional Requirements:
${prd.functional_requirements.map((r) => `- ${r}`).join('\n')}

Non-Functional Requirements:
${prd.non_functional_requirements.map((r) => `- ${r}`).join('\n')}

${preferences ? `Builder preferences: ${preferences}` : ''}`

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: ArchitectureSchema,
    system: ARCHITECTURE_SYSTEM,
    prompt,
  })

  return object
}

// ─── Task List ───────────────────────────────────────────────────────────────

export async function generateTasks(
  brief: ProductBrief,
  prd: PRD,
  arch: Architecture
): Promise<TaskList> {
  const prompt = `Generate a complete task list for building this product.

Product: ${brief.product_name}
${brief.one_liner}

Stack: ${arch.recommended_stack.join(', ')}

PRD Overview: ${prd.overview}

Core Features (P0 first):
${prd.core_features.map((f) => `- [${f.priority}] ${f.name}: ${f.description}`).join('\n')}

MVP Scope:
${prd.mvp_scope.map((s) => `- ${s}`).join('\n')}

Architecture decisions:
${arch.decisions.map((d) => `- ${d.title}: ${d.decision}`).join('\n')}

API Routes to implement:
${arch.api_routes.join('\n')}`

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: TaskListSchema,
    system: TASKS_SYSTEM,
    prompt,
  })

  return object
}

// ─── Mission Brief ────────────────────────────────────────────────────────────

export async function generateMissionBrief(
  task: { title: string; description: string; phase: string; recommended_tool: string; acceptance_criteria: string[] },
  context: {
    productName: string
    oneLiner: string
    stack: string[]
    prdOverview: string
    architectureNotes: string
    builtSoFar: string
  }
): Promise<MissionBrief> {
  const prompt = `Create a Mission Brief for this task.

=== TASK ===
Title: ${task.title}
Description: ${task.description}
Phase: ${task.phase}
Recommended Tool: ${task.recommended_tool}
Acceptance Criteria:
${task.acceptance_criteria.map((c) => `- ${c}`).join('\n')}

=== PROJECT CONTEXT ===
Product: ${context.productName}
${context.oneLiner}

Tech Stack: ${context.stack.join(', ')}

PRD Overview: ${context.prdOverview}

Architecture Notes: ${context.architectureNotes}

What has already been built:
${context.builtSoFar}`

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: MissionBriefSchema,
    system: MISSION_SYSTEM,
    prompt,
  })

  return object
}

// ─── Return Brief Analysis ───────────────────────────────────────────────────

export async function analyzeReturnBrief(
  rawSummary: string,
  projectContext: {
    productName: string
    currentStage: string
    taskTitles: string[]
    recentDecisions: string[]
  }
): Promise<ReturnAnalysis> {
  const prompt = `Analyze this Return Brief from an AI coding tool session.

=== RETURN BRIEF (pasted by builder) ===
${rawSummary}

=== PROJECT CONTEXT ===
Product: ${projectContext.productName}
Current Stage: ${projectContext.currentStage}

Existing tasks in the plan:
${projectContext.taskTitles.map((t) => `- ${t}`).join('\n') || '(none)'}

Recent decisions:
${projectContext.recentDecisions.map((d) => `- ${d}`).join('\n') || '(none)'}`

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: ReturnAnalysisSchema,
    system: RETURN_SYSTEM,
    prompt,
  })

  return object
}

// ─── Tasks → Markdown ────────────────────────────────────────────────────────

export function tasksToMarkdown(taskList: TaskList): string {
  const grouped: Record<string, typeof taskList.tasks> = {}
  for (const task of taskList.tasks) {
    if (!grouped[task.phase]) grouped[task.phase] = []
    grouped[task.phase].push(task)
  }

  const sections = Object.entries(grouped).map(([phase, tasks]) => {
    const rows = tasks
      .map(
        (t) =>
          `### [${t.priority}] ${t.title}\n` +
          `**כלי מומלץ:** ${t.recommended_tool} · **מורכבות:** ${t.complexity}\n\n` +
          `${t.description}\n\n` +
          `**קריטריונים:**\n${t.acceptance_criteria.map((c) => `- ${c}`).join('\n')}`
      )
      .join('\n\n')
    return `## ${phase}\n\n${rows}`
  })

  return `# תוכנית משימות\n\n${taskList.notes}\n\n${sections.join('\n\n---\n\n')}`
}

// ─── Mission → Markdown ──────────────────────────────────────────────────────

export function missionToMarkdown(m: MissionBrief): string {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n')
  const numbered = (items: string[]) => items.map((i, idx) => `${idx + 1}. ${i}`).join('\n')

  return `# Mission: ${m.title}

**כלי:** ${m.tool_name}

## הקשר
${m.context}

## מטרה
${m.objective}

## הוראות
${numbered(m.instructions)}

## אסור לעשות
${list(m.constraints)}

## תוצרים נדרשים
${list(m.deliverables)}

## קריטריוני קבלה
${list(m.acceptance_criteria)}

---

## Return Prompt — הדבק אחרי השלמת המשימה

\`\`\`
${m.return_prompt}
\`\`\`
`
}

// ─── Brief → Markdown ───────────────────────────────────────────────────────

export function briefToMarkdown(brief: ProductBrief): string {
  const listItems = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

  return `# ${brief.product_name}

**${brief.one_liner}**

## קהל יעד
${listItems(brief.target_users)}

## הבעיה
${brief.problem}

## הפתרון
${brief.solution}

## סקופ MVP
${listItems(brief.mvp_scope)}

## לא בסקופ MVP
${listItems(brief.non_goals)}

## קריטריוני הצלחה
${listItems(brief.success_criteria)}

## סיכונים
${listItems(brief.risks)}

## שאלות פתוחות
${listItems(brief.open_questions)}
`
}

// ─── PRD → Markdown ─────────────────────────────────────────────────────────

export function prdToMarkdown(prd: PRD): string {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

  return `# PRD

## סקירה כללית
${prd.overview}

## מטרות
${list(prd.goals)}

## לא במטרות
${list(prd.non_goals)}

## פרסונות
${prd.personas.map((p) => `### ${p.name}\n${p.description}`).join('\n\n')}

## פיצ'רים מרכזיים
${prd.core_features.map((f) => `### [${f.priority}] ${f.name}\n${f.description}`).join('\n\n')}

## דרישות פונקציונליות
${list(prd.functional_requirements)}

## דרישות לא-פונקציונליות
${list(prd.non_functional_requirements)}

## מודל נתונים
${prd.data_model_draft}

## אימות והרשאות
${prd.auth_model}

## סקופ MVP
${list(prd.mvp_scope)}

## סקופ עתידי
${list(prd.future_scope)}

## מקרי קצה
${list(prd.edge_cases)}

## קריטריונים לקבלה
${list(prd.acceptance_criteria)}
`
}

// ─── Architecture → Markdown ────────────────────────────────────────────────

export function architectureToMarkdown(arch: Architecture): string {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

  return `# Architecture

## Stack מומלץ
${list(arch.recommended_stack)}

### למה הStack הזה?
${arch.why_this_stack}

## דיאגרמת מערכת
\`\`\`
${arch.system_diagram_text}
\`\`\`

## מודל נתונים
${arch.data_model}

## אימות והרשאות
${arch.auth_model}

## API Routes
${list(arch.api_routes)}

## תוכנית Deploy
${arch.deployment_plan}

## שיקולי אבטחה
${list(arch.security_considerations)}

## סיכונים
${arch.risks.map((r) => `- **[${r.severity}] ${r.title}:** ${r.description}`).join('\n')}

## אלטרנטיבות שנשקלו
${arch.alternatives_considered.map((a) => `- **${a.option}** — ${a.reason_rejected}`).join('\n')}

## החלטות ארכיטקטוניות
${arch.decisions.map((d) => `### ${d.title}\n**החלטה:** ${d.decision}\n**נימוק:** ${d.rationale}\n**קטגוריה:** ${d.category}`).join('\n\n')}
`
}
