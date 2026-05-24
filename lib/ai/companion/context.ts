import type { SupabaseClient } from "@supabase/supabase-js"

export async function buildProjectContext(
  projectId: string,
  supabase: SupabaseClient
): Promise<string> {
  try {
    const [projectRes, artifactsRes, decisionsRes, tasksRes, missionsRes] =
      await Promise.all([
        supabase.from("projects").select("name, description, current_stage, status").eq("id", projectId).single(),
        supabase.from("artifacts").select("type, title, status").eq("project_id", projectId),
        supabase.from("decisions").select("title, decision, category").eq("project_id", projectId).eq("status", "active").limit(10).order("created_at", { ascending: false }),
        supabase.from("tasks").select("title, status, recommended_tool, phase").eq("project_id", projectId).limit(20).order("created_at", { ascending: false }),
        supabase.from("missions").select("status, tool_name, created_at").eq("project_id", projectId).order("created_at", { ascending: false }).limit(3),
      ])

    const project = projectRes.data
    if (!project) return ""

    const artifacts = artifactsRes.data ?? []
    const decisions = decisionsRes.data ?? []
    const tasks = tasksRes.data ?? []
    const missions = missionsRes.data ?? []

    const activeTasks = tasks.filter((t) => t.status === "not_started" || t.status === "ready")
    const latestMission = missions[0]

    return `
## Project: ${project.name}
Stage: ${project.current_stage ?? "unknown"}
Description: ${project.description ?? "—"}

## Artifacts
${artifacts.length ? artifacts.map((a) => `- ${a.type}: ${a.title} [${a.status}]`).join("\n") : "No artifacts yet"}

## Active Decisions (most recent 10)
${decisions.length ? decisions.map((d) => `- [${d.category}] ${d.title}: ${d.decision}`).join("\n") : "No decisions logged yet"}

## Pending Tasks
${activeTasks.length ? activeTasks.slice(0, 8).map((t) => `- ${t.title} → ${t.recommended_tool ?? "TBD"} [${t.phase ?? ""}]`).join("\n") : "No pending tasks"}

## Latest Mission
${latestMission ? `Tool: ${latestMission.tool_name ?? "unknown"} | Status: ${latestMission.status}` : "No missions yet"}
    `.trim()
  } catch {
    return ""
  }
}
