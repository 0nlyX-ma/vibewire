"use client"

import { useState, useCallback } from "react"
import { VideoCard } from "@/components/vibewire/video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useVideos, type VideoEntry } from "@/lib/use-vibewire"
import { Inbox } from "lucide-react"

interface FeedViewProps {
  type: "videos" | "shorts"
  copiedLinks: Set<string>
  onCopy: (video: VideoEntry) => void
}

export function FeedView({ type, copiedLinks, onCopy }: FeedViewProps) {
  const { data: videos, isLoading } = useVideos(type)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-5 rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-[72px] w-[128px] rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full max-w-[400px]" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">No new {type} found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {type === "videos"
              ? "Check back later or add more channels to track"
              : "No shorts detected in the last 24 hours"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onCopy={onCopy}
          isCopied={copiedLinks.has(video.link)}
        />
      ))}
    </div>
  )
}
