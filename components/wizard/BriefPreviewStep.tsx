'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Loader2, ChevronLeft, AlertTriangle, Target, Users, Zap } from 'lucide-react'
import type { ProductBrief } from '@/lib/ai/schemas'

interface Props {
  brief: ProductBrief
  onApprove: () => Promise<void>
  onBack: () => void
  loading: boolean
}

function Section({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  if (!items.length) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BriefPreviewStep({ brief, onApprove, onBack, loading }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold">{brief.product_name}</h2>
        <p className="text-muted-foreground">{brief.one_liner}</p>
      </div>

      <Separator />

      {/* Core sections */}
      <div className="grid gap-5">
        <Section
          title="קהל יעד"
          items={brief.target_users}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">הבעיה</h3>
          <p className="text-sm text-muted-foreground">{brief.problem}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">הפתרון</h3>
          <p className="text-sm text-muted-foreground">{brief.solution}</p>
        </div>

        <Separator />

        <Section
          title="סקופ MVP"
          items={brief.mvp_scope}
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        />

        <Section
          title="לא בסקופ MVP"
          items={brief.non_goals}
        />

        <Section
          title="קריטריוני הצלחה"
          items={brief.success_criteria}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
        />

        <Separator />

        {/* Risks */}
        {brief.risks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold">סיכונים</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {brief.risks.map((risk, i) => (
                <Badge key={i} variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Open questions */}
        {brief.open_questions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">שאלות פתוחות</h3>
            <ul className="space-y-1">
              {brief.open_questions.map((q, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  {i + 1}. {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          <ChevronLeft className="ml-1 h-4 w-4" />
          חזרה
        </Button>
        <Button onClick={onApprove} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              שומר...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              אשר Product Brief
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        לאחר האישור תועבר לדף הפרויקט — אפשר לערוך את ה-Brief שם בכל עת
      </p>
    </div>
  )
}
