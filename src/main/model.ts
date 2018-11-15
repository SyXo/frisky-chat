import { promises as fs } from 'fs'
import * as path from 'path'
import * as os from 'os'
import Store from 'data-store'
import sharp from 'sharp'
import bluebird from 'bluebird'
import fileType from 'file-type'
import readChunk from 'read-chunk'

import { ghash } from './ghash'

const MAX_IMAGE_DIMENSION = 2000

export const walk = async (dir, filelist = []) => {
  const files = await fs.readdir(dir)

  for (let file of files) {
    const filepath = path.join(dir, file)
    const stat = await fs.stat(filepath)

    if (stat.isDirectory()) {
      filelist = await walk(filepath, filelist)
    } else if (stat.isFile()) {
      const type = fileType(await readChunk(filepath, 0, fileType.minimumBytes))
      if (type && type.mime.startsWith('image/')) {
        filelist.push(filepath)
      }
    }
  }

  return filelist
}

export const saveImages = async (
  friskyPath: string,
  dirPaths: string[],
  sender: any,
) => {
  const store = new Store({
    path: path.resolve(friskyPath, 'indexed.db'),
  })

  let progress = 0

  const filePaths: string[] = await bluebird.reduce(
    dirPaths,
    async (files: string[], dir) => [...files, ...(await walk(dir))],
    [],
  )

  await bluebird.map(
    filePaths,
    async filePath => {
      try {
        console.log(filePath)

        sender.send('save-images-progress', progress, filePaths.length)

        if (store.has(filePath)) {
          progress++
          return
        }

        const image = sharp(filePath)
        const { width, height } = await image.metadata()

        const imageBuffer = await image
          .resize(MAX_IMAGE_DIMENSION)
          .webp()
          .toBuffer()

        const hash = await ghash(imageBuffer)

        await fs.writeFile(
          path.resolve(friskyPath, 'pool', `${hash}_${width}_${height}.webp`),
          imageBuffer,
        )

        console.log(hash, width, height)

        progress++

        store.set(filePath.replace(/\./g, '\\.'), hash)
      } catch (err) {
        console.error(filePath, err)
      }
    },
    { concurrency: os.cpus().length },
  )

  return progress
}
