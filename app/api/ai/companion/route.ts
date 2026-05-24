import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"
import { buildProjectContext } from "@/lib/ai/companion/context"
import { buildCompanionSystem } from "@/lib/ai/companion/prompts"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages, projectId } = await req.json()

  const projectContext = projectId
    ? await buildProjectContext(projectId, supabase)
    : ""

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: buildCompanionSystem(projectContext),
    messages,
  })

  return result.toTextStreamResponse()
}
