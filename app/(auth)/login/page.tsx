'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, Sparkles, KeyRound } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

type AuthScreen = 'password' | 'magic' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [screen, setScreen] = useState<AuthScreen>('password')
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  function resetState() {
    setError(null)
    setInfo(null)
  }

  function switchScreen(s: AuthScreen) {
    resetState()
    setScreen(s)
  }

  // ── Password sign-in / sign-up ──────────────────────────────────────────
  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/app` },
        })
        if (error) throw error
        setInfo('נשלח אליך מייל אישור. אשר אותו ולאחר מכן התחבר.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/app')
        router.refresh()
      }
    } catch (err) {
      setError(toHebrew(err))
    } finally {
      setLoading(false)
    }
  }

  // ── Magic link ──────────────────────────────────────────────────────────
  async function handleMagic(e: FormEvent) {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/app` },
      })
      if (error) throw error
      setInfo('נשלח אליך קישור כניסה. לחץ עליו כדי להתחבר — בלי סיסמה.')
    } catch (err) {
      setError(toHebrew(err))
    } finally {
      setLoading(false)
    }
  }

  // ── Forgot password ─────────────────────────────────────────────────────
  async function handleForgot(e: FormEvent) {
    e.preventDefault()
    resetState()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })
      if (error) throw error
      setInfo('נשלח אליך קישור לאיפוס סיסמה. בדוק את תיבת הדואר שלך.')
    } catch (err) {
      setError(toHebrew(err))
    } finally {
      setLoading(false)
    }
  }

  // ── Magic Link screen ───────────────────────────────────────────────────
  if (screen === 'magic') {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle>כניסה עם קישור קסם</CardTitle>
          </div>
          <CardDescription>נשלח לך קישור כניסה ישיר לאימייל — ללא סיסמה</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagic} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email">אימייל</Label>
              <Input
                id="magic-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {info && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400">{info}</AlertDescription>
              </Alert>
            )}

            {!info && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-4 w-4" />
                    שלח קישור כניסה
                  </>
                )}
              </Button>
            )}

            <button
              type="button"
              onClick={() => switchScreen('password')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 pt-1"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              חזרה לכניסה עם סיסמה
            </button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // ── Forgot Password screen ──────────────────────────────────────────────
  if (screen === 'forgot') {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <CardTitle>איפוס סיסמה</CardTitle>
          </div>
          <CardDescription>נשלח אליך קישור לאיפוס הסיסמה</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">אימייל</Label>
              <Input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {info && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400">{info}</AlertDescription>
              </Alert>
            )}

            {!info && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : (
                  'שלח קישור איפוס'
                )}
              </Button>
            )}

            <button
              type="button"
              onClick={() => switchScreen('password')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 pt-1"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              חזרה לכניסה
            </button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // ── Main screen (password) ──────────────────────────────────────────────
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle>ברוכים הבאים</CardTitle>
        <CardDescription>התחבר או הירשם כדי להתחיל לבנות</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => { resetState(); setTab(v as 'signin' | 'signup') }}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">כניסה</TabsTrigger>
            <TabsTrigger value="signup">הרשמה</TabsTrigger>
          </TabsList>

          <form onSubmit={handlePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => switchScreen('forgot')}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    שכחתי סיסמה
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים"
                dir="ltr"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {info && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400">{info}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {tab === 'signup' ? 'נרשם...' : 'מתחבר...'}
                </>
              ) : tab === 'signup' ? (
                'הרשמה'
              ) : (
                'כניסה'
              )}
            </Button>

            {/* Magic link divider — only on signin tab */}
            {tab === 'signin' && (
              <>
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    או
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => switchScreen('magic')}
                  disabled={loading}
                >
                  <Sparkles className="h-4 w-4" />
                  כניסה עם קישור קסם
                </Button>
              </>
            )}
          </form>

          <TabsContent value="signin" />
          <TabsContent value="signup" />
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function toHebrew(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה'
  if (msg.includes('Invalid login credentials')) return 'אימייל או סיסמה שגויים'
  if (msg.includes('already registered'))         return 'משתמש כבר רשום עם אימייל זה'
  if (msg.includes('Password should be'))         return 'הסיסמה חייבת להיות באורך של לפחות 6 תווים'
  if (msg.includes('Email rate limit'))           return 'יותר מדי בקשות — נסה שוב בעוד כמה דקות'
  if (msg.includes('User not found'))             return 'לא נמצא חשבון עם אימייל זה'
  return msg
}
