import { NextResponse } from "next/server"
import { getChannels, addChannel, removeChannel } from "@/lib/storage"

export async function GET() {
  const channels = getChannels()
  return NextResponse.json(channels)
}

export async function POST(request: Request) {
  const { id, name } = await request.json()
  if (!id || !name) {
    return NextResponse.json({ error: "Missing id or name" }, { status: 400 })
  }
  addChannel(id.trim(), name.trim())
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  removeChannel(id)
  return NextResponse.json({ success: true })
}
