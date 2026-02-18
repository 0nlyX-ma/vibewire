const { app, BrowserWindow, shell } = require("electron")
const path = require("path")
const http = require("http")
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

let mainWindow = null
const PORT = 3457
const isDev = process.env.NODE_ENV === "development"
const app_dir = path.join(__dirname, "..")

async function startServer() {
  const nextApp = next({ dev: isDev, dir: app_dir })
  const handle = nextApp.getRequestHandler()

  await nextApp.prepare()

  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      res.statusCode = 500
      res.end("Internal server error")
    }
  })

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
      resolve()
    })
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#080808",
    title: "VIBEWIRE // Content Pulse",
    icon: path.join(__dirname, "icon.jpg"),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadURL(`http://localhost:${PORT}`)

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url)
    }
    return { action: "deny" }
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on("ready", async () => {
  try {
    await startServer()
    createWindow()
  } catch (err) {
    console.error("Error starting app:", err)
    app.quit()
  }
})

app.on("window-all-closed", () => {
  app.quit()
})