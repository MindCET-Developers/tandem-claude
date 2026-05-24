"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CompanionActionCardProps {
  title: string
  platform?: string
  content: string
  className?: string
}

export function CompanionActionCard({ title, platform, content, className }: CompanionActionCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-lg border border-primary/30 bg-primary/5 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">{title}</span>
          {platform && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">
              {platform}
            </Badge>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="px-3 py-2 text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
        {content}
      </pre>
    </div>
  )
}
