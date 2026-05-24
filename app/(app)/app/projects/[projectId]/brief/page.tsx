import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArtifactViewer } from '@/components/artifacts/ArtifactViewer'
import { ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function BriefPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/app/projects/${projectId}/brief`)

  const { data: artifact } = await supabase
    .from('artifacts')
    .select('*')
    .eq('project_id', projectId)
    .eq('type', 'product_brief')
    .maybeSingle()

  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single()

  if (!project) notFound()

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

      {artifact ? (
        <Card>
          <CardContent className="pt-6">
            <ArtifactViewer
              title={artifact.title}
              type={artifact.type}
              status={artifact.status}
              markdown={artifact.content_markdown ?? ''}
              version={artifact.version}
              updatedAt={artifact.updated_at}
            />

            {artifact.status === 'approved' && (
              <div className="mt-6 pt-4 border-t">
                <Button asChild>
                  <Link href={`/app/projects/${projectId}/prd`}>
                    המשך ל-PRD
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">אין Product Brief עדיין</p>
            <Button asChild>
              <Link href={`/app/projects/new`}>חזור לוויזרד ליצירת Brief</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
