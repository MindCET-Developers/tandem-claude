"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanionPanel } from "./CompanionPanel"

interface CompanionButtonProps {
  projectId?: string
  projectName?: string
}

export function CompanionButton({ projectId, projectName }: CompanionButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Open Tandem Companion"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>

      <CompanionPanel
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        projectName={projectName}
      />
    </>
  )
}
