"use client";

import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "active" | "monitoring" | "standby";
  index?: number;
}

const statusConfig = {
  active: { label: "ACTIVE", dot: "bg-emerald-400", ring: "border-emerald-400/40", text: "text-emerald-400" },
  monitoring: { label: "WATCH", dot: "bg-amber-400", ring: "border-amber-400/40", text: "text-amber-400" },
  standby: { label: "IDLE", dot: "bg-zinc-500", ring: "border-zinc-500/40", text: "text-zinc-500" },
};

export function FeatureCard({ icon: Icon, title, description, status, index = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const cfg = statusConfig[status];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight((s) => ({ ...s, opacity: 0 }))}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[oklch(0.11_0.012_260)] p-px transition-all duration-500 hover:border-white/[0.12]"
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, oklch(0.75 0.15 195 / 0.06), transparent 70%)`,
        }}
      />

      {/* Inner card */}
      <div className="relative h-full rounded-2xl p-6">
        {/* Top row: coord + status */}
        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/20">
            SYS·{String(index + 1).padStart(2, "0")}
          </span>
          <span className={`flex items-center gap-1.5 font-mono text-[10px] tracking-widest ${cfg.text}`}>
            <span className={`relative flex h-1.5 w-1.5`}>
              {status === "active" && (
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-75`} />
              )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            </span>
            {cfg.label}
          </span>
        </div>

        {/* Icon block */}
        <div className="mb-5 inline-flex">
          <div className="relative flex h-11 w-11 items-center justify-center">
            {/* Angular bracket decoration */}
            <div className="absolute inset-0">
              <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/20 transition-colors duration-300 group-hover:border-[oklch(0.75_0.15_195/0.6)]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/20 transition-colors duration-300 group-hover:border-[oklch(0.75_0.15_195/0.6)]" />
            </div>
            <Icon className="h-5 w-5 text-white/50 transition-colors duration-300 group-hover:text-[oklch(0.75_0.15_195)]" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold tracking-tight text-white/90">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/40">{description}</p>

        {/* Bottom accent line */}
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:via-[oklch(0.75_0.15_195/0.3)]" />
      </div>
    </div>
  );
}
