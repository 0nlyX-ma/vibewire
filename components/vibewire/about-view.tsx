"use client"

import { Zap, Github, ExternalLink, Code2, MonitorPlay } from "lucide-react"

export function AboutView() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-12">
      {/* Brand block */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-[0.2em] text-primary">VIBEWIRE</h1>
        <span className="font-mono text-xs tracking-widest text-muted-foreground">
          CONTENT PULSE // v2.5
        </span>
      </div>

      {/* Description card */}
      <div className="w-full rounded-xl border border-border bg-card p-6">
        <p className="text-center leading-relaxed text-foreground/80">
          A personal YouTube channel monitoring tool that tracks new uploads from your favorite
          creators. Fetches RSS feeds, filters videos and shorts, and keeps a history of
          everything you copy.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { icon: MonitorPlay, label: "Video Feed" },
          { icon: Code2, label: "RSS Powered" },
          { icon: Zap, label: "Auto Sync" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-xs font-medium tracking-wide text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-border" />

      {/* Developer block */}
      <div className="flex flex-col items-center gap-4">
        <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
          DEVELOPED BY
        </span>
        <h2 className="text-xl font-bold tracking-wider text-foreground">0nlyX</h2>
        <a
          href="https://github.com/0nlyX-ma"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <Github className="h-5 w-5 text-foreground transition-colors group-hover:text-primary" />
          <span className="font-mono text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            github.com/0nlyX-ma
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
        </a>
      </div>
    </div>
  )
}
