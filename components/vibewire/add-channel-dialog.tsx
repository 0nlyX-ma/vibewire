"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Zap } from "lucide-react"

interface AddChannelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (id: string, name: string) => Promise<void>
}

export function AddChannelDialog({ open, onOpenChange, onAdd }: AddChannelDialogProps) {
  const [name, setName] = useState("")
  const [channelId, setChannelId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !channelId.trim()) {
      setError("Both fields are required")
      return
    }
    setLoading(true)
    setError("")
    try {
      await onAdd(channelId.trim(), name.trim())
      setName("")
      setChannelId("")
      onOpenChange(false)
    } catch {
      setError("Failed to add channel. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-wide text-foreground">
                ADD NEW SOURCE
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Connect a YouTube channel to your pulse feed
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="channel-name" className="text-xs font-semibold tracking-widest text-muted-foreground">
              DISPLAY NAME
            </label>
            <Input
              id="channel-name"
              placeholder="e.g. Fireship"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="channel-id" className="text-xs font-semibold tracking-widest text-muted-foreground">
              CHANNEL ID
            </label>
            <Input
              id="channel-id"
              placeholder="e.g. UCsBjURrPoezykLs9EqgamOA"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="border-border bg-secondary font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {"Find this in the channel's URL: youtube.com/channel/"}
              <span className="font-mono text-primary">{"CHANNEL_ID"}</span>
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Adding..." : "Add Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
