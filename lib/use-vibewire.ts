import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export interface VideoEntry {
  id: string
  title: string
  link: string
  author: string
  channelId: string
  published: string
  thumbnail: string
  isShort: boolean
}

export interface HistoryEntry {
  link: string
  title: string
  author: string
  copiedAt: string
}

export function useVideos(type: "videos" | "shorts", hours: number = 24) {
  return useSWR<VideoEntry[]>(`/api/feed?type=${type}&hours=${hours}`, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
}

export function useChannels() {
  return useSWR<Record<string, string>>("/api/channels", fetcher)
}

export function useHistory() {
  return useSWR<HistoryEntry[]>("/api/history", fetcher)
}
