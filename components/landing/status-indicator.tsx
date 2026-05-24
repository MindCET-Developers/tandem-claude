"use client";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning";
  label: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const cfg = {
    online:  { dot: "bg-emerald-400", text: "text-emerald-400/80", border: "border-emerald-400/15", bg: "bg-emerald-400/5" },
    offline: { dot: "bg-red-400",     text: "text-red-400/80",     border: "border-red-400/15",     bg: "bg-red-400/5"     },
    warning: { dot: "bg-amber-400",   text: "text-amber-400/80",   border: "border-amber-400/15",   bg: "bg-amber-400/5"   },
  }[status];

  return (
    <div className={`hidden items-center gap-2 rounded-full border ${cfg.border} ${cfg.bg} px-3 py-1.5 md:flex`}>
      <span className="relative flex h-1.5 w-1.5">
        {status === "online" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      </span>
      <span className={`font-mono text-[10px] tracking-[0.15em] uppercase ${cfg.text}`}>{label}</span>
    </div>
  );
}
