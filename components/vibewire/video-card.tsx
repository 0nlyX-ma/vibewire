"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { VideoEntry } from "@/lib/use-vibewire"

interface VideoCardProps {
  video: VideoEntry
  onCopy: (video: VideoEntry) => void
  isCopied: boolean
}

export function VideoCard({ video, onCopy, isCopied }: VideoCardProps) {
  const [imgError, setImgError] = useState(false)

  const timeAgo = getTimeAgo(video.published)

  return (
    <div className="group flex items-center gap-5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80">
      {/* Thumbnail */}
      <div className="relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
        {!imgError ? (
          <img
            src={video.thumbnail}
            alt={`Thumbnail for ${video.title}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Film className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-xs font-semibold tracking-wide text-primary"
          >
            {video.author.toUpperCase()}
          </Badge>
          <span className="font-mono text-[11px] text-muted-foreground">{timeAgo}</span>
        </div>
        <h3 className="truncate text-sm font-semibold text-foreground">{video.title}</h3>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={() => window.open(video.link, "_blank")}
          aria-label="Open video in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant={isCopied ? "default" : "outline"}
          size="sm"
          className={
            isCopied
              ? "pointer-events-none gap-1.5 bg-primary text-primary-foreground"
              : "gap-1.5 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
          }
          onClick={() => onCopy(video)}
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              COPIED
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              COPY
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function Film(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m10 8 6 4-6 4Z" />
    </svg>
  )
}

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
