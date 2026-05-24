'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { IdeaStep, type IdeaData } from './IdeaStep'
import { ClarifyStep } from './ClarifyStep'
import { BriefPreviewStep } from './BriefPreviewStep'
import type { ClarificationQuestions, ProductBrief } from '@/lib/ai/schemas'

// ─── Step indicator ─────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'h-2 rounded-full transition-all duration-300',
            i + 1 === current
              ? 'w-6 bg-primary'
              : i + 1 < current
                ? 'w-2 bg-primary/40'
                : 'w-2 bg-muted',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

const STEP_TITLES = [
  { title: 'הרעיון שלך', description: 'ספר לנו על הרעיון' },
  { title: 'שאלות בירור', description: 'AI מבקש פרטים נוספים' },
  { title: 'Product Brief', description: 'תצוגה מקדימה לפני אישור' },
]

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export function ProjectWizard() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data accumulated across steps
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [clarification, setClarification] = useState<ClarificationQuestions | null>(null)
  const [brief, setBrief] = useState<ProductBrief | null>(null)

  // ── Step 1: Create/update project + get clarification questions ──────────────
  async function handleIdeaNext(data: IdeaData) {
    setError(null)
    setLoading(true)
    setIdeaData(data)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('משתמש לא מחובר')

      let pid = projectId

      if (pid) {
        // Coming back from step 2 — UPDATE the existing project instead of inserting a duplicate
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            name: data.name.trim(),
            description: data.description.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pid)
        if (updateError) throw updateError
      } else {
        // First time through — INSERT
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: data.name.trim(),
            description: data.description.trim() || null,
            current_stage: 'idea_capture',
            status: 'active',
          })
          .select('id')
          .single()

        if (projectError) throw projectError
        if (!project) throw new Error('יצירת הפרויקט נכשלה')
        pid = project.id
        setProjectId(pid)
      }

      // Generate clarification questions
      const res = await fetch('/api/ai/generate-clarification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'שגיאה בייצור שאלות')
      }

      const questions: ClarificationQuestions = await res.json()
      setClarification(questions)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Generate the Product Brief ─────────────────────────────────────
  async function handleClarifyNext(answers: Record<string, string>) {
    // Guard: these should always be set by the time step 2 renders
    if (!projectId || !ideaData || !clarification) {
      setError('חסר מידע — נסה להתחיל מחדש')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          idea: ideaData,
          questions: clarification.questions,
          answers,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'שגיאה בייצור ה-Brief')
      }

      const { brief: generatedBrief } = await res.json()
      setBrief(generatedBrief)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Approve brief → redirect to project ────────────────────────────
  async function handleApprove() {
    if (!projectId) {
      setError('לא נמצא מזהה פרויקט — נסה שוב')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Both updates in parallel — atomic enough for Phase 2
      await Promise.all([
        supabase
          .from('artifacts')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('project_id', projectId)
          .eq('type', 'product_brief'),
        supabase
          .from('projects')
          .update({ current_stage: 'product_brief_approved', updated_at: new Date().toISOString() })
          .eq('id', projectId),
      ])

      router.push(`/app/projects/${projectId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת האישור')
      setLoading(false)
    }
  }

  const { title, description } = STEP_TITLES[step - 1]

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <StepDots current={step} total={3} />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <IdeaStep
            defaultValues={ideaData ?? undefined}
            onNext={handleIdeaNext}
            loading={loading}
          />
        )}

        {step === 2 && clarification && (
          <ClarifyStep
            clarification={clarification}
            onNext={handleClarifyNext}
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 3 && brief && (
          <BriefPreviewStep
            brief={brief}
            onApprove={handleApprove}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  )
}
