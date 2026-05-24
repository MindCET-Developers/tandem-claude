'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ArtifactViewer } from '@/components/artifacts/ArtifactViewer'
import { Loader2, Sparkles, ArrowRight, AlertCircle, CheckCircle2, GitBranch, AlertTriangle } from 'lucide-react'

export default function ArchitecturePage() {
  const params = useParams<{ projectId: string }>()
  const supabase = createClient()
  const projectId = params.projectId

  const [artifact, setArtifact] = useState<Record<string, unknown> | null>(null)
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedCounts, setSavedCounts] = useState<{ decisions: number; risks: number } | null>(null)
  const [hasPRD, setHasPRD] = useState(true) // optimistic default; set false if PRD missing

  useEffect(() => {
    async function load() {
      const [artRes, projRes, prdRes] = await Promise.all([
        supabase
          .from('artifacts')
          .select('*')
          .eq('project_id', projectId)
          .eq('type', 'architecture')
          .maybeSingle(),
        supabase.from('projects').select('name').eq('id', projectId).single(),
        supabase
          .from('artifacts')
          .select('id')
          .eq('project_id', projectId)
          .eq('type', 'prd')
          .eq('status', 'approved')
          .maybeSingle(),
      ])
      setArtifact(artRes.data)
      setProjectName(projRes.data?.name ?? '')
      setHasPRD(!!prdRes.data)
      setLoading(false)
    }
    load()
  }, [projectId])

  async function handleGenerate() {
    setError(null)
    setGenerating(true)
    setSavedCounts(null)
    try {
      const res = await fetch('/api/ai/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'שגיאה בייצור ארכיטקטורה')
      }
      const { architecture, artifactId, markdown, decisionsCount, risksCount } = await res.json()
      setArtifact({
        id: artifactId,
        title: `Architecture — ${projectName}`,
        type: 'architecture',
        status: 'draft',
        content_markdown: markdown,
        content_json: architecture,
        version: 1,
        updated_at: new Date().toISOString(),
      })
      setSavedCounts({ decisions: decisionsCount, risks: risksCount })
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
          .update({ current_stage: 'architecture_approved', updated_at: new Date().toISOString() })
          .eq('id', projectId),
      ])
      if (artRes.error) throw new Error(artRes.error.message)
      if (projRes.error) throw new Error(projRes.error.message)
      setArtifact({ ...artifact, status: 'approved' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה באישור הארכיטקטורה')
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

      {/* Auto-saved feedback */}
      {savedCounts && (
        <Alert className="mb-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                {savedCounts.decisions} החלטות נשמרו
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {savedCounts.risks} סיכונים נשמרו
              </span>
            </span>
          </AlertDescription>
        </Alert>
      )}

      {artifact ? (
        <Card>
          <CardContent className="pt-6">
            <ArtifactViewer
              title={artifact.title as string}
              type="architecture"
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
                    אשר ארכיטקטורה
                  </Button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href={`/app/projects/${projectId}/decisions`}>
                      <GitBranch className="ml-2 h-4 w-4" />
                      יומן החלטות
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/app/projects/${projectId}/tasks`}>
                      המשך למשימות
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Architecture — תכנון ארכיטקטוני</CardTitle>
            <CardDescription>
              AI יתכנן את הארכיטקטורה על בסיס ה-PRD — כולל stack, data model, API routes, והחלטות
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            {!hasPRD ? (
              <div className="space-y-3">
                <Alert variant="destructive" className="text-right">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>יש לאשר PRD לפני יצירת ארכיטקטורה</AlertDescription>
                </Alert>
                <Button asChild variant="outline">
                  <Link href={`/app/projects/${projectId}/prd`}>עבור ל-PRD</Link>
                </Button>
              </div>
            ) : (
              <Button onClick={handleGenerate} disabled={generating} size="lg">
                {generating ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    מייצר ארכיטקטורה...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-4 w-4" />
                    צור ארכיטקטורה מ-AI
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
