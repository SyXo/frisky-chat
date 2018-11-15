import sharp from 'sharp'

const MAX_RESOLUTION = 8
const OUTPUT_BUF_SIZE = (MAX_RESOLUTION * MAX_RESOLUTION) / 8
// const MIN_RESOLUTION = 2
// const MIN_FUZZINESS = 0
// const MAX_FUZZINESS = 255

export const ghash = async (
  input,
  { resolution = MAX_RESOLUTION, fuzziness = 0 } = {},
) => {
  const image = await sharp(input)
    // note: choice of interpolator affects hash value
    .resize(resolution, resolution)
    .flatten()
    .grayscale()

  const buf = await image.raw().toBuffer()

  return calculateHash(buf, fuzziness).toString('hex')
}

const calculateHash = (inputBuf, fuzziness) => {
  const outputBuf = Buffer.alloc(OUTPUT_BUF_SIZE)
  let octet = 0
  let bit = 0
  const iters = inputBuf.length - 1

  outputBuf.fill(0)

  // calculate hash from luminance gradient
  for (let i = 0; i < iters; i++) {
    if (inputBuf[i + 1] - inputBuf[i] > fuzziness) {
      outputBuf[octet] |= 1 << bit
    }
    if (++bit == 8) {
      octet++
      bit = 0
    }
  }

  // wrap to first pixel
  if (inputBuf[0] - inputBuf[iters] > fuzziness) {
    outputBuf[octet] |= 1 << bit
  }

  return outputBuf
}
