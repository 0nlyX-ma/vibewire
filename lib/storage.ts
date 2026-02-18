import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CHANNELS_FILE = path.join(DATA_DIR, "channels.json")
const HISTORY_FILE = path.join(DATA_DIR, "history.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export interface HistoryEntry {
  link: string
  title: string
  author: string
  copiedAt: string
}

// --- Channels ---

export function getChannels(): Record<string, string> {
  ensureDataDir()
  if (!fs.existsSync(CHANNELS_FILE)) {
    // Seed with a default channel
    const defaultChannels: Record<string, string> = {}
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(defaultChannels, null, 2))
    return defaultChannels
  }
  const raw = fs.readFileSync(CHANNELS_FILE, "utf-8")
  return JSON.parse(raw)
}

export function addChannel(id: string, name: string) {
  const channels = getChannels()
  channels[id] = name
  ensureDataDir()
  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2))
}

export function removeChannel(id: string) {
  const channels = getChannels()
  delete channels[id]
  ensureDataDir()
  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2))
}

// --- History ---

export function getHistory(): HistoryEntry[] {
  ensureDataDir()
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2))
    return []
  }
  const raw = fs.readFileSync(HISTORY_FILE, "utf-8")
  return JSON.parse(raw)
}

export function addToHistory(entry: HistoryEntry) {
  const history = getHistory()
  history.push(entry)
  ensureDataDir()
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2))
}

export function clearHistory() {
  ensureDataDir()
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2))
}
