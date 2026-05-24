import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Layers,
  ListChecks,
  Compass,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { STAGE_LABELS_HE, type ProjectStage } from '@/types'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/app/projects/${projectId}`)

  // Fetch project + related counts in parallel (RLS enforces ownership)
  const [projectRes, artifactCount, decisionCount, taskCount, riskCount] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).single(),
    supabase.from('artifacts').select('*', { count: 'exact', head: true }).eq('project_id', projectId),
    supabase.from('decisions').select('*', { count: 'exact', head: true }).eq('project_id', projectId).eq('status', 'active'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('project_id', projectId),
    supabase.from('risks').select('*', { count: 'exact', head: true }).eq('project_id', projectId).eq('status', 'open'),
  ])

  if (projectRes.error || !projectRes.data) {
    notFound()
  }

  const project = projectRes.data
  const stageLabel = STAGE_LABELS_HE[project.current_stage as ProjectStage] ?? project.current_stage

  // Compute next action based on current stage
  const nextAction = computeNextAction(project.current_stage as ProjectStage, projectId)

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/app/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← חזרה לפרויקטים
        </Link>
      </div>

      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{project.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {stageLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            נוצר: {new Date(project.created_at).toLocaleDateString('he-IL')}
          </span>
        </div>
      </div>

      {/* Next action — primary CTA */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">הצעד הבא</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{nextAction.description}</p>
            <Button asChild>
              <Link href={nextAction.href}>
                {nextAction.label}
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="Artifacts"
          value={artifactCount.count ?? 0}
          href={`/app/projects/${projectId}/brief`}
        />
        <StatCard
          icon={GitBranch}
          label="Decisions"
          value={decisionCount.count ?? 0}
          href={`/app/projects/${projectId}/decisions`}
        />
        <StatCard
          icon={ListChecks}
          label="Tasks"
          value={taskCount.count ?? 0}
          href={`/app/projects/${projectId}/tasks`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Open Risks"
          value={riskCount.count ?? 0}
          href={`/app/projects/${projectId}/risks`}
          highlight={(riskCount.count ?? 0) > 0}
        />
      </div>

      {/* Section grid — quick links to project areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionLink
          icon={FileText}
          title="Product Brief"
          description="תדריך מוצר — הרעיון, קהל יעד, היקף MVP"
          href={`/app/projects/${projectId}/brief`}
        />
        <SectionLink
          icon={Layers}
          title="PRD + Architecture"
          description="מסמך מוצר מלא + תכנון ארכיטקטוני"
          href={`/app/projects/${projectId}/prd`}
        />
        <SectionLink
          icon={ListChecks}
          title="Tasks"
          description="רשימת משימות בנייה, מסודרת לפי שלבים"
          href={`/app/projects/${projectId}/tasks`}
        />
        <SectionLink
          icon={Compass}
          title="Missions"
          description="תדריכי משימה מוכנים להעתקה לכלים חיצוניים"
          href={`/app/projects/${projectId}/missions`}
        />
        <SectionLink
          icon={RotateCcw}
          title="Return Brief"
          description="הדבק סיכום מכלי AI — ניתוח אוטומטי של התקדמות"
          href={`/app/projects/${projectId}/return`}
        />
        <SectionLink
          icon={GitBranch}
          title="Decisions"
          description="יומן החלטות ארכיטקטוניות ומוצריות"
          href={`/app/projects/${projectId}/decisions`}
        />
        <SectionLink
          icon={AlertTriangle}
          title="Risks"
          description="רגיסטר סיכונים — פתוחים וסגורים"
          href={`/app/projects/${projectId}/risks`}
        />
        <SectionLink
          icon={BookOpen}
          title="Living Docs"
          description="ייצוא Markdown — כל התיעוד בקליק"
          href={`/app/projects/${projectId}/docs`}
        />
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  href: string
  highlight?: boolean
}) {
  return (
    <Link href={href}>
      <Card className={`hover:border-primary/50 transition-colors ${highlight ? 'border-destructive/40 bg-destructive/5' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`h-4 w-4 ${highlight ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SectionLink({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base flex items-center justify-between">
                {title}
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

function computeNextAction(stage: ProjectStage, projectId: string) {
  switch (stage) {
    case 'idea_capture':
    case 'clarification':
      return {
        label: 'צור תדריך מוצר',
        description: 'הרעיון מעוצב — עכשיו AI יעזור להפוך אותו לתדריך מוצר מובנה',
        href: `/app/projects/new`,
      }
    case 'product_brief_draft':
      return {
        label: 'סקור תדריך',
        description: 'תדריך טיוטה מוכן. סקור ואשר כדי לעבור ל-PRD',
        href: `/app/projects/${projectId}/brief`,
      }
    case 'product_brief_approved':
    case 'prd_draft':
      return {
        label: 'צור PRD',
        description: 'תדריך מאושר ✓. הצעד הבא: PRD מפורט מ-AI',
        href: `/app/projects/${projectId}/prd`,
      }
    case 'prd_approved':
    case 'architecture_draft':
      return {
        label: 'תכנן ארכיטקטורה',
        description: 'PRD מאושר ✓. הצעד הבא: תכנון ארכיטקטוני וקבלת החלטות',
        href: `/app/projects/${projectId}/architecture`,
      }
    case 'architecture_approved':
    case 'task_plan_draft':
      return {
        label: 'צור תוכנית משימות',
        description: 'ארכיטקטורה מאושרת ✓. עכשיו: פירוק למשימות בנייה',
        href: `/app/projects/${projectId}/tasks`,
      }
    case 'task_plan_approved':
    case 'mission_ready':
      return {
        label: 'שלח Mission Brief',
        description: 'המשימות מוכנות ✓. בחר משימה וייצר Mission Brief לכלי AI',
        href: `/app/projects/${projectId}/missions`,
      }
    case 'mission_sent':
      return {
        label: 'הזן Return Brief',
        description: 'משימה נשלחה ✓. אחרי שהכלי יסיים — הדבק את הסיכום כאן',
        href: `/app/projects/${projectId}/return`,
      }
    case 'return_received':
    case 'return_reviewed':
      return {
        label: 'המשך לאיטרציה הבאה',
        description: 'סיכום נותח ✓. בחר את המשימה הבאה',
        href: `/app/projects/${projectId}/tasks`,
      }
    default:
      return {
        label: 'המשך עבודה',
        description: `שלב נוכחי: ${STAGE_LABELS_HE[stage] ?? stage}`,
        href: `/app/projects/${projectId}/tasks`,
      }
  }
}
