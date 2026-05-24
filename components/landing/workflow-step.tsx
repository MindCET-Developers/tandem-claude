"use client";

interface WorkflowStepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export function WorkflowStep({ step, title, description, isLast }: WorkflowStepProps) {
  return (
    <div className="group relative flex flex-col">
      {/* Step header */}
      <div className="relative mb-4 flex items-center gap-4">
        {/* Number badge */}
        <div className="relative flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-mono text-xs font-bold tracking-widest text-white/30 transition-all duration-300 group-hover:border-[oklch(0.75_0.15_195/0.4)] group-hover:text-[oklch(0.75_0.15_195)]">
            {step}
          </div>
          {/* Pulse ring on hover */}
          <div className="absolute inset-0 rounded-full border border-[oklch(0.75_0.15_195/0)] transition-all duration-500 group-hover:scale-150 group-hover:border-[oklch(0.75_0.15_195/0.15)]" />
        </div>

        {/* Connector — hidden on last */}
        {!isLast && (
          <div className="relative h-px flex-1 overflow-hidden bg-white/[0.06]">
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[oklch(0.75_0.15_195/0.4)] to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pl-1">
        <h3 className="text-sm font-semibold tracking-tight text-white/80 transition-colors duration-200 group-hover:text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/35">{description}</p>
      </div>
    </div>
  );
}
