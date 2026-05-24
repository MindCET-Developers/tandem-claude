'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'

export interface IdeaData {
  name: string
  description: string
  targetUsers: string
  problem: string
  platform: string
  constraints: string
}

interface Props {
  defaultValues?: Partial<IdeaData>   // ← restored when coming back from step 2
  onNext: (data: IdeaData) => Promise<void>
  loading: boolean
}

export function IdeaStep({ defaultValues, onNext, loading }: Props) {
  const [form, setForm] = useState<IdeaData>({
    name: defaultValues?.name ?? '',
    description: defaultValues?.description ?? '',
    targetUsers: defaultValues?.targetUsers ?? '',
    problem: defaultValues?.problem ?? '',
    platform: defaultValues?.platform ?? '',
    constraints: defaultValues?.constraints ?? '',
  })

  function set(field: keyof IdeaData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onNext(form)
  }

  const canContinue =
    form.name.trim() && form.description.trim() && form.targetUsers.trim() && form.problem.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          שם הפרויקט <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          required
          autoFocus
          maxLength={100}
          placeholder="למשל: Tandem, LernBot, OfferFlow..."
          value={form.name}
          onChange={set('name')}
        />
      </div>

      {/* Idea description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          תאר את הרעיון <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          required
          rows={4}
          maxLength={1000}
          placeholder="מה הרעיון? מה המוצר עושה? איך זה עובד בגדול?"
          value={form.description}
          onChange={set('description')}
        />
        <p className="text-xs text-muted-foreground">{form.description.length}/1000</p>
      </div>

      {/* Target users */}
      <div className="space-y-2">
        <Label htmlFor="targetUsers">
          מי קהל היעד? <span className="text-destructive">*</span>
        </Label>
        <Input
          id="targetUsers"
          required
          maxLength={200}
          placeholder="למשל: מפתחים עצמאיים, מנהלי מוצר, בעלי עסקים קטנים..."
          value={form.targetUsers}
          onChange={set('targetUsers')}
        />
      </div>

      {/* Problem */}
      <div className="space-y-2">
        <Label htmlFor="problem">
          איזה בעיה אתה פותר? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="problem"
          required
          rows={3}
          maxLength={500}
          placeholder="מה הכאב שקהל היעד חווה היום? למה הפתרונות הקיימים לא מספיקים?"
          value={form.problem}
          onChange={set('problem')}
        />
      </div>

      {/* Optional fields */}
      <details className="group" open={!!(defaultValues?.platform || defaultValues?.constraints)}>
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors select-none">
          פרטים נוספים (אופציונלי)
        </summary>
        <div className="mt-4 space-y-4 border-r-2 border-muted pr-4">
          <div className="space-y-2">
            <Label htmlFor="platform">פלטפורמה / סטאק מועדף</Label>
            <Input
              id="platform"
              maxLength={200}
              placeholder="למשל: Next.js + Supabase, React Native, web-only..."
              value={form.platform}
              onChange={set('platform')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">אילוצים</Label>
            <Input
              id="constraints"
              maxLength={300}
              placeholder="תקציב, לוח זמנים, פיצ'רים חייבים להיות..."
              value={form.constraints}
              onChange={set('constraints')}
            />
          </div>
        </div>
      </details>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={!canContinue || loading}>
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              מייצר שאלות בירור...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 h-4 w-4" />
              המשך לשאלות AI
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
