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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <span aria-hidden>🧭</span>
            <span>Tandem</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            בנה תוכנה עם AI — בלי לאבד את הכיוון
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
