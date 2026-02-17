export type SpriteAnimation = {
  row: number
  frames: number
  frameDurationMs: number
}

export type SpriteAnchor = {
  /** Feet X within a frame (px from left) */
  x: number
  /** Feet Y within a frame (px from top) */
  y: number
}

export type SpriteSheetMeta = {
  image: string
  imageWidth: number
  imageHeight: number
  columns: number
  rows: number
  frameWidth: number
  frameHeight: number
  chromaKey: string
  /** Visual feet point; defaults to bottom-center of the frame if omitted */
  anchor?: SpriteAnchor
  animations: Record<string, SpriteAnimation>
}

export type PreparedSpriteSheet = {
  meta: SpriteSheetMeta
  /** Magenta-keyed sheet drawn onto a canvas */
  canvas: HTMLCanvasElement
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  const value = Number.parseInt(cleaned, 16)
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  }
}

function applyChromaKey(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  chromaKey: string,
  tolerance = 60,
) {
  const key = parseHexColor(chromaKey)
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i]! - key.r
    const dg = data[i + 1]! - key.g
    const db = data[i + 2]! - key.b
    if (dr * dr + dg * dg + db * db <= tolerance * tolerance) {
      data[i + 3] = 0
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

/** Prepare a spritesheet from a Vite-bundled image URL (not a public/ path). */
export async function prepareSpriteSheet(
  meta: SpriteSheetMeta,
  imageUrl: string,
): Promise<PreparedSpriteSheet> {
  const image = new Image()
  image.decoding = 'async'

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () =>
      reject(new Error(`Failed to load sprite image: ${imageUrl}`))
    image.src = imageUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = meta.imageWidth
  canvas.height = meta.imageHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Could not create 2D canvas context for sprite sheet')
  }

  ctx.drawImage(image, 0, 0)
  applyChromaKey(ctx, canvas.width, canvas.height, meta.chromaKey)

  return { meta, canvas }
}

export function getFrameSource(
  meta: SpriteSheetMeta,
  animationName: string,
  frameIndex: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const animation = meta.animations[animationName]
  if (!animation) {
    throw new Error(`Unknown animation: ${animationName}`)
  }

  const frame =
    ((frameIndex % animation.frames) + animation.frames) % animation.frames
  return {
    sx: frame * meta.frameWidth,
    sy: animation.row * meta.frameHeight,
    sw: meta.frameWidth,
    sh: meta.frameHeight,
  }
}
