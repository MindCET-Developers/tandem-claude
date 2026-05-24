"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

const terminalLines = [
  { type: "comment", text: "# Initialize Tandem for your project" },
  { type: "command", text: "tandem init --project \"SaaS Dashboard\"" },
  { type: "output", text: "" },
  { type: "output", text: "◆ Analyzing project requirements..." },
  { type: "output", text: "◆ Generating PRD from description..." },
  { type: "output", text: "◆ Creating SPSD (System Prompt Spec Doc)..." },
  { type: "output", text: "◆ Building decision tree structure..." },
  { type: "output", text: "" },
  { type: "success", text: "✓ Mission Brief generated successfully" },
  { type: "output", text: "" },
  { type: "info", text: "  Created: .tandem/mission-brief.md" },
  { type: "info", text: "  Created: .tandem/decisions.json" },
  { type: "info", text: "  Created: .tandem/context.yaml" },
  { type: "output", text: "" },
  { type: "command", text: "tandem brief --output" },
  { type: "output", text: "" },
  { type: "highlight", text: "┌─────────────────────────────────────────────┐" },
  { type: "highlight", text: "│  MISSION BRIEF: SaaS Dashboard              │" },
  { type: "highlight", text: "├─────────────────────────────────────────────┤" },
  { type: "output",   text: "│  Stack: Next.js 15, TypeScript, Tailwind    │" },
  { type: "output",   text: "│  Database: PostgreSQL + Prisma              │" },
  { type: "output",   text: "│  Auth: Supabase Auth                        │" },
  { type: "output",   text: "│  State: Zustand + React Query               │" },
  { type: "highlight", text: "└─────────────────────────────────────────────┘" },
  { type: "output", text: "" },
  { type: "success", text: "Ready for AI-assisted development." },
];

const lineDelay: Record<string, number> = {
  command: 300,
  success: 200,
  highlight: 60,
  output: 80,
  comment: 40,
  info: 60,
};

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) return prev;
        const delay = lineDelay[terminalLines[prev]?.type ?? "output"] ?? 80;
        timeout = setTimeout(tick, delay);
        return prev + 1;
      });
    };
    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, []);

  const getLineStyle = (type: string): string => {
    switch (type) {
      case "comment":   return "text-white/25";
      case "command":   return "text-[oklch(0.75_0.15_195)]";
      case "success":   return "text-emerald-400";
      case "info":      return "text-white/40";
      case "highlight": return "text-[oklch(0.78_0.14_75)]";
      default:          return "text-white/60";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('tandem init --project "SaaS Dashboard"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[oklch(0.09_0.012_260)] shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
        <div className="flex items-center gap-4">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          {/* Title */}
          <span className="font-mono text-[11px] tracking-wider text-white/25">tandem — zsh</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1 font-mono text-[10px] text-white/30 transition-all hover:border-white/[0.12] hover:text-white/60"
        >
          {copied ? (
            <><Check className="h-3 w-3" />Copied</>
          ) : (
            <><Copy className="h-3 w-3" />Copy</>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="h-[380px] overflow-auto p-5 font-mono text-[13px] leading-relaxed">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={getLineStyle(line.type)}>
            {line.type === "command" && (
              <span className="mr-2 text-emerald-400/70">❯</span>
            )}
            {line.text || " "}
          </div>
        ))}
        {visibleLines < terminalLines.length && (
          <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-[blink_1s_step-end_infinite] bg-[oklch(0.75_0.15_195)]" />
        )}
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[oklch(0.09_0.012_260)] to-transparent" />
    </div>
  );
}
