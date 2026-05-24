"use client"

import { useState } from "react"
import { 
  FileText, 
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code,
  Palette,
  Database,
  ArrowRight,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const returnBriefs = [
  {
    id: "rb1",
    missionTitle: "Implement user authentication with Supabase",
    project: "SaaS Dashboard",
    tool: "Cursor",
    toolIcon: Code,
    completedAt: "2 hours ago",
    status: "completed",
    summary: "Successfully implemented Supabase authentication with email/password and OAuth providers (Google, GitHub). Added session management and protected routes.",
    artifacts: {
      filesCreated: [
        "lib/supabase/client.ts",
        "lib/supabase/server.ts",
        "app/(auth)/login/page.tsx",
        "app/(auth)/signup/page.tsx",
        "middleware.ts"
      ],
      filesModified: [
        "app/layout.tsx",
        "components/ui/button.tsx"
      ],
      dependencies: [
        "@supabase/supabase-js",
        "@supabase/ssr"
      ]
    },
    decisions: [
      {
        title: "Added OAuth in addition to magic links",
        rationale: "Better UX for users who prefer social login",
        needsReview: true
      },
      {
        title: "Used middleware for route protection",
        rationale: "More efficient than checking in each page",
        needsReview: false
      }
    ],
    completionChecklist: [
      { item: "Users can sign up with email", completed: true },
      { item: "Session persists across refreshes", completed: true },
      { item: "Protected routes redirect to login", completed: true },
      { item: "Password reset flow works", completed: false }
    ],
    notes: "OAuth was added as an enhancement beyond the original spec. Recommend updating PRD to reflect this change. Password reset flow needs additional work - created follow-up mission.",
    driftFlags: [
      "OAuth implementation differs from spec (magic links only)"
    ]
  },
  {
    id: "rb2",
    missionTitle: "Create dashboard layout components",
    project: "SaaS Dashboard",
    tool: "v0",
    toolIcon: Palette,
    completedAt: "1 day ago",
    status: "pending-review",
    summary: "Built the main dashboard shell with responsive sidebar navigation, header with user menu, and flexible content area. Supports dark mode.",
    artifacts: {
      filesCreated: [
        "components/layout/sidebar.tsx",
        "components/layout/header.tsx",
        "components/layout/dashboard-shell.tsx",
        "app/(dashboard)/layout.tsx"
      ],
      filesModified: [
        "app/globals.css",
        "tailwind.config.ts"
      ],
      dependencies: []
    },
    decisions: [
      {
        title: "Used CSS variables for theming",
        rationale: "Easier dark mode support and customization",
        needsReview: false
      }
    ],
    completionChecklist: [
      { item: "Responsive down to 320px", completed: true },
      { item: "Collapsible sidebar", completed: true },
      { item: "Breadcrumb navigation", completed: false }
    ],
    notes: "Breadcrumb navigation deferred to separate mission. All other acceptance criteria met.",
    driftFlags: []
  },
  {
    id: "rb3",
    missionTitle: "Set up database schema",
    project: "Mobile App MVP",
    tool: "Claude Code",
    toolIcon: Database,
    completedAt: "3 days ago",
    status: "completed",
    summary: "Created initial database schema with users, workouts, exercises, and progress tables. Added RLS policies and seed data.",
    artifacts: {
      filesCreated: [
        "supabase/migrations/001_initial_schema.sql",
        "supabase/migrations/002_rls_policies.sql",
        "supabase/seed.sql",
        "types/database.ts"
      ],
      filesModified: [],
      dependencies: []
    },
    decisions: [
      {
        title: "Used soft deletes for all tables",
        rationale: "Data recovery and audit trail",
        needsReview: false
      },
      {
        title: "Added composite indexes for common queries",
        rationale: "Performance optimization",
        needsReview: false
      }
    ],
    completionChecklist: [
      { item: "All tables created", completed: true },
      { item: "RLS enabled", completed: true },
      { item: "Seed data script ready", completed: true }
    ],
    notes: "Schema follows the entity relationship diagram. Types generated for TypeScript integration.",
    driftFlags: []
  },
]

export default function ReturnsPage() {
  const [selectedBrief, setSelectedBrief] = useState<typeof returnBriefs[0] | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>(["artifacts", "decisions", "checklist"])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Return Briefs</h1>
            <p className="text-sm text-muted-foreground">Results from completed AI tool sessions</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Submit Return Brief
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search return briefs..." 
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Returns</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="completed">Processed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-0">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Brief List */}
              <div className="space-y-3">
                {returnBriefs.map((brief) => (
                  <Card 
                    key={brief.id}
                    className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 ${
                      selectedBrief?.id === brief.id ? "border-primary ring-1 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedBrief(brief)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          brief.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                          "bg-amber-500/10 text-amber-500"
                        }`}>
                          <brief.toolIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm leading-snug">{brief.missionTitle}</h3>
                            {brief.driftFlags.length > 0 && (
                              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{brief.summary}</p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {brief.tool}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{brief.project}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{brief.completedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Brief Detail */}
              {selectedBrief ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24 h-fit max-h-[calc(100vh-140px)] overflow-auto">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${
                            selectedBrief.status === "completed" 
                              ? "bg-emerald-500 text-white" 
                              : "bg-amber-500 text-white"
                          }`}>
                            {selectedBrief.status === "completed" ? "Processed" : "Pending Review"}
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <selectedBrief.toolIcon className="h-3 w-3" />
                            {selectedBrief.tool}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{selectedBrief.missionTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">{selectedBrief.summary}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Drift Flags */}
                    {selectedBrief.driftFlags.length > 0 && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-500">Drift Detected</p>
                            <ul className="mt-1 space-y-1">
                              {selectedBrief.driftFlags.map((flag, i) => (
                                <li key={i} className="text-xs text-muted-foreground">{flag}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Artifacts */}
                    <Collapsible open={expandedSections.includes("artifacts")} onOpenChange={() => toggleSection("artifacts")}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
                        <span>Artifacts</span>
                        {expandedSections.includes("artifacts") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3">
                        {selectedBrief.artifacts.filesCreated.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5">Files Created</p>
                            <div className="space-y-1">
                              {selectedBrief.artifacts.filesCreated.map((file, i) => (
                                <code key={i} className="block text-xs font-mono text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded">
                                  + {file}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedBrief.artifacts.filesModified.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5">Files Modified</p>
                            <div className="space-y-1">
                              {selectedBrief.artifacts.filesModified.map((file, i) => (
                                <code key={i} className="block text-xs font-mono text-amber-500 bg-amber-500/5 px-2 py-1 rounded">
                                  ~ {file}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedBrief.artifacts.dependencies.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5">Dependencies Added</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedBrief.artifacts.dependencies.map((dep, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-mono">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Decisions */}
                    <Collapsible open={expandedSections.includes("decisions")} onOpenChange={() => toggleSection("decisions")}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
                        <span>Decisions Made</span>
                        {expandedSections.includes("decisions") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {selectedBrief.decisions.map((decision, i) => (
                          <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium">{decision.title}</p>
                              {decision.needsReview && (
                                <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/50">
                                  Needs Review
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{decision.rationale}</p>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Completion Checklist */}
                    <Collapsible open={expandedSections.includes("checklist")} onOpenChange={() => toggleSection("checklist")}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
                        <span>Acceptance Criteria</span>
                        {expandedSections.includes("checklist") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {selectedBrief.completionChecklist.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            {item.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-4 w-4 rounded border border-border/50 shrink-0 mt-0.5" />
                            )}
                            <span className={item.completed ? "text-muted-foreground" : ""}>{item.item}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Notes */}
                    {selectedBrief.notes && (
                      <div>
                        <p className="text-sm font-medium mb-2">Notes</p>
                        <p className="text-sm text-muted-foreground">{selectedBrief.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button className="flex-1 gap-2" size="sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Approve & Sync
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Mission
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Select a return brief to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="text-center py-12 text-muted-foreground">
              <p>Pending review briefs will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-12 text-muted-foreground">
              <p>Processed briefs will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
