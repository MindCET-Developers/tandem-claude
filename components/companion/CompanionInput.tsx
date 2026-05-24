"use client"

import { useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CompanionInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
}

export function CompanionInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "שאל שאלה, בקש פרומפט, או הדבק סיכום סשן...",
}: CompanionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) onSubmit()
    }
  }

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="min-h-[40px] max-h-32 resize-none text-sm leading-relaxed"
        disabled={isLoading}
      />
      <Button
        size="icon"
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="h-10 w-10 shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
