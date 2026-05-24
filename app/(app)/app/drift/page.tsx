"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  FileText,
  Code,
  Database,
  Shield,
  Zap,
  Eye,
  GitCompare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const driftAlerts = [
  {
    id: "drift1",
    title: "Authentication implementation differs from spec",
    severity: "high",
    category: "Architecture",
    project: "SaaS Dashboard",
    detectedAt: "2 hours ago",
    description: "The return brief indicates OAuth was implemented, but the PRD specifies magic links only.",
    expected: "Magic link authentication using Supabase Auth with email verification",
    actual: "OAuth authentication with Google and GitHub providers implemented",
    affectedArtifacts: ["PRD Section 4.2", "Architecture Doc - Auth Flow", "Mission Brief #12"],
    suggestions: [
      "Update PRD to reflect OAuth decision",
      "Log new decision for OAuth addition",
      "Verify security implications documented"
    ],
    status: "unresolved"
  },
  {
    id: "drift2",
    title: "New dependency added without documentation",
    severity: "medium",
    category: "Dependencies",
    project: "Mobile App MVP",
    detectedAt: "1 day ago",
    description: "Package \"react-native-reanimated\" was added but not logged in decisions.",
    expected: "All dependencies should be logged with rationale in the decision log",
    actual: "Dependency added in return brief without corresponding decision record",
    affectedArtifacts: ["Dependencies Doc", "Return Brief #8"],
    suggestions: [
      "Log decision for react-native-reanimated",
      "Document animation requirements that led to this",
      "Update architecture doc with animation approach"
    ],
    status: "unresolved"
  },
  {
    id: "drift3",
    title: "API endpoint naming inconsistency",
    severity: "low",
    category: "Patterns",
    project: "E-commerce Platform",
    detectedAt: "3 days ago",
    description: "New endpoints use camelCase while existing endpoints use snake_case.",
    expected: "Consistent snake_case naming across all API endpoints",
    actual: "Mixed naming: /api/get_products vs /api/getUserCart",
    affectedArtifacts: ["API Spec", "Patterns Doc"],
    suggestions: [
      "Rename new endpoints to snake_case",
      "Add linting rule for endpoint naming",
      "Update API documentation"
    ],
    status: "resolved"
  },
]

const alignmentScore = {
  overall: 87,
  categories: [
    { name: "Architecture", score: 92, icon: Database },
    { name: "Patterns", score: 78, icon: Code },
    { name: "Security", score: 95, icon: Shield },
    { name: "Performance", score: 85, icon: Zap },
    { name: "Documentation", score: 82, icon: FileText },
  ]
}

const severityColors = {
  high: "text-destructive border-destructive/30 bg-destructive/5",
  medium: "text-amber-500 border-amber-500/30 bg-amber-500/5",
  low: "text-muted-foreground border-border/50 bg-muted/30"
}

const severityIcons = {
  high: XCircle,
  medium: AlertTriangle,
  low: AlertTriangle
}

export default function DriftPage() {
  const [selectedAlert, setSelectedAlert] = useState<typeof driftAlerts[0] | null>(null)

  const unresolvedCount = driftAlerts.filter(d => d.status === "unresolved").length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Drift Detection</h1>
            <p className="text-sm text-muted-foreground">Monitor alignment between specs and implementation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Run Analysis
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Alignment Score */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-6">
              {/* Overall Score */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center text-center border-r border-border/50 pr-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${alignmentScore.overall * 3.52} 352`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <span className="text-4xl font-bold">{alignmentScore.overall}</span>
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium">Alignment Score</p>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </div>

              {/* Category Breakdown */}
              <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {alignmentScore.categories.map((cat) => (
                  <div key={cat.name} className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      cat.score >= 90 ? "bg-emerald-500/10 text-emerald-500" :
                      cat.score >= 80 ? "bg-primary/10 text-primary" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold">{cat.score}%</p>
                    <p className="text-xs text-muted-foreground">{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drift Alerts */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Active Alerts</h2>
              <Badge variant="destructive" className="text-xs">
                {unresolvedCount} Unresolved
              </Badge>
            </div>
            
            {driftAlerts.map((alert) => {
              const SeverityIcon = severityIcons[alert.severity as keyof typeof severityIcons]
              return (
                <Card 
                  key={alert.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedAlert?.id === alert.id ? "border-primary ring-1 ring-primary/20" : "border-border/50"
                  } ${alert.status === "resolved" ? "opacity-60" : ""}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-md ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                        <SeverityIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm leading-snug">{alert.title}</h3>
                          {alert.status === "resolved" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.project}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{alert.detectedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Alert Detail */}
          <div className="lg:col-span-3">
            {selectedAlert ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={`text-xs capitalize ${
                            selectedAlert.severity === "high" ? "bg-destructive text-white" :
                            selectedAlert.severity === "medium" ? "bg-amber-500 text-white" :
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {selectedAlert.severity} severity
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedAlert.category}
                        </Badge>
                        {selectedAlert.status === "resolved" && (
                          <Badge className="bg-emerald-500 text-white text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{selectedAlert.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{selectedAlert.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Comparison */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2 text-emerald-500">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Expected (Spec)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedAlert.expected}</p>
                    </div>
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                      <div className="flex items-center gap-2 mb-2 text-destructive">
                        <Code className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Actual (Implementation)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedAlert.actual}</p>
                    </div>
                  </div>

                  {/* Affected Artifacts */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Affected Artifacts</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.affectedArtifacts.map((artifact, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {artifact}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Actions</h4>
                    <ul className="space-y-2">
                      {selectedAlert.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  {selectedAlert.status !== "resolved" && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button className="flex-1 gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Resolve Alert
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Review Diff
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <GitCompare className="h-4 w-4" />
                        Update Spec
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center min-h-[500px]">
                <div className="text-center text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select an alert to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
