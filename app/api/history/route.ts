import { NextResponse } from "next/server"
import { getHistory, addToHistory, clearHistory } from "@/lib/storage"

export async function GET() {
  const history = getHistory()
  return NextResponse.json(history)
}

export async function POST(request: Request) {
  const { link, title, author } = await request.json()
  if (!link) {
    return NextResponse.json({ error: "Missing link" }, { status: 400 })
  }
  addToHistory({ link, title: title || "", author: author || "", copiedAt: new Date().toISOString() })
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  clearHistory()
  return NextResponse.json({ success: true })
}
