import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateClarificationQuestions } from '@/lib/ai/service'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, targetUsers, problem, platform, constraints } = body

  if (!name || !description || !targetUsers || !problem) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const result = await generateClarificationQuestions({
      name,
      description,
      targetUsers,
      problem,
      platform,
      constraints,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[generate-clarification] error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
