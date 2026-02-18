"use client"

import { useState, useCallback } from "react"
import { SWRConfig, useSWRConfig } from "swr"
import { Sidebar, type Page } from "@/components/vibewire/sidebar"
import { FeedView } from "@/components/vibewire/feed-view"
import { HistoryView } from "@/components/vibewire/history-view"
import { SettingsView } from "@/components/vibewire/settings-view"
import { AboutView } from "@/components/vibewire/about-view"
import { AddChannelDialog } from "@/components/vibewire/add-channel-dialog"
import { useChannels, type VideoEntry } from "@/lib/use-vibewire"
import { Button } from "@/components/ui/button"
import { RefreshCw, LayoutDashboard, Film, Clock, Settings, Info } from "lucide-react"

const pageTitles: Record<Page, string> = {
  dashboard: "DASHBOARD",
  shorts: "SHORTS",
  history: "HISTORY",
  settings: "SETTINGS",
  about: "ABOUT",
}

const pageIcons: Record<Page, React.ElementType> = {
  dashboard: LayoutDashboard,
  shorts: Film,
  history: Clock,
  settings: Settings,
  about: Info,
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set())
  const [syncing, setSyncing] = useState(false)
  const { mutate } = useSWRConfig()
  const { data: channels } = useChannels()

  const channelCount = channels ? Object.keys(channels).length : 0
  const PageIcon = pageIcons[currentPage]

  const handleSync = useCallback(async () => {
    setSyncing(true)
    await mutate(() => true, undefined, { revalidate: true })
    setTimeout(() => setSyncing(false), 600)
  }, [mutate])

  const handleCopy = useCallback(async (video: VideoEntry) => {
    try {
      await navigator.clipboard.writeText(video.link)
    } catch {
      const el = document.createElement("textarea")
      el.value = video.link
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }

    setCopiedLinks((prev) => new Set(prev).add(video.link))

    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: video.link, title: video.title, author: video.author }),
    })
    mutate("/api/history")
  }, [mutate])

  const handleAddChannel = useCallback(async (id: string, name: string) => {
    await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    })
    await mutate("/api/channels")
    await mutate(() => true, undefined, { revalidate: true })
  }, [mutate])

  const handleRemoveChannel = useCallback(async (id: string) => {
    await fetch("/api/channels", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await mutate("/api/channels")
    await mutate(() => true, undefined, { revalidate: true })
  }, [mutate])

  const handleClearHistory = useCallback(async () => {
    await fetch("/api/history", { method: "DELETE" })
    mutate("/api/history")
    setCopiedLinks(new Set())
  }, [mutate])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        channelCount={channelCount}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <header className="flex items-center justify-between border-b border-border px-8 py-5">
          <div className="flex items-center gap-3">
            <PageIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-wide text-foreground">
              {pageTitles[currentPage]}
            </h2>
          </div>
          <Button
            onClick={handleSync}
            disabled={syncing}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            SYNC PULSE
          </Button>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {currentPage === "dashboard" && (
            <FeedView type="videos" copiedLinks={copiedLinks} onCopy={handleCopy} />
          )}
          {currentPage === "shorts" && (
            <FeedView type="shorts" copiedLinks={copiedLinks} onCopy={handleCopy} />
          )}
          {currentPage === "history" && (
            <HistoryView onClear={handleClearHistory} />
          )}
          {currentPage === "settings" && (
            <SettingsView
              onAddNew={() => setAddDialogOpen(true)}
              onRemove={handleRemoveChannel}
            />
          )}
          {currentPage === "about" && <AboutView />}
        </div>
      </main>

      <AddChannelDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddChannel}
      />
    </div>
  )
}

export default function VibewirePage() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <AppContent />
    </SWRConfig>
  )
}
