"use client"

import { useState } from "react"
import { 
  History, 
  Search,
  ChevronRight,
  FileText,
  GitBranch,
  Compass,
  Database,
  Clock,
  Layers,
  ArrowUpRight,
  Brain
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const memoryArtifacts = {
  productBrief: {
    id: "brief",
    title: "Product Brief",
    icon: FileText,
    lastUpdated: "2 days ago",
    version: "1.3",
    summary: "SaaS analytics dashboard for small businesses to track key metrics and make data-driven decisions.",
    content: {
      problemStatement: "Small businesses lack affordable, easy-to-use analytics tools. Enterprise solutions are too complex and expensive.",
      targetUsers: "Small business owners, marketing managers, operations leads at companies with 10-50 employees",
      coreValue: "Simple, actionable insights from connected data sources without technical expertise",
      successMetrics: ["Time to first insight < 5 minutes", "Daily active usage rate > 40%", "NPS > 50"]
    }
  },
  prd: {
    id: "prd",
    title: "PRD",
    icon: FileText,
    lastUpdated: "1 day ago",
    version: "2.1",
    summary: "Full product requirements including user stories, acceptance criteria, and scope boundaries.",
    sections: [
      { name: "User Stories", count: 24 },
      { name: "Acceptance Criteria", count: 48 },
      { name: "Non-functional Requirements", count: 12 },
      { name: "Out of Scope", count: 8 }
    ]
  },
  architecture: {
    id: "arch",
    title: "Architecture Map",
    icon: Layers,
    lastUpdated: "3 days ago",
    version: "1.2",
    summary: "System architecture including frontend, backend, database, and external integrations.",
    components: [
      { name: "Next.js Frontend", status: "active" },
      { name: "Supabase Backend", status: "active" },
      { name: "PostgreSQL Database", status: "active" },
      { name: "Stripe Payments", status: "planned" },
      { name: "Analytics Pipeline", status: "planned" }
    ]
  },
  dataModel: {
    id: "data",
    title: "Data Model",
    icon: Database,
    lastUpdated: "4 days ago",
    version: "1.1",
    summary: "Entity relationship diagram and database schema documentation.",
    entities: [
      { name: "users", fields: 8 },
      { name: "organizations", fields: 6 },
      { name: "projects", fields: 12 },
      { name: "metrics", fields: 15 },
      { name: "dashboards", fields: 10 }
    ]
  }
}

const recentChanges = [
  {
    id: "c1",
    artifact: "PRD",
    change: "Added user story for dashboard sharing",
    timestamp: "2 hours ago",
    author: "Tandem AI"
  },
  {
    id: "c2",
    artifact: "Architecture",
    change: "Updated auth flow to include OAuth providers",
    timestamp: "1 day ago",
    author: "User"
  },
  {
    id: "c3",
    artifact: "Data Model",
    change: "Added soft delete to all entities",
    timestamp: "2 days ago",
    author: "Tandem AI"
  },
  {
    id: "c4",
    artifact: "Product Brief",
    change: "Refined target user segment",
    timestamp: "3 days ago",
    author: "User"
  },
]

const contextGraph = {
  nodes: [
    { id: "brief", label: "Product Brief", x: 50, y: 50 },
    { id: "prd", label: "PRD", x: 200, y: 30 },
    { id: "arch", label: "Architecture", x: 200, y: 100 },
    { id: "data", label: "Data Model", x: 350, y: 50 },
    { id: "decisions", label: "Decisions", x: 350, y: 120 },
    { id: "missions", label: "Missions", x: 500, y: 70 },
  ],
  edges: [
    { from: "brief", to: "prd" },
    { from: "brief", to: "arch" },
    { from: "prd", to: "data" },
    { from: "arch", to: "data" },
    { from: "prd", to: "decisions" },
    { from: "arch", to: "decisions" },
    { from: "data", to: "missions" },
    { from: "decisions", to: "missions" },
  ]
}

export default function MemoryPage() {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>("brief")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Project Memory</h1>
            <p className="text-sm text-muted-foreground">Living documentation and context graph</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search memory..." 
                className="pl-10 bg-background/50 border-border/50 w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Context Map Visualization */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Context Graph
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                6 artifacts connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 bg-muted/20 rounded-lg border border-border/30">
              {/* Simple context visualization */}
              <svg className="w-full h-full" viewBox="0 0 600 180">
                {/* Edges */}
                {contextGraph.edges.map((edge, i) => {
                  const from = contextGraph.nodes.find(n => n.id === edge.from)!
                  const to = contextGraph.nodes.find(n => n.id === edge.to)!
                  return (
                    <line
                      key={i}
                      x1={from.x + 40}
                      y1={from.y + 15}
                      x2={to.x}
                      y2={to.y + 15}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-border/50"
                    />
                  )
                })}
                {/* Nodes */}
                {contextGraph.nodes.map((node) => (
                  <g key={node.id} className="cursor-pointer" onClick={() => setSelectedArtifact(node.id)}>
                    <rect
                      x={node.x}
                      y={node.y}
                      width="80"
                      height="30"
                      rx="6"
                      fill="currentColor"
                      className={`${selectedArtifact === node.id ? "text-primary" : "text-muted/50"} transition-colors`}
                    />
                    <text
                      x={node.x + 40}
                      y={node.y + 19}
                      textAnchor="middle"
                      fill="currentColor"
                      className={`text-xs font-medium ${selectedArtifact === node.id ? "text-primary-foreground" : "text-foreground"}`}
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Artifacts List */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium mb-4">Core Artifacts</h2>
            {Object.values(memoryArtifacts).map((artifact) => (
              <Card 
                key={artifact.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedArtifact === artifact.id ? "border-primary ring-1 ring-primary/20" : "border-border/50"
                } bg-card/50`}
                onClick={() => setSelectedArtifact(artifact.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <artifact.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{artifact.title}</h3>
                        <Badge variant="outline" className="text-xs">v{artifact.version}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{artifact.summary}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Updated {artifact.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Artifact Detail */}
          <div className="lg:col-span-2">
            {selectedArtifact && selectedArtifact === "brief" && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">v{memoryArtifacts.productBrief.version}</Badge>
                        <span className="text-xs text-muted-foreground">Updated {memoryArtifacts.productBrief.lastUpdated}</span>
                      </div>
                      <CardTitle className="text-lg">{memoryArtifacts.productBrief.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      Edit
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Problem Statement</h4>
                    <p className="text-sm text-muted-foreground">{memoryArtifacts.productBrief.content.problemStatement}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Target Users</h4>
                    <p className="text-sm text-muted-foreground">{memoryArtifacts.productBrief.content.targetUsers}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Core Value Proposition</h4>
                    <p className="text-sm text-muted-foreground">{memoryArtifacts.productBrief.content.coreValue}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Success Metrics</h4>
                    <ul className="space-y-1.5">
                      {memoryArtifacts.productBrief.content.successMetrics.map((metric, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedArtifact === "prd" && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">v{memoryArtifacts.prd.version}</Badge>
                        <span className="text-xs text-muted-foreground">Updated {memoryArtifacts.prd.lastUpdated}</span>
                      </div>
                      <CardTitle className="text-lg">{memoryArtifacts.prd.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      Edit
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{memoryArtifacts.prd.summary}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {memoryArtifacts.prd.sections.map((section) => (
                      <div key={section.name} className="rounded-lg border border-border/50 p-3 bg-background/50">
                        <p className="text-2xl font-bold">{section.count}</p>
                        <p className="text-xs text-muted-foreground">{section.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedArtifact === "arch" && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">v{memoryArtifacts.architecture.version}</Badge>
                        <span className="text-xs text-muted-foreground">Updated {memoryArtifacts.architecture.lastUpdated}</span>
                      </div>
                      <CardTitle className="text-lg">{memoryArtifacts.architecture.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      Edit
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{memoryArtifacts.architecture.summary}</p>
                  <div className="space-y-2">
                    {memoryArtifacts.architecture.components.map((comp) => (
                      <div key={comp.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3 bg-background/50">
                        <span className="text-sm font-medium">{comp.name}</span>
                        <Badge variant={comp.status === "active" ? "default" : "secondary"} className="text-xs capitalize">
                          {comp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedArtifact === "data" && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">v{memoryArtifacts.dataModel.version}</Badge>
                        <span className="text-xs text-muted-foreground">Updated {memoryArtifacts.dataModel.lastUpdated}</span>
                      </div>
                      <CardTitle className="text-lg">{memoryArtifacts.dataModel.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      Edit
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{memoryArtifacts.dataModel.summary}</p>
                  <div className="space-y-2">
                    {memoryArtifacts.dataModel.entities.map((entity) => (
                      <div key={entity.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3 bg-background/50">
                        <code className="text-sm font-mono text-primary">{entity.name}</code>
                        <span className="text-xs text-muted-foreground">{entity.fields} fields</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Changes */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Recent Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentChanges.map((change) => (
                    <div key={change.id} className="flex items-start gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{change.artifact}:</span> {change.change}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {change.author} • {change.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
