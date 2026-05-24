'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArtifactViewer } from '@/components/artifacts/ArtifactViewer'
import { Loader2, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function PRDPage() {
  const params = useParams<{ projectId: string }>()
  const supabase = createClient()
  const projectId = params.projectId

  const [artifact, setArtifact] = useState<Record<string, unknown> | null>(null)
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [artRes, projRes] = await Promise.all([
        supabase
          .from('artifacts')
          .select('*')
          .eq('project_id', projectId)
          .eq('type', 'prd')
          .maybeSingle(),
        supabase.from('projects').select('name').eq('id', projectId).single(),
      ])
      setArtifact(artRes.data)
      setProjectName(projRes.data?.name ?? '')
      setLoading(false)
    }
    load()
  }, [projectId])

  async function handleGenerate() {
    setError(null)
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'שגיאה בייצור PRD')
      }
      const { prd, artifactId, markdown } = await res.json()
      setArtifact({
        id: artifactId,
        title: `PRD — ${projectName}`,
        type: 'prd',
        status: 'draft',
        content_markdown: markdown,
        content_json: prd,
        version: 1,
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה')
    } finally {
      setGenerating(false)
    }
  }

  async function handleApprove() {
    if (!artifact) return
    setApproving(true)
    setError(null)
    try {
      const [artRes, projRes] = await Promise.all([
        supabase
          .from('artifacts')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', artifact.id as string),
        supabase
          .from('projects')
          .update({ current_stage: 'prd_approved', updated_at: new Date().toISOString() })
          .eq('id', projectId),
      ])
      if (artRes.error) throw new Error(artRes.error.message)
      if (projRes.error) throw new Error(projRes.error.message)
      setArtifact({ ...artifact, status: 'approved' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה באישור ה-PRD')
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/app/projects/${projectId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← חזרה ל-{projectName}
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {artifact ? (
        <Card>
          <CardContent className="pt-6">
            <ArtifactViewer
              title={artifact.title as string}
              type="prd"
              status={artifact.status as string}
              markdown={(artifact.content_markdown as string) ?? ''}
              version={artifact.version as number}
              updatedAt={artifact.updated_at as string}
            />

            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              {artifact.status === 'draft' ? (
                <>
                  <Button variant="outline" onClick={handleGenerate} disabled={generating}>
                    {generating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                    ייצר מחדש
                  </Button>
                  <Button onClick={handleApprove} disabled={approving}>
                    {approving ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    )}
                    אשר PRD
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link href={`/app/projects/${projectId}/architecture`}>
                    המשך לארכיטקטורה
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>PRD — מסמך דרישות מוצר</CardTitle>
            <CardDescription>AI ייצר PRD מפורט מה-Product Brief המאושר שלך</CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button onClick={handleGenerate} disabled={generating} size="lg">
              {generating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  מייצר PRD...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-4 w-4" />
                  צור PRD מ-AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
