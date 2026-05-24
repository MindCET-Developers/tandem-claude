'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('הסיסמאות אינן תואמות')
      return
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להיות לפחות 6 תווים')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/app'), 2000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה'
      setError(
        msg.includes('same password')
          ? 'הסיסמה החדשה חייבת להיות שונה מהנוכחית'
          : msg
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <CardTitle>סיסמה חדשה</CardTitle>
        </div>
        <CardDescription>הזן סיסמה חדשה לחשבונך</CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-400">
              הסיסמה עודכנה בהצלחה! מעביר אותך לאפליקציה...
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה חדשה</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">אישור סיסמה</Label>
              <Input
                id="confirm"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="הזן שוב את הסיסמה"
                dir="ltr"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  מעדכן סיסמה...
                </>
              ) : (
                'עדכן סיסמה'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
