import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'התחברות — Tandem',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
            <span aria-hidden>🧭</span>
            <span>Tandem</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            בנה תוכנה עם AI — בלי לאבד את הכיוון
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
