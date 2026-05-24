import { z } from 'zod'

// ─── Clarification Questions (Step 2 of wizard) ────────────────────────────

export const ClarificationQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.string().describe('Short unique key, e.g. "monetization"'),
        question: z.string().describe('The question to ask the builder'),
        why: z.string().describe('One sentence: why this question matters'),
      })
    )
    .max(5)
    .describe('Up to 5 high-value clarifying questions'),
  assumptions: z
    .array(z.string())
    .describe('Assumptions already being made about the product'),
  suggested_direction: z
    .string()
    .describe('One paragraph: recommended MVP direction based on the idea'),
})

export type ClarificationQuestions = z.infer<typeof ClarificationQuestionsSchema>

// ─── Product Brief (Step 3 of wizard) ──────────────────────────────────────

export const ProductBriefSchema = z.object({
  product_name: z.string().describe('Clean product name'),
  one_liner: z.string().describe('One sentence describing what it does and for whom'),
  target_users: z.array(z.string()).describe('List of primary user personas'),
  problem: z.string().describe('The core problem being solved'),
  solution: z.string().describe('How this product solves the problem'),
  mvp_scope: z.array(z.string()).describe('List of features included in the MVP'),
  non_goals: z.array(z.string()).describe('What is explicitly OUT of scope for MVP'),
  success_criteria: z
    .array(z.string())
    .describe('Measurable signals that the MVP succeeded'),
  risks: z.array(z.string()).describe('Top risks that could prevent success'),
  open_questions: z.array(z.string()).describe('Questions still unresolved after this brief'),
})

export type ProductBrief = z.infer<typeof ProductBriefSchema>

// ─── PRD Schema (Phase 3) ───────────────────────────────────────────────────

export const PRDSchema = z.object({
  overview: z.string(),
  goals: z.array(z.string()),
  non_goals: z.array(z.string()),
  personas: z.array(z.object({ name: z.string(), description: z.string() })),
  core_features: z.array(
    z.object({ name: z.string(), description: z.string(), priority: z.string() })
  ),
  functional_requirements: z.array(z.string()),
  non_functional_requirements: z.array(z.string()),
  data_model_draft: z.string(),
  auth_model: z.string(),
  mvp_scope: z.array(z.string()),
  future_scope: z.array(z.string()),
  edge_cases: z.array(z.string()),
  acceptance_criteria: z.array(z.string()),
})

export type PRD = z.infer<typeof PRDSchema>

// ─── Architecture Schema (Phase 3) ─────────────────────────────────────────

export const ArchitectureSchema = z.object({
  recommended_stack: z.array(z.string()).describe('Technologies chosen for this project'),
  why_this_stack: z.string().describe('One paragraph justifying the stack choice'),
  system_diagram_text: z
    .string()
    .describe('ASCII or text-based system architecture diagram'),
  data_model: z.string().describe('Key entities and their relationships'),
  auth_model: z.string().describe('Authentication and authorization approach'),
  api_routes: z.array(z.string()).describe('List of API routes and their purpose'),
  deployment_plan: z.string().describe('How and where the app will be deployed'),
  security_considerations: z.array(z.string()),
  risks: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
      })
    )
    .describe('Technical risks from this architecture'),
  alternatives_considered: z.array(
    z.object({ option: z.string(), reason_rejected: z.string() })
  ),
  decisions: z
    .array(
      z.object({
        title: z.string(),
        decision: z.string(),
        rationale: z.string(),
        category: z.string(),
      })
    )
    .describe('Key architectural decisions made'),
})

export type Architecture = z.infer<typeof ArchitectureSchema>

// ─── Task List Schema (Phase 4) ────────────────────────────────────────────

export const TaskItemSchema = z.object({
  title: z.string().describe('Short, action-verb task title'),
  description: z.string().describe('What needs to be built or done'),
  phase: z.string().describe('Phase group name, e.g. "Phase 1: Foundation"'),
  priority: z.enum(['P0', 'P1', 'P2']).describe('P0=blocking, P1=should-have, P2=nice-to-have'),
  complexity: z.enum(['small', 'medium', 'large']).describe('small=<2h, medium=2-8h, large=>8h'),
  recommended_tool: z.string().describe('Best AI tool: Claude Code, Cursor, v0.dev, ChatGPT, etc.'),
  acceptance_criteria: z.array(z.string()).describe('Testable done criteria'),
  dependencies: z.array(z.string()).describe('Titles of tasks this depends on (empty if none)'),
})

export const TaskListSchema = z.object({
  tasks: z.array(TaskItemSchema).min(5).max(30),
  phases: z.array(z.string()).describe('Ordered list of phase names'),
  notes: z.string().describe('Overall notes or warnings about the task plan'),
})

export type TaskItem = z.infer<typeof TaskItemSchema>
export type TaskList = z.infer<typeof TaskListSchema>

// ─── Mission Brief Schema (Phase 4) ───────────────────────────────────────

export const MissionBriefSchema = z.object({
  title: z.string().describe('Clear mission title'),
  tool_name: z.string().describe('The AI tool this mission targets'),
  context: z.string().describe('Product + technical context the tool needs to understand'),
  objective: z.string().describe('Single, clear, achievable goal for this mission'),
  instructions: z.array(z.string()).describe('Ordered step-by-step instructions'),
  constraints: z.array(z.string()).describe('Explicit things the tool must NOT do'),
  deliverables: z.array(z.string()).describe('Exact files/features to produce'),
  return_prompt: z.string().describe('Template the builder fills out and pastes back after the mission'),
  acceptance_criteria: z.array(z.string()).describe('How to verify the mission succeeded'),
})

export type MissionBrief = z.infer<typeof MissionBriefSchema>

// ─── Return Analysis Schema (Phase 5) ─────────────────────────────────────

export const ReturnAnalysisSchema = z.object({
  summary: z.string().describe('2-3 sentence summary of what was accomplished'),
  status: z
    .enum(['completed', 'partial', 'blocked', 'failed'])
    .describe('Overall mission outcome'),

  completed_items: z.array(z.string()).describe('Specific things that are now built and working'),
  blockers: z.array(z.string()).describe('Things that were blocked or could not be completed'),

  new_decisions: z
    .array(
      z.object({
        title: z.string(),
        decision: z.string(),
        rationale: z.string(),
        category: z.string().describe('technical/product/architecture/design/infrastructure'),
      })
    )
    .describe('New decisions made during this mission not in the original plan'),

  new_risks: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
      })
    )
    .describe('New or confirmed risks discovered during the mission'),

  drift_detected: z.boolean().describe('Was there significant deviation from the original plan?'),
  drift_description: z
    .string()
    .describe('If drift detected: what changed, why, and whether it is acceptable'),
  drift_severity: z.enum(['none', 'minor', 'moderate', 'major']),

  task_updates: z
    .array(
      z.object({
        task_title: z.string(),
        new_status: z.enum(['completed', 'partial', 'blocked']),
        notes: z.string(),
      })
    )
    .describe('Which tasks were affected and their new status'),

  next_recommended_actions: z
    .array(z.string())
    .describe('Concrete next steps based on what was learned'),

  files_changed: z.array(z.string()).describe('Files created or modified (from the summary)'),

  open_questions: z
    .array(z.string())
    .describe('New unresolved questions raised during this mission'),
})

export type ReturnAnalysis = z.infer<typeof ReturnAnalysisSchema>
