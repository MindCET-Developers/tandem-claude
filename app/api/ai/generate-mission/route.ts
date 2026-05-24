import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateMissionBrief, missionToMarkdown } from '@/lib/ai/service'
import type { ProductBrief, PRD, Architecture } from '@/lib/ai/schemas'

export async function POST(req: NextRequest) {
  try {
    const { projectId, taskId } = await req.json()
    if (!projectId || !taskId) {
      return NextResponse.json({ error: 'projectId ו-taskId נדרשים' }, { status: 400 })
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'לא מאומת' }, { status: 401 })

    // Fetch task + all context in parallel
    const [taskRes, briefRes, prdRes, archRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('id', taskId).eq('project_id', projectId).single(),
      supabase
        .from('artifacts').select('content_json').eq('project_id', projectId)
        .eq('type', 'product_brief').eq('status', 'approved').maybeSingle(),
      supabase
        .from('artifacts').select('content_json').eq('project_id', projectId)
        .eq('type', 'prd').eq('status', 'approved').maybeSingle(),
      supabase
        .from('artifacts').select('content_json').eq('project_id', projectId)
        .eq('type', 'architecture').eq('status', 'approved').maybeSingle(),
    ])

    if (taskRes.error || !taskRes.data) {
      return NextResponse.json({ error: 'משימה לא נמצאה' }, { status: 404 })
    }

    const task = taskRes.data
    const brief = briefRes.data?.content_json as unknown as ProductBrief | null
    const prd = prdRes.data?.content_json as unknown as PRD | null
    const arch = archRes.data?.content_json as unknown as Architecture | null

    // Build context for mission generation
    const missionContext = {
      productName: brief?.product_name ?? 'Unknown Product',
      oneLiner: brief?.one_liner ?? '',
      stack: arch?.recommended_stack ?? [],
      prdOverview: prd?.overview ?? '',
      architectureNotes: arch
        ? `Stack: ${arch.recommended_stack.join(', ')}. ${arch.why_this_stack}`
        : '',
      builtSoFar: buildBuiltSoFar(task.phase ?? ''),
    }

    const taskInput = {
      title: task.title,
      description: task.description ?? '',
      phase: task.phase ?? '',
      recommended_tool: task.recommended_tool ?? 'Claude Code',
      acceptance_criteria: Array.isArray(task.acceptance_criteria)
        ? (task.acceptance_criteria as string[])
        : [],
    }

    // Generate mission brief
    const mission = await generateMissionBrief(taskInput, missionContext)
    const markdown = missionToMarkdown(mission)

    // Check if a mission for this task already exists
    const { data: existingMission } = await supabase
      .from('missions')
      .select('id')
      .eq('project_id', projectId)
      .eq('task_id', taskId)
      .maybeSingle()

    let missionId: string

    if (existingMission) {
      // Update existing
      const { error } = await supabase
        .from('missions')
        .update({
          tool_name: mission.tool_name,
          mission_brief: markdown,
          return_prompt: mission.return_prompt,
          status: 'ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingMission.id)
      if (error) console.error('Mission update error:', error)
      missionId = existingMission.id
    } else {
      // Insert new
      const { data: newMission, error } = await supabase
        .from('missions')
        .insert({
          project_id: projectId,
          task_id: taskId,
          tool_name: mission.tool_name,
          mission_brief: markdown,
          return_prompt: mission.return_prompt,
          status: 'ready',
        })
        .select('id')
        .single()
      if (error || !newMission) {
        console.error('Mission insert error:', error)
        return NextResponse.json({ error: 'שגיאה בשמירת המשימה' }, { status: 500 })
      }
      missionId = newMission.id
    }

    // Update project stage to mission_ready
    await supabase
      .from('projects')
      .update({ current_stage: 'mission_ready', updated_at: new Date().toISOString() })
      .eq('id', projectId)

    return NextResponse.json({ mission, missionId, markdown })
  } catch (err) {
    console.error('generate-mission error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'שגיאה לא ידועה' },
      { status: 500 }
    )
  }
}

// Helper: describe what's likely been built based on phase name
function buildBuiltSoFar(phase: string): string {
  const lower = phase.toLowerCase()
  if (lower.includes('1') || lower.includes('foundation') || lower.includes('setup')) {
    return 'Project scaffolding and setup (not yet started for this task)'
  }
  if (lower.includes('2') || lower.includes('core')) {
    return 'Foundation/setup phase completed. Core features are in progress.'
  }
  if (lower.includes('3') || lower.includes('polish') || lower.includes('deploy')) {
    return 'Foundation and core features completed. Now polishing and deploying.'
  }
  return 'Some prior tasks in earlier phases may be complete — see project context.'
}
