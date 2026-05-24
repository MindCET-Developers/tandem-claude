"use client"

import { useState } from "react"
import { 
  Zap, 
  FolderKanban, 
  Compass, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data for the dashboard
const stats = [
  { 
    label: "Active Projects", 
    value: "3", 
    icon: FolderKanban,
    trend: "+1 this week",
    color: "text-primary"
  },
  { 
    label: "Missions in Progress", 
    value: "7", 
    icon: Compass,
    trend: "2 pending review",
    color: "text-amber-500"
  },
  { 
    label: "Decisions Logged", 
    value: "24", 
    icon: FileText,
    trend: "+5 today",
    color: "text-emerald-500"
  },
  { 
    label: "Drift Alerts", 
    value: "2", 
    icon: AlertTriangle,
    trend: "Needs attention",
    color: "text-destructive"
  },
]

const recentProjects = [
  {
    id: "1",
    name: "SaaS Dashboard",
    description: "Analytics platform for small businesses",
    progress: 68,
    status: "active",
    lastActivity: "2 hours ago",
    phase: "Implementation"
  },
  {
    id: "2", 
    name: "Mobile App MVP",
    description: "Fitness tracking application",
    progress: 35,
    status: "active",
    lastActivity: "1 day ago",
    phase: "Architecture"
  },
  {
    id: "3",
    name: "E-commerce Platform",
    description: "Marketplace for handmade goods",
    progress: 12,
    status: "planning",
    lastActivity: "3 days ago",
    phase: "Requirements"
  },
]

const activeMissions = [
  {
    id: "m1",
    title: "Implement user authentication flow",
    project: "SaaS Dashboard",
    tool: "Cursor",
    status: "in-progress",
    priority: "high"
  },
  {
    id: "m2",
    title: "Create dashboard layout components",
    project: "SaaS Dashboard",
    tool: "v0",
    status: "pending-review",
    priority: "medium"
  },
  {
    id: "m3",
    title: "Set up database schema",
    project: "Mobile App MVP",
    tool: "Claude Code",
    status: "queued",
    priority: "high"
  },
]

const recentDecisions = [
  {
    id: "d1",
    title: "Use Supabase for authentication",
    project: "SaaS Dashboard",
    timestamp: "2 hours ago",
    category: "Architecture"
  },
  {
    id: "d2",
    title: "Implement server-side rendering for SEO",
    project: "E-commerce Platform",
    timestamp: "1 day ago",
    category: "Performance"
  },
  {
    id: "d3",
    title: "Use React Native over Flutter",
    project: "Mobile App MVP",
    timestamp: "2 days ago",
    category: "Stack"
  },
]

export default function ControlTowerPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Control Tower</h1>
            <p className="text-sm text-muted-foreground">System overview and mission status</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Activity className="h-4 w-4" />
              System Status
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  </div>
                  <div className={`rounded-lg bg-muted/50 p-2.5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Projects */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Active Projects</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <Link 
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  className="block rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge 
                      variant={project.status === "active" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {project.phase}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono text-xs">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last activity: {project.lastActivity}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Active Missions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Active Missions</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeMissions.map((mission) => (
                <div 
                  key={mission.id}
                  className="rounded-lg border border-border/50 bg-background/50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      mission.status === "in-progress" ? "bg-amber-500 animate-pulse" :
                      mission.status === "pending-review" ? "bg-primary" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mission.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {mission.tool}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{mission.project}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 gap-2">
                <Compass className="h-4 w-4" />
                View All Missions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Decisions & Drift Alerts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Decisions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Decisions</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Decision Log
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDecisions.map((decision) => (
                <div 
                  key={decision.id}
                  className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{decision.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{decision.project}</span>
                      <span>•</span>
                      <span>{decision.timestamp}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {decision.category}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Drift Alerts */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Drift Alerts
                <Badge variant="destructive" className="text-xs">2</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Authentication implementation differs from spec</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SaaS Dashboard • Detected 2 hours ago
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      The return brief indicates OAuth was implemented, but the PRD specifies magic links only.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Review Diff
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Update Spec
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">New dependency added without documentation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mobile App MVP • Detected 1 day ago
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Package &quot;react-native-reanimated&quot; was added but not logged in decisions.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Log Decision
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
