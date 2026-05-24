import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  decision: string
  rationale?: string | null
  category: string
  status: string
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-800',
  product: 'bg-purple-100 text-purple-800',
  architecture: 'bg-amber-100 text-amber-800',
  design: 'bg-pink-100 text-pink-800',
  infrastructure: 'bg-green-100 text-green-800',
}

export function DecisionCard({ title, decision, rationale, category, status }: Props) {
  const catColor = CATEGORY_COLORS[category] ?? 'bg-slate-100 text-slate-700'

  return (
    <Card className={status === 'active' ? '' : 'opacity-60'}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-2 shrink-0">
            <Badge className={`text-[10px] ${catColor}`}>{category}</Badge>
            {status !== 'active' && (
              <Badge variant="outline" className="text-[10px]">{status}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{decision}</p>
        {rationale && (
          <p className="text-xs text-muted-foreground mt-2">
            <strong>נימוק:</strong> {rationale}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
