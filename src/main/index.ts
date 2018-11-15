import { promises as fs } from 'fs'
import * as path from 'path'
import { app, BrowserWindow, ipcMain, protocol } from 'electron'

import * as model from './model'

require('electron-debug')({
  enabled: true,
  devToolsMode: 'right',
  showDevTools: false,
})

let mainWindow: Electron.BrowserWindow

const friskyPath: string = path.resolve(app.getPath('pictures'), 'frisky_data')

const onReady = async () => {
  mainWindow = new BrowserWindow({
    frame: false,
    show: false,
    icon: `${__dirname}/build/icon.${
      process.platform == 'linux' ? 'small' : 'large'
    }.png`,
    webPreferences: {
      devTools: true,
    },
  })

  protocol.registerFileProtocol(
    'frisky-pool',
    (request, callback) => {
      const url = request.url.substr('frisky-pool://'.length)
      callback(`${friskyPath}/pool/${url}`)
    },
    error => {
      if (error) console.error('Failed to register frisky-pool:// protocol')
    },
  )

  try {
    await fs.mkdir(path.resolve(friskyPath), { recursive: true })
    await fs.mkdir(path.resolve(friskyPath, 'pool'), { recursive: true })
  } catch (err) {
    console.log(err)
  }

  mainWindow.maximize()
  mainWindow.show()

  const fileName = `file://${app.getAppPath()}/out/index.html`
  mainWindow.loadURL(fileName)
  mainWindow.on('close', () => app.quit())
}

ipcMain.on('ondragstart', (event, filePaths: string[]) => {
  console.log(filePaths)
  event.sender.startDrag({
    files: filePaths,
    icon: filePaths[0],
  })
})

ipcMain.on('fetch-pool-images', async event => {
  const imagePaths = await fs.readdir(path.resolve(friskyPath, 'pool'))
  event.sender.send('fetched-pool-images', imagePaths)
})

ipcMain.on('save-images', async (event, imagePaths) => {
  const count = await model.saveImages(friskyPath, imagePaths, event.sender)
  event.sender.send('save-images-finished', count)
})

app.on('ready', onReady)
app.on('window-all-closed', () => app.quit())
console.log(`frisky.chat version ${app.getVersion()}`)
