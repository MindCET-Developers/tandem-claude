import Link from 'next/link'
import { ProjectWizard } from '@/components/wizard/ProjectWizard'

export const metadata = {
  title: 'פרויקט חדש — Tandem',
}

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/app/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← חזרה לפרויקטים
        </Link>
      </div>

      <ProjectWizard />
    </div>
  )
}
