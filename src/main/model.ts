import * as path from 'path'
import Store from 'data-store'
import jimp from 'jimp'

// export const init = async (friskyPath: string) => {
//   await storage.init({
//     dir: path.resolve(friskyPath, 'indexed'),
//     logging: true,
//   })
// }

const MAX_IMAGE_DIMENSION = 2000
// const IMAGE_CHUNK_SIZE = 5

export const saveImages = async (
  friskyPath: string,
  filePaths: string[],
  sender: any,
) => {
  const store = new Store({
    path: path.resolve(friskyPath, 'indexed.db'),
  })
  let progress = 0
  for (let filePath of filePaths) {
    sender.send('save-images-progress', progress, filePaths.length)
    if (store.has(filePath)) {
      progress++
      continue
    }
    const image = await jimp.read(filePath)
    const hash = await image.clone().hash(16)
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
    store.set(filePath.replace(/\./g, '\\.'), hash)
  }
  return progress
}
