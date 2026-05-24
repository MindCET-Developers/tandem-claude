'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, Wrench, Target, ListChecks, AlertOctagon, Package, RotateCcw } from 'lucide-react'

interface Props {
  title: string
  tool_name: string
  context: string
  objective: string
  instructions: string[]
  constraints: string[]
  deliverables: string[]
  return_prompt: string
  acceptance_criteria: string[]
  fullMarkdown: string
}

function CopyButton({ text, label = 'העתק' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className="text-xs h-7 gap-1.5">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? 'הועתק!' : label}
    </Button>
  )
}

export function MissionBriefCard({
  title, tool_name, context, objective, instructions, constraints,
  deliverables, return_prompt, acceptance_criteria, fullMarkdown,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              {tool_name}
            </Badge>
          </div>
        </div>
        <CopyButton text={fullMarkdown} label="העתק הכל" />
      </div>

      {/* Objective */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            מטרה
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm font-medium">{objective}</p>
        </CardContent>
      </Card>

      {/* Context */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">הקשר</h3>
          <CopyButton text={context} label="העתק" />
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">{context}</div>
      </section>

      {/* Instructions */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5" /> הוראות
          </h3>
          <CopyButton text={instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')} label="העתק" />
        </div>
        <ol className="space-y-1.5">
          {instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Constraints */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5 text-red-500" /> אסור לעשות
          </h3>
        </div>
        <ul className="space-y-1">
          {constraints.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-red-700">
              <span className="shrink-0">✗</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Deliverables */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> תוצרים נדרשים
          </h3>
        </div>
        <ul className="space-y-1">
          {deliverables.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 text-green-600">→</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Acceptance Criteria */}
      <section>
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">קריטריוני קבלה</h3>
        </div>
        <ul className="space-y-1">
          {acceptance_criteria.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 text-primary">✓</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Return Prompt */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-amber-600" /> Return Prompt — הדבק אחרי המשימה
          </h3>
          <CopyButton text={return_prompt} label="העתק" />
        </div>
        <Textarea
          readOnly
          value={return_prompt}
          className="font-mono text-xs min-h-[160px] bg-muted/40 resize-none"
          dir="ltr"
        />
      </section>
    </div>
  )
}
