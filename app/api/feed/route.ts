import { NextResponse } from "next/server"
import { getChannels } from "@/lib/storage"

interface VideoEntry {
  id: string
  title: string
  link: string
  author: string
  channelId: string
  published: string
  thumbnail: string
  isShort: boolean
}

function parseAtomFeed(xml: string, channelId: string, nickname: string): VideoEntry[] {
  const entries: VideoEntry[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const getId = (tag: string) => {
      const m = entry.match(new RegExp(`<yt:${tag}>([^<]+)<`))
      return m ? m[1] : ""
    }
    const getTag = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([^<]*)<`))
      return m ? m[1] : ""
    }
    const getAttr = (tag: string, attr: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 's'))
      return m ? m[1] : ""
    }

    const videoId = getId("videoId")
    const title = getTag("title")
    const link = getAttr("link", "href")
    const published = getTag("published")
    const isShort = link.includes("/shorts/") || title.toLowerCase().includes("#shorts")

    entries.push({
      id: videoId,
      title,
      link: link || `https://www.youtube.com/watch?v=${videoId}`,
      author: nickname,
      channelId,
      published,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      isShort,
    })
  }

  return entries
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hoursBack = parseInt(searchParams.get("hours") || "24", 10)
  const type = searchParams.get("type") || "videos" // "videos" | "shorts"

  const channels = getChannels()
  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000)

  const allVideos: VideoEntry[] = []

  const fetches = Object.entries(channels).map(async ([cid, name]) => {
    try {
      const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`,
        { next: { revalidate: 0 } }
      )
      if (!res.ok) return []
      const xml = await res.text()
      return parseAtomFeed(xml, cid, name as string)
    } catch {
      return []
    }
  })

  const results = await Promise.all(fetches)
  for (const videos of results) {
    for (const v of videos) {
      const pubDate = new Date(v.published)
      if (pubDate > cutoff) {
        if (type === "shorts" && v.isShort) allVideos.push(v)
        if (type === "videos" && !v.isShort) allVideos.push(v)
      }
    }
  }

  allVideos.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())

  return NextResponse.json(allVideos)
}
