"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Film, Clock, Settings, Zap, Info } from "lucide-react"

export type Page = "dashboard" | "shorts" | "history" | "settings" | "about"

const navItems: { label: string; page: Page; icon: React.ElementType }[] = [
  { label: "DASHBOARD", page: "dashboard", icon: LayoutDashboard },
  { label: "SHORTS", page: "shorts", icon: Film },
  { label: "HISTORY", page: "history", icon: Clock },
  { label: "SETTINGS", page: "settings", icon: Settings },
  { label: "ABOUT", page: "about", icon: Info },
]

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
  channelCount: number
}

export function Sidebar({ currentPage, onPageChange, channelCount }: SidebarProps) {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1 px-6 pt-10 pb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-[0.2em] text-primary">VIBEWIRE</h1>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
          CONTENT PULSE
        </span>
      </div>

      {/* Stats chip */}
      <div className="mx-5 mb-6 rounded-lg bg-secondary px-4 py-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wide text-primary">
          TRACKING: {channelCount} {channelCount === 1 ? "SOURCE" : "SOURCES"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map(({ label, page, icon: Icon }) => {
          const active = currentPage === page
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
          DEVELOPED BY 0nlyX
        </p>
      </div>
    </aside>
  )
}
