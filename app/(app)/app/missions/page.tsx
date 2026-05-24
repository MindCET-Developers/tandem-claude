"use client"

import { useState } from "react"
import { 
  Compass, 
  Plus, 
  Search, 
  Filter,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Code,
  Palette,
  Database
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const missions = [
  {
    id: "m1",
    title: "Implement user authentication with Supabase",
    description: "Set up complete auth flow including sign up, sign in, password reset, and session management using Supabase Auth.",
    project: "SaaS Dashboard",
    tool: "Cursor",
    toolIcon: Code,
    status: "in-progress",
    priority: "high",
    createdAt: "2 hours ago",
    context: {
      constraints: ["Use magic links for passwordless auth", "Implement RLS policies", "Add session refresh logic"],
      references: ["PRD Section 4.2", "Architecture Doc - Auth Flow"],
      acceptanceCriteria: ["Users can sign up with email", "Session persists across refreshes", "Protected routes redirect to login"]
    }
  },
  {
    id: "m2",
    title: "Create dashboard layout components",
    description: "Build the main dashboard shell including sidebar navigation, header, and responsive layout grid.",
    project: "SaaS Dashboard",
    tool: "v0",
    toolIcon: Palette,
    status: "pending-review",
    priority: "medium",
    createdAt: "1 day ago",
    context: {
      constraints: ["Follow design system tokens", "Mobile-first approach", "Dark mode support"],
      references: ["Design System v1.2", "Figma Mockups"],
      acceptanceCriteria: ["Responsive down to 320px", "Collapsible sidebar", "Breadcrumb navigation"]
    }
  },
  {
    id: "m3",
    title: "Set up database schema",
    description: "Create the initial database schema with users, organizations, projects, and activity tables.",
    project: "Mobile App MVP",
    tool: "Claude Code",
    toolIcon: Database,
    status: "queued",
    priority: "high",
    createdAt: "3 days ago",
    context: {
      constraints: ["Use Supabase migrations", "Add proper indexes", "Implement soft deletes"],
      references: ["Data Model Doc", "Entity Relationship Diagram"],
      acceptanceCriteria: ["All tables created", "RLS enabled", "Seed data script ready"]
    }
  },
  {
    id: "m4",
    title: "Build onboarding wizard flow",
    description: "Create a multi-step onboarding experience for new users with progress tracking and skip options.",
    project: "SaaS Dashboard",
    tool: "v0",
    toolIcon: Palette,
    status: "completed",
    priority: "medium",
    createdAt: "5 days ago",
    context: {
      constraints: ["5 steps maximum", "Progress auto-save", "Can skip and return later"],
      references: ["User Flow Doc", "Onboarding Best Practices"],
      acceptanceCriteria: ["All steps implemented", "Progress persisted", "Skip functionality works"]
    }
  },
]

const statusColors = {
  "in-progress": "bg-amber-500",
  "pending-review": "bg-primary",
  "queued": "bg-muted-foreground",
  "completed": "bg-emerald-500"
}

const statusLabels = {
  "in-progress": "In Progress",
  "pending-review": "Pending Review",
  "queued": "Queued",
  "completed": "Completed"
}

export default function MissionsPage() {
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mission Briefs</h1>
            <p className="text-sm text-muted-foreground">Task specifications for external AI tools</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Mission
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search missions..." 
              className="pl-10 bg-background/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Missions</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-0">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Mission List */}
              <div className="space-y-3">
                {missions.map((mission) => (
                  <Card 
                    key={mission.id}
                    className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 ${
                      selectedMission?.id === mission.id ? "border-primary ring-1 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${statusColors[mission.status as keyof typeof statusColors]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm leading-snug">{mission.title}</h3>
                            <Badge 
                              variant={mission.priority === "high" ? "destructive" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {mission.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mission.description}</p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs gap-1 px-1.5 py-0">
                              <mission.toolIcon className="h-3 w-3" />
                              {mission.tool}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{mission.project}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{mission.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mission Detail */}
              {selectedMission ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24 h-fit">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${statusColors[selectedMission.status as keyof typeof statusColors]} text-white text-xs`}>
                            {statusLabels[selectedMission.status as keyof typeof statusLabels]}
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <selectedMission.toolIcon className="h-3 w-3" />
                            {selectedMission.tool}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{selectedMission.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">{selectedMission.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Constraints */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Constraints
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedMission.context.constraints.map((constraint, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* References */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        References
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMission.context.references.map((ref, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Acceptance Criteria */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Acceptance Criteria
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedMission.context.acceptanceCriteria.map((criteria, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="h-4 w-4 rounded border border-border/50 shrink-0 mt-0.5" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button className="flex-1 gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Brief
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Zap className="h-4 w-4" />
                        Open in {selectedMission.tool}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <Compass className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Select a mission to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="in-progress">
            <div className="text-center py-12 text-muted-foreground">
              <p>In Progress missions will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="text-center py-12 text-muted-foreground">
              <p>Pending Review missions will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-12 text-muted-foreground">
              <p>Completed missions will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
