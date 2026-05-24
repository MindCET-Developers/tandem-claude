import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DecisionCard } from '@/components/decisions/DecisionCard'
import { GitBranch } from 'lucide-react'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function DecisionsPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/app/projects/${projectId}/decisions`)

  const [projectRes, decisionsRes] = await Promise.all([
    supabase.from('projects').select('name').eq('id', projectId).single(),
    supabase
      .from('decisions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
  ])

  if (!projectRes.data) notFound()

  const project = projectRes.data
  const decisions = decisionsRes.data ?? []
  const activeCount = decisions.filter((d) => d.status === 'active').length

  // Group by category
  const categories = [...new Set(decisions.map((d) => d.category))]

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/app/projects/${projectId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← חזרה ל-{project.name}
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">יומן החלטות</h1>
            <p className="text-sm text-muted-foreground">
              {activeCount} החלטות פעילות מתוך {decisions.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat} ({decisions.filter((d) => d.category === cat).length})
            </Badge>
          ))}
        </div>
      </div>

      {decisions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <GitBranch className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              עדיין אין החלטות — הן יווצרו אוטומטית כשתייצר ארכיטקטורה
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <DecisionCard
              key={d.id}
              title={d.title}
              decision={d.decision}
              rationale={d.rationale}
              category={d.category}
              status={d.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}
