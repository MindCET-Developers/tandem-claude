"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { CompanionActionCard } from "./CompanionActionCard"

export type MessageRole = "user" | "assistant"

export interface ActionBlock {
  title: string
  platform?: string
  content: string
}

export interface CompanionMessageData {
  id: string
  role: MessageRole
  content: string
  actions?: ActionBlock[]
}

interface CompanionMessageProps {
  message: CompanionMessageData
}

export function CompanionMessage({ message }: CompanionMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground border border-border"
        )}
      >
        {isUser ? "U" : "T"}
      </div>

      <div className={cn("flex flex-col gap-2 max-w-[85%]", isUser && "items-end")}>
        {/* Text */}
        {message.content && (
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <MessageText content={message.content} isUser={isUser} />
          </div>
        )}

        {/* Action cards */}
        {message.actions?.map((action, i) => (
          <CompanionActionCard
            key={i}
            title={action.title}
            platform={action.platform}
            content={action.content}
            className="w-full"
          />
        ))}
      </div>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-1.5 rounded-md border border-border/60 bg-background/60 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-1 border-b border-border/40 bg-background/40">
        <span className="text-[10px] text-muted-foreground font-mono">prompt</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-2.5 w-2.5 text-emerald-500" />
              <span className="text-emerald-500">הועתק</span>
            </>
          ) : (
            <>
              <Copy className="h-2.5 w-2.5" />
              <span>העתק</span>
            </>
          )}
        </button>
      </div>
      <pre className="px-3 py-2 font-mono whitespace-pre-wrap overflow-x-auto max-h-56 overflow-y-auto leading-relaxed text-foreground/80">
        {code.trim()}
      </pre>
    </div>
  )
}

function MessageText({ content, isUser }: { content: string; isUser: boolean }) {
  // Split on fenced code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-0.5">
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          // Extract language tag (optional) and code body
          const code = part.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")
          // For user messages keep simple pre; for assistant show copy block
          if (isUser) {
            return (
              <pre key={i} className="mt-1 rounded bg-primary-foreground/10 p-2 text-xs font-mono whitespace-pre-wrap">
                {code.trim()}
              </pre>
            )
          }
          return <CodeBlock key={i} code={code} />
        }

        // Render plain text with basic markdown: **bold**, newlines
        return <InlineText key={i} text={part} />
      })}
    </div>
  )
}

function InlineText({ text }: { text: string }) {
  // Split on newlines to handle line breaks
  const lines = text.split("\n")

  return (
    <>
      {lines.map((line, li) => {
        // Split on **bold**
        const boldParts = line.split(/(\*\*[^*]+\*\*)/g)
        return (
          <span key={li}>
            {li > 0 && <br />}
            {boldParts.map((bp, bi) =>
              bp.startsWith("**") && bp.endsWith("**") ? (
                <strong key={bi} className="font-semibold">
                  {bp.slice(2, -2)}
                </strong>
              ) : (
                <span key={bi}>{bp}</span>
              )
            )}
          </span>
        )
      })}
    </>
  )
}
