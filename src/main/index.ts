import { app, BrowserWindow } from 'electron'

require('electron-debug')({
  enabled: true,
  devToolsMode: 'right',
})

declare var __dirname: string
let mainWindow: Electron.BrowserWindow

const onReady = () => {
  mainWindow = new BrowserWindow({
    frame: false,
    show: false,
    webPreferences: {
      devTools: true,
    },
  })

  mainWindow.maximize()
  mainWindow.show()

  const fileName = `file://${app.getAppPath()}/out/index.html`
  mainWindow.loadURL(fileName)
  mainWindow.on('close', () => app.quit())
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
console.log(`frisky.chat version ${app.getVersion()}`)
