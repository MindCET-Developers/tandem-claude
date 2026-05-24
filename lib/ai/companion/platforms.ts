export type PlatformId = "cursor" | "claude_code" | "v0" | "lovable" | "generic"

export interface Platform {
  id: PlatformId
  name: string
  bestFor: string[]
  buildMissionPrompt: (brief: string, projectName: string) => string
  returnPrompt: string
}

const RETURN_SUFFIX = `

---
**לפני שסוגר את הסשן — הדבק את הפרומפט הבא ושמור את התשובה:**`

export const PLATFORMS: Record<PlatformId, Platform> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    bestFor: ["implementation", "refactoring", "debugging", "feature development"],
    buildMissionPrompt: (brief, projectName) => `# Mission Brief — ${projectName}

${brief}
${RETURN_SUFFIX}`,
    returnPrompt: `Please generate a Tandem Return Brief for this Cursor session. Format as markdown:

## Completed Work
- (bullet list of what was built/fixed)

## Decisions Made
- Title: | Decision: | Rationale: | Category: technical/product/design

## Files Changed
- (key files modified)

## Risks / Issues
- Title: | Description: | Severity: low/medium/high/critical

## Recommended Next Step
(one clear sentence)`,
  },

  claude_code: {
    id: "claude_code",
    name: "Claude Code",
    bestFor: ["architecture", "complex features", "migrations", "planning", "debugging"],
    buildMissionPrompt: (brief, projectName) => `# Mission Brief — ${projectName}

${brief}
${RETURN_SUFFIX}`,
    returnPrompt: `Generate a Tandem Return Brief for this Claude Code session:

## Completed Work
- (bullet list)

## Decisions Made
- Title: | Decision: | Rationale: | Category:

## Risks / Issues
- Title: | Description: | Severity:

## Recommended Next Step
(one sentence)`,
  },

  v0: {
    id: "v0",
    name: "v0",
    bestFor: ["UI components", "landing pages", "forms", "dashboards", "design"],
    buildMissionPrompt: (brief, projectName) => `Build the following UI component for ${projectName}:

${brief}

After generating, describe: what was built, any design decisions made, and what needs to be integrated into the codebase.`,
    returnPrompt: `Describe this v0 session as a Tandem Return Brief:

## Component Built
(description of what was created)

## Design Decisions
- (list of choices made)

## Integration Notes
- (what needs to happen to use this in the project)

## Recommended Next Step`,
  },

  lovable: {
    id: "lovable",
    name: "Lovable",
    bestFor: ["full-stack features", "CRUD", "forms with backend", "MVP features"],
    buildMissionPrompt: (brief, projectName) => `# ${projectName} — Feature Brief

${brief}`,
    returnPrompt: `Summarize this Lovable session as a Tandem Return Brief:

## What Was Built
## Decisions Made
## Risks
## Recommended Next Step`,
  },

  generic: {
    id: "generic",
    name: "Generic",
    bestFor: ["any tool"],
    buildMissionPrompt: (brief, projectName) => `# Mission Brief — ${projectName}\n\n${brief}`,
    returnPrompt: `Provide a session summary:

## Completed Work
## Decisions Made (title, decision, rationale, category)
## Risks (title, description, severity)
## Recommended Next Step`,
  },
}

export function recommendPlatform(taskType: string): PlatformId {
  const lower = taskType.toLowerCase()
  if (lower.includes("ui") || lower.includes("component") || lower.includes("design") || lower.includes("landing"))
    return "v0"
  if (lower.includes("architecture") || lower.includes("plan") || lower.includes("migration") || lower.includes("complex"))
    return "claude_code"
  if (lower.includes("crud") || lower.includes("full-stack") || lower.includes("backend") || lower.includes("mvp"))
    return "lovable"
  return "cursor"
}
