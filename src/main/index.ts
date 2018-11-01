import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'

require('electron-debug')({
  enabled: true,
  devToolsMode: 'right',
})

declare var __dirname: string
let mainWindow: Electron.BrowserWindow

const friskyPath = path.resolve(app.getPath('pictures'), 'frisky')

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

  console.log(friskyPath)
}

ipcMain.on('ondragstart', (event, filePaths: string[]) => {
  console.log(filePaths)
  event.sender.startDrag({
    files: filePaths,
    icon: filePaths[0],
  })
})

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
console.log(`frisky.chat version ${app.getVersion()}`)
