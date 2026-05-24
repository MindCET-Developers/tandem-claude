"use client";

import { motion } from "framer-motion";
import {
  Compass,
  FileText,
  GitBranch,
  AlertTriangle,
  Database,
  Zap,
  ArrowRight,
  Terminal,
  Layers,
  Target,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/landing/status-indicator";
import { FeatureCard } from "@/components/landing/feature-card";
import { WorkflowStep } from "@/components/landing/workflow-step";
import { TerminalDemo } from "@/components/landing/terminal-demo";
import { GridBackground } from "@/components/landing/grid-background";

const features = [
  {
    icon: FileText,
    title: "Mission Briefs",
    description: "AI-optimized context documents that give your coding assistant everything it needs. No more re-explaining your project.",
    status: "active" as const,
  },
  {
    icon: GitBranch,
    title: "Decision Memory",
    description: "Every architectural choice logged with reasoning. Your AI remembers why you chose PostgreSQL over MongoDB.",
    status: "active" as const,
  },
  {
    icon: AlertTriangle,
    title: "Drift Detection",
    description: "Real-time monitoring catches when your AI veers off course. Get alerts before small mistakes become big rewrites.",
    status: "monitoring" as const,
  },
  {
    icon: Database,
    title: "Project Memory",
    description: "Persistent context that survives session boundaries. Your project state is always preserved and accessible.",
    status: "active" as const,
  },
  {
    icon: Compass,
    title: "Guided Workflows",
    description: "Step-by-step pathways for common product tasks. From PRD to deployment, never miss critical steps.",
    status: "active" as const,
  },
  {
    icon: Layers,
    title: "Return Briefs",
    description: "Structured summaries of what changed and why. Perfect context restoration for every session.",
    status: "active" as const,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Define Your Mission",
    description: "Input your product idea. Tandem generates comprehensive PRD, SPSD, and technical specifications.",
  },
  {
    step: "02",
    title: "Launch Mission Brief",
    description: "Get an AI-optimized context document with architecture, constraints, and implementation strategy.",
  },
  {
    step: "03",
    title: "Build with Confidence",
    description: "Use your favorite AI tools. Tandem monitors progress and catches drift in real-time.",
  },
  {
    step: "04",
    title: "Review & Iterate",
    description: "Return briefs summarize changes. Decision logs capture learnings. Continuous improvement.",
  },
];

const stats = [
  { value: "73%", label: "Less context re-entry" },
  { value: "4.2×", label: "Faster iteration" },
  { value: "89%", label: "Drift accuracy" },
  { value: "<2m", label: "Brief generation" },
];

// framer-motion v12: ease must be a tuple, not an array
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: EASE },
});

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.07_0.01_260)]">
      <GridBackground />

      {/* ── Nav ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.05] bg-[oklch(0.07_0.01_260/0.85)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[oklch(0.75_0.15_195/0.25)] bg-[oklch(0.75_0.15_195/0.08)]">
              <Target className="h-3.5 w-3.5 text-[oklch(0.75_0.15_195)]" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/90">Tandem</span>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {["Features", "Workflow", "Demo"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs tracking-wide text-white/40 transition-colors hover:text-white/70"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <StatusIndicator status="online" label="Systems Online" />
            <Button size="sm" className="h-8 rounded-lg border border-[oklch(0.75_0.15_195/0.3)] bg-[oklch(0.75_0.15_195/0.12)] px-4 text-xs font-medium text-[oklch(0.85_0.12_195)] shadow-none hover:bg-[oklch(0.75_0.15_195/0.2)]">
              Request Access
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Beta badge */}
            <motion.div {...fadeUp(0)} className="mb-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] tracking-wider text-white/40">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                PRIVATE BETA · NOW OPEN
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.07)}
              className="mx-auto max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight"
            >
              <span className="block text-white/90">The Control Tower for</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, oklch(0.85 0.12 195) 0%, oklch(0.75 0.15 195) 50%, oklch(0.65 0.18 215) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI-Assisted Building
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              {...fadeUp(0.14)}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/40"
            >
              Stop re-explaining your project to AI. Tandem gives you mission briefs,
              decision memory, and drift detection — so you ship products, not prompts.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.2)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/app">
                <Button className="group h-10 rounded-xl border border-[oklch(0.75_0.15_195/0.35)] bg-[oklch(0.75_0.15_195/0.14)] px-5 text-sm font-medium text-[oklch(0.88_0.1_195)] shadow-none transition-all hover:bg-[oklch(0.75_0.15_195/0.24)] hover:border-[oklch(0.75_0.15_195/0.5)]">
                  Start Building
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="h-10 rounded-xl border border-white/[0.06] px-5 text-sm font-medium text-white/40 shadow-none hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white/60"
              >
                <Terminal className="mr-1.5 h-3.5 w-3.5" />
                View Demo
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.28)}
              className="mt-16 grid w-full max-w-xl grid-cols-4 divide-x divide-white/[0.05] rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-5 text-center">
                  <div className="font-mono text-xl font-bold text-white/80">{s.value}</div>
                  <div className="mt-1 text-[10px] leading-snug tracking-wide text-white/30">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Terminal Demo ── */}
      <section id="demo" className="relative py-16">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div {...fadeUpView()}>
            <TerminalDemo />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUpView()} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/30">
              <Zap className="h-3 w-3 text-[oklch(0.78_0.14_75)]" />
              CORE SYSTEMS
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white/85 md:text-4xl">
              Everything You Need to Ship
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/35">
              Six integrated systems that transform chaotic AI coding into structured product development.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div key={feature.title} {...fadeUpView(i * 0.06)}>
                <FeatureCard {...feature} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUpView()} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/30">
              <GitBranch className="h-3 w-3 text-[oklch(0.75_0.15_195)]" />
              MISSION PROTOCOL
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white/85 md:text-4xl">
              From Idea to Production
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/35">
              A structured workflow that keeps your AI assistant aligned with your vision at every step.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, i) => (
              <motion.div key={step.step} {...fadeUpView(i * 0.08)}>
                <WorkflowStep {...step} isLast={i === workflowSteps.length - 1} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Problem */}
            <motion.div
              {...fadeUpView()}
              className="relative overflow-hidden rounded-2xl border border-red-500/[0.08] bg-red-500/[0.03] p-8"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/5 blur-3xl" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/5 px-3 py-1.5 font-mono text-[10px] tracking-widest text-red-400/70">
                <AlertTriangle className="h-3 w-3" />
                THE PROBLEM
              </div>
              <h3 className="mb-5 text-xl font-bold text-white/80">Vibe Coding Without a Map</h3>
              <ul className="space-y-3.5">
                {[
                  "Every session starts with re-explaining your entire project",
                  "AI forgets your architecture decisions and makes conflicting choices",
                  "Subtle drift compounds into massive rewrites",
                  "No structured way to capture what works and what doesn't",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/35">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-red-400/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              {...fadeUpView(0.08)}
              className="relative overflow-hidden rounded-2xl border border-[oklch(0.75_0.15_195/0.1)] bg-[oklch(0.75_0.15_195/0.04)] p-8"
            >
              <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[oklch(0.75_0.15_195/0.06)] blur-3xl" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(0.75_0.15_195/0.2)] bg-[oklch(0.75_0.15_195/0.07)] px-3 py-1.5 font-mono text-[10px] tracking-widest text-[oklch(0.75_0.15_195/0.8)]">
                <CheckCircle2 className="h-3 w-3" />
                THE SOLUTION
              </div>
              <h3 className="mb-5 text-xl font-bold text-white/80">Guided Vibe Coding</h3>
              <ul className="space-y-3.5">
                {[
                  "Mission briefs give AI complete context in seconds",
                  "Decision logs preserve and enforce architectural choices",
                  "Real-time drift detection catches problems early",
                  "Return briefs restore full context after any break",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/35">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[oklch(0.75_0.15_195/0.5)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            {...fadeUpView()}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center"
          >
            {/* Dot grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `radial-gradient(circle, oklch(0.35 0.02 260 / 0.4) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            {/* Glow */}
            <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[oklch(0.75_0.15_195/0.08)] blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white/85 md:text-4xl">
                Ready for Liftoff?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/35">
                Join the private beta and transform how you build with AI.
                Limited spots available for early builders.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button className="group h-10 rounded-xl border border-[oklch(0.75_0.15_195/0.35)] bg-[oklch(0.75_0.15_195/0.14)] px-6 text-sm font-medium text-[oklch(0.88_0.1_195)] shadow-none transition-all hover:bg-[oklch(0.75_0.15_195/0.24)]">
                  Request Beta Access
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
              <p className="mt-5 font-mono text-[11px] tracking-wider text-white/20">
                NO CREDIT CARD · FOUNDERS &amp; INDIE HACKERS ONLY
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[oklch(0.75_0.15_195/0.2)] bg-[oklch(0.75_0.15_195/0.07)]">
                <Target className="h-3 w-3 text-[oklch(0.75_0.15_195/0.7)]" />
              </div>
              <span className="text-xs font-semibold text-white/40">Tandem</span>
            </div>
            <p className="font-mono text-[10px] tracking-widest text-white/20">
              AI PRODUCT OS · GUIDED VIBE CODING
            </p>
            <div className="flex items-center gap-5">
              {["Twitter", "GitHub", "Discord"].map((link) => (
                <a key={link} href="#" className="text-xs text-white/25 transition-colors hover:text-white/50">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
