"use client"

import { useState } from "react"
import { 
  GitBranch, 
  Search, 
  Filter,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Tag,
  MessageSquare,
  Link2,
  User,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const decisions = [
  {
    id: "d1",
    title: "Use Supabase for authentication and database",
    description: "After evaluating Firebase, Auth0, and Supabase, we chose Supabase for its PostgreSQL foundation, built-in auth, and real-time capabilities.",
    project: "SaaS Dashboard",
    category: "Architecture",
    status: "approved",
    timestamp: "2 hours ago",
    date: "May 14, 2026",
    author: "Tandem AI",
    rationale: "Supabase provides the best balance of developer experience, scalability, and cost for an early-stage SaaS product. The PostgreSQL foundation allows for complex queries as we scale.",
    alternatives: [
      { name: "Firebase", reason: "NoSQL would require data modeling changes" },
      { name: "Auth0", reason: "Additional cost and complexity for separate auth" },
      { name: "PlanetScale", reason: "Would need separate auth solution" }
    ],
    implications: [
      "All data models will be relational",
      "Auth flows will use Supabase magic links",
      "Real-time features available via subscriptions"
    ],
    linkedArtifacts: ["Architecture Doc", "PRD v1.2", "Mission Brief #12"]
  },
  {
    id: "d2",
    title: "Implement server-side rendering for SEO pages",
    description: "Public-facing pages will use SSR for SEO, while dashboard pages remain client-side for better interactivity.",
    project: "E-commerce Platform",
    category: "Performance",
    status: "approved",
    timestamp: "1 day ago",
    date: "May 13, 2026",
    author: "Tandem AI",
    rationale: "SEO is critical for discoverability. SSR ensures search engines can index product pages while keeping the dashboard fast and interactive.",
    alternatives: [
      { name: "Full SSR", reason: "Would slow down dashboard interactions" },
      { name: "Full CSR", reason: "Poor SEO for product pages" }
    ],
    implications: [
      "Need to separate public and private routes",
      "Some state management complexity",
      "Caching strategy for SSR pages needed"
    ],
    linkedArtifacts: ["Performance Spec", "SEO Requirements"]
  },
  {
    id: "d3",
    title: "Use React Native over Flutter for mobile",
    description: "React Native chosen for better code sharing with the existing Next.js web app and team familiarity with React.",
    project: "Mobile App MVP",
    category: "Stack",
    status: "approved",
    timestamp: "2 days ago",
    date: "May 12, 2026",
    author: "User",
    rationale: "Team already knows React and TypeScript. Code sharing between web and mobile will accelerate development significantly.",
    alternatives: [
      { name: "Flutter", reason: "Would require learning Dart" },
      { name: "Native iOS/Android", reason: "Double the development effort" },
      { name: "Expo only", reason: "Limited native module access" }
    ],
    implications: [
      "Can share validation logic and types",
      "Some UI components portable",
      "Need React Native specialists eventually"
    ],
    linkedArtifacts: ["Tech Stack Doc", "Mobile Requirements"]
  },
  {
    id: "d4",
    title: "Adopt a monorepo structure with Turborepo",
    description: "Consolidating web, mobile, and shared packages into a monorepo for better code sharing and CI/CD efficiency.",
    project: "SaaS Dashboard",
    category: "DevOps",
    status: "pending",
    timestamp: "3 days ago",
    date: "May 11, 2026",
    author: "Tandem AI",
    rationale: "As we add mobile and shared packages, a monorepo will reduce duplication and simplify dependency management.",
    alternatives: [
      { name: "Separate repos", reason: "More CI/CD complexity, duplicate packages" },
      { name: "Nx", reason: "More complex than needed for current scale" }
    ],
    implications: [
      "Need to restructure project layout",
      "CI/CD pipeline changes required",
      "Better cache sharing across builds"
    ],
    linkedArtifacts: ["Architecture Doc", "DevOps Plan"]
  },
]

const categories = ["All", "Architecture", "Stack", "Performance", "DevOps", "Security", "Design"]

export default function DecisionsPage() {
  const [selectedDecision, setSelectedDecision] = useState<typeof decisions[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredDecisions = decisions.filter(d => 
    activeCategory === "All" || d.category === activeCategory
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Decision Log</h1>
            <p className="text-sm text-muted-foreground">Track and reference all product decisions</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {decisions.filter(d => d.status === "approved").length} Approved
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search decisions..." 
              className="pl-10 bg-background/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-1">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2 pr-4">
                {filteredDecisions.map((decision, index) => (
                  <div key={decision.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredDecisions.length - 1 && (
                      <div className="absolute left-[11px] top-10 bottom-0 w-px bg-border/50" />
                    )}
                    
                    <div 
                      className={`cursor-pointer rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/50 ${
                        selectedDecision?.id === decision.id ? "border-primary ring-1 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedDecision(decision)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          decision.status === "approved" 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-amber-500 bg-amber-500/10"
                        }`}>
                          {decision.status === "approved" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm leading-snug">{decision.title}</h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {decision.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{decision.project}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{decision.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Decision Detail */}
          <div className="lg:col-span-3">
            {selectedDecision ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={`text-xs ${
                            selectedDecision.status === "approved" 
                              ? "bg-emerald-500 text-white" 
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {selectedDecision.status === "approved" ? "Approved" : "Pending"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedDecision.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{selectedDecision.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {selectedDecision.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {selectedDecision.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedDecision.description}</p>
                  </div>

                  {/* Rationale */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Rationale
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedDecision.rationale}</p>
                  </div>

                  {/* Alternatives Considered */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Alternatives Considered</h4>
                    <div className="space-y-2">
                      {selectedDecision.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="shrink-0 text-xs">{alt.name}</Badge>
                          <span className="text-muted-foreground">{alt.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implications */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Implications</h4>
                    <ul className="space-y-1.5">
                      {selectedDecision.implications.map((impl, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {impl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Linked Artifacts */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      Linked Artifacts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDecision.linkedArtifacts.map((artifact, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-muted gap-1"
                        >
                          {artifact}
                          <ArrowUpRight className="h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center min-h-[500px]">
                <div className="text-center text-muted-foreground">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select a decision to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
