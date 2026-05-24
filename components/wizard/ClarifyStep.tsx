'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lightbulb, HelpCircle, Sparkles } from 'lucide-react'
import type { ClarificationQuestions } from '@/lib/ai/schemas'

interface Props {
  clarification: ClarificationQuestions
  onNext: (answers: Record<string, string>) => Promise<void>
  onBack: () => void
  loading: boolean
}

export function ClarifyStep({ clarification, onNext, onBack, loading }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit() {
    onNext(answers)
  }

  return (
    <div className="space-y-6">
      {/* Suggested direction */}
      {clarification.suggested_direction && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">כיוון מוצע: </span>
            {clarification.suggested_direction}
          </AlertDescription>
        </Alert>
      )}

      {/* Assumptions */}
      {clarification.assumptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">הנחות שכבר אני מניח:</p>
          <div className="flex flex-wrap gap-2">
            {clarification.assumptions.map((a, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">
            ענה על השאלות שרלוונטיות לך — אפשר לדלג על שאלות ולא לענות
          </p>
        </div>

        {clarification.questions.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            <Label htmlFor={`q-${q.id}`}>
              <span className="font-medium">
                {idx + 1}. {q.question}
              </span>
            </Label>
            <p className="text-xs text-muted-foreground">{q.why}</p>
            <Textarea
              id={`q-${q.id}`}
              rows={2}
              maxLength={500}
              placeholder="תשובה (אופציונלי)..."
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          חזרה
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              מייצר Product Brief...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 h-4 w-4" />
              צור Product Brief
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
