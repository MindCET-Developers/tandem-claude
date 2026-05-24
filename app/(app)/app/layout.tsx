"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CompanionButton } from "@/components/companion/CompanionButton"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  GitBranch,
  AlertTriangle,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Compass,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Control Tower", href: "/app", icon: LayoutDashboard },
  { name: "Projects", href: "/app/projects", icon: FolderKanban },
  { name: "Mission Briefs", href: "/app/missions", icon: Compass },
  { name: "Return Briefs", href: "/app/returns", icon: FileText },
  { name: "Decision Log", href: "/app/decisions", icon: GitBranch },
  { name: "Drift Detection", href: "/app/drift", icon: AlertTriangle },
  { name: "Project Memory", href: "/app/memory", icon: History },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [companionProjectName, setCompanionProjectName] = useState<string | undefined>()
  const pathname = usePathname()
  const supabase = createClient()

  // Extract projectId from URL pattern /app/projects/[projectId]/...
  const projectIdMatch = pathname.match(/\/app\/projects\/([^/]+)/)
  const companionProjectId = projectIdMatch ? projectIdMatch[1] : undefined

  // Fetch project name whenever projectId changes
  useEffect(() => {
    if (!companionProjectId) {
      setCompanionProjectName(undefined)
      return
    }
    supabase
      .from('projects')
      .select('name')
      .eq('id', companionProjectId)
      .single()
      .then(({ data }) => setCompanionProjectName(data?.name ?? undefined))
  }, [companionProjectId])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {!collapsed && (
            <Link href="/app" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold tracking-tight">Tandem</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-8 w-8", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          <TooltipProvider delayDuration={0}>
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/app" && pathname.startsWith(item.href))
              
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                      {!collapsed && <span>{item.name}</span>}
                      {isActive && !collapsed && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="border-border/50">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>

        {/* Settings */}
        <div className="border-t border-border/50 p-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/app/settings"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Settings</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="border-border/50">
                  Settings
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* AI Companion */}
      <CompanionButton projectId={companionProjectId} projectName={companionProjectName} />
    </div>
  )
}
