"use client"

import { useHistory } from "@/lib/use-vibewire"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, ExternalLink, Clock, Inbox } from "lucide-react"

interface HistoryViewProps {
  onClear: () => void
}

export function HistoryView({ onClear }: HistoryViewProps) {
  const { data: history, isLoading } = useHistory()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const reversed = history ? [...history].reverse() : []

  if (reversed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">No history yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Copied video links will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          PURGE ALL
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {reversed.map((entry, i) => (
          <div
            key={`${entry.link}-${i}`}
            className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/20"
          >
            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {entry.title && (
                <span className="truncate text-sm font-medium text-foreground">
                  {entry.title}
                </span>
              )}
              <div className="flex items-center gap-2">
                {entry.author && (
                  <span className="font-mono text-[11px] font-semibold text-primary">
                    {entry.author.toUpperCase()}
                  </span>
                )}
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {entry.link}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
              onClick={() => window.open(entry.link, "_blank")}
              aria-label="Open link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
