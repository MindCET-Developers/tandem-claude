import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderKanban, Clock, ArrowRight, Compass } from 'lucide-react'
import { STAGE_LABELS_HE, type ProjectStage } from '@/types'

// Server Component — fetches real projects from Supabase
export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/app/projects')
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, description, current_stage, status, updated_at, created_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            {projects?.length ?? 0} פרויקטים פעילים
          </p>
        </div>
        <Button asChild>
          <Link href="/app/projects/new">
            <Plus className="ml-2 h-4 w-4" />
            פרויקט חדש
          </Link>
        </Button>
      </div>

      {/* Connection error */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5 mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              <strong>שגיאת חיבור ל-DB:</strong> {error.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              ודא שטבלת <code className="font-mono">projects</code> נוצרה ב-Supabase (הרץ את ה-migration בקובץ
              <code className="font-mono"> supabase/migrations/</code>).
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!error && (!projects || projects.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Compass className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ברוכים הבאים ל-Tandem</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              עדיין אין לך פרויקטים. צור את הפרויקט הראשון שלך — נעבור איתך משלב הרעיון
              לקוד עובד.
            </p>
            <Button asChild size="lg">
              <Link href="/app/projects/new">
                <Plus className="ml-2 h-4 w-4" />
                התחל פרויקט ראשון
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Project list */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const stageLabel =
              STAGE_LABELS_HE[project.current_stage as ProjectStage] ?? project.current_stage
            const updatedDate = new Date(project.updated_at)
            const updatedRel = formatRelativeHe(updatedDate)

            return (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className="group"
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FolderKanban className="h-4 w-4 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stageLabel}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-1">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {project.description || 'אין תיאור'}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {updatedRel}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Simple Hebrew relative-time formatter
function formatRelativeHe(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'כעת'
  if (diffMin < 60) return `לפני ${diffMin} דק'`
  if (diffHr < 24) return `לפני ${diffHr} שעות`
  if (diffDay < 7) return `לפני ${diffDay} ימים`
  return date.toLocaleDateString('he-IL')
}
