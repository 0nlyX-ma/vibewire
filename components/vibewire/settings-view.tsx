"use client"

import { useChannels } from "@/lib/use-vibewire"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Radio, Inbox } from "lucide-react"

interface SettingsViewProps {
  onAddNew: () => void
  onRemove: (id: string) => void
}

export function SettingsView({ onAddNew, onRemove }: SettingsViewProps) {
  const { data: channels, isLoading } = useChannels()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const entries = channels ? Object.entries(channels) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Tracked Channels</h3>
          <p className="text-xs text-muted-foreground">
            {entries.length} {entries.length === 1 ? "source" : "sources"} connected
          </p>
        </div>
        <Button
          onClick={onAddNew}
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          NEW SOURCE
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">No channels yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your first YouTube channel to start monitoring
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map(([cid, name]) => (
            <div
              key={cid}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/20"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-4 w-4 text-primary" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {cid}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(cid)}
                className="gap-1.5 text-xs text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                REMOVE
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
