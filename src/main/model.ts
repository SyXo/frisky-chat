import * as path from 'path'
import * as fs from 'fs'
import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import Gun from 'gun'
import sharp from 'sharp'
import phash from 'sharp-phash'
import { SHA3 } from 'sha3'

const levelDB = levelup(
  encode(leveldown(this.opts.file), { valueEncoding: 'json' }),
)

const db = new Gun({
  level: levelDB,
  radisk: false,
  localStorage: false,
  web: false,
})

const MAX_IMAGE_DIMENSION = 2000
// const IMAGE_CHUNK_SIZE = 5

export const saveImages = async (
  friskyPath: string,
  filePaths: string[],
  sender: any,
) => {
  // const store = new Store({
  //   path: path.resolve(friskyPath, 'indexed.db'),
  // })
  let progress = 0
  for (let filePath of filePaths) {
    sender.send('save-images-progress', progress, filePaths.length)
    // if (store.has(filePath)) {
    //   progress++
    //   continue
    // }

    const tmpName = `${Date.now()}.${progress}.tmp`
    const imageBuffer = await sharp(filePath)
      .resize(MAX_IMAGE_DIMENSION)
      .webp({ lossless: true })
      .toBuffer()
    const sha = await SHA3Hash()
    const phash = await image.clone().hash(16)
    await image
      .clone()
      .scaleToFit(
        Math.min(image.bitmap.width, MAX_IMAGE_DIMENSION),
        Math.min(image.bitmap.height, MAX_IMAGE_DIMENSION),
      )
      .quality(90)
      .write(
        path.resolve(
          friskyPath,
          'pool',
          `${hash}_${image.bitmap.width}_${image.bitmap.height}.jpg`,
        ),
      )
    progress++
    // store.set(filePath.replace(/\./g, '\\.'), hash)
  }
  return progress
}
