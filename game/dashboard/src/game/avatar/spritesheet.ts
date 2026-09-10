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
  /** Fallback feet point if a frame has no auto-detected anchor */
  anchor?: SpriteAnchor
  animations: Record<string, SpriteAnimation>
  /**
   * When true (head / full-body sheets), walk_w may pack walk_e hair into the
   * bottom of the cell. Feet/hands/body layers must leave this false/undefined.
   */
  packedWalkHair?: boolean
}

export type PreparedFrame = {
  canvas: HTMLCanvasElement
  /** Feet point used to plant the sprite on a tile. */
  anchor: SpriteAnchor
  /**
   * Top-center of the head (or equipment art). Used to keep layered gear
   * locked to the head while the body slides inside the cell across frames.
   */
  head: SpriteAnchor
  /** Opaque body height in source pixels (for cross-sheet size matching). */
  contentHeight: number
}

export type PreparedSpriteSheet = {
  meta: SpriteSheetMeta
  /** Magenta-keyed full sheet (debug / fallback) */
  canvas: HTMLCanvasElement
  /** Isolated frames with per-frame feet anchors */
  frames: Record<string, PreparedFrame[]>
  /**
   * Standing-pose content height used to normalize draw size so emote sheets
   * match the basic avatar under the same depth scale.
   */
  referenceContentHeight: number
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

/**
 * Integer, non-overlapping frame rects.
 * Avoids fractional frameHeight (e.g. 1024/5 = 204.8).
 */
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

  const colW = meta.imageWidth / meta.columns
  const sx = Math.round(frame * colW)
  const sw = Math.round((frame + 1) * colW) - sx

  const sy = Math.floor((animation.row * meta.imageHeight) / meta.rows)
  const syEnd = Math.floor(((animation.row + 1) * meta.imageHeight) / meta.rows)
  const sh = syEnd - sy

  return { sx, sy, sw, sh }
}

function opaqueRowCounts(data: Uint8ClampedArray, sw: number, sh: number): number[] {
  const counts = new Array<number>(sh).fill(0)
  for (let y = 0; y < sh; y += 1) {
    let count = 0
    for (let x = 0; x < sw; x += 1) {
      if (data[(y * sw + x) * 4 + 3]! > 10) count += 1
    }
    counts[y] = count
  }
  return counts
}

/**
 * Packed sheets often put the next row's hair in this cell after a magenta gap.
 * Returns gap start (clear from here) and content start (hair band for overhang).
 *
 * Requires real sprite content above the gap so feet/hands-only layers (empty
 * upper cell + boots at the bottom) are not mistaken for packed hair bleed.
 */
function findBottomBleed(
  data: Uint8ClampedArray,
  sw: number,
  sh: number,
): { gapStart: number; contentStart: number } | null {
  const counts = opaqueRowCounts(data, sw, sh)
  const lower = Math.floor(sh * 0.55)

  for (let y = lower; y < sh - 4; y += 1) {
    const gap =
      counts[y]! < 3 && counts[y + 1]! < 3 && counts[y + 2]! < 3
    if (!gap) continue

    // Body (or head) must already occupy the cell above this gap.
    let contentAbove = 0
    for (let z = 0; z < y; z += 1) contentAbove += counts[z]!
    if (contentAbove < 80) continue

    let contentStart = -1
    for (let z = y + 1; z < sh; z += 1) {
      // Include the thin hair tip (often only 3–6 px wide), not just dense rows.
      if (counts[z]! >= 3) {
        contentStart = z
        break
      }
    }

    if (contentStart < 0 || sh - contentStart > 48) continue
    return { gapStart: y, contentStart }
  }
  return null
}

/** Clear the next-row hair band packed into the bottom of this cell. */
function clearBottomBleed(data: Uint8ClampedArray, sw: number, sh: number): void {
  const bleed = findBottomBleed(data, sw, sh)
  if (!bleed) return

  // Clear from the magenta gap so the 1–2px hair tip cannot remain.
  for (let clearY = bleed.gapStart; clearY < sh; clearY += 1) {
    for (let x = 0; x < sw; x += 1) {
      data[(clearY * sw + x) * 4 + 3] = 0
    }
  }
}

function rowSource(
  meta: SpriteSheetMeta,
  row: number,
  frameIndex: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const colW = meta.imageWidth / meta.columns
  const sx = Math.round(frameIndex * colW)
  const sw = Math.round((frameIndex + 1) * colW) - sx
  const sy = Math.floor((row * meta.imageHeight) / meta.rows)
  const syEnd = Math.floor(((row + 1) * meta.imageHeight) / meta.rows)
  return { sx, sy, sw, sh: syEnd - sy }
}

function measureContentHeight(
  data: Uint8ClampedArray,
  sw: number,
  sh: number,
): number {
  const counts = opaqueRowCounts(data, sw, sh)
  let minY = -1
  let maxY = -1
  for (let y = 0; y < sh; y += 1) {
    if (counts[y]! < 3) continue
    if (minY < 0) minY = y
    maxY = y
  }
  if (minY < 0 || maxY < 0) return sh
  return maxY - minY + 1
}

function detectFeetAnchor(
  data: Uint8ClampedArray,
  sw: number,
  sh: number,
  fallback: SpriteAnchor,
): SpriteAnchor {
  const counts = opaqueRowCounts(data, sw, sh)
  let bodyMax = -1
  for (let y = sh - 1; y >= 0; y -= 1) {
    if (counts[y]! >= 3) {
      bodyMax = y
      break
    }
  }
  if (bodyMax < 0) return fallback

  const band = Math.max(2, Math.floor(bodyMax * 0.04))
  const xs: number[] = []
  for (let y = Math.max(0, bodyMax - band); y <= bodyMax; y += 1) {
    for (let x = 0; x < sw; x += 1) {
      if (data[(y * sw + x) * 4 + 3]! <= 10) continue
      xs.push(x)
    }
  }
  if (xs.length === 0) return { x: fallback.x, y: bodyMax }

  const feetX = xs.reduce((sum, v) => sum + v, 0) / xs.length
  if (feetX < sw * 0.15 || feetX > sw * 0.85) {
    return { x: fallback.x, y: bodyMax }
  }
  return { x: feetX, y: bodyMax }
}

/** Top-center of the first opaque band (head / helmet crown). */
function detectHeadAnchor(
  data: Uint8ClampedArray,
  sw: number,
  sh: number,
  fallback: SpriteAnchor,
): SpriteAnchor {
  const counts = opaqueRowCounts(data, sw, sh)
  let top = -1
  for (let y = 0; y < sh; y += 1) {
    if (counts[y]! >= 3) {
      top = y
      break
    }
  }
  if (top < 0) return fallback

  const band = Math.max(4, Math.floor(sh * 0.06))
  const xs: number[] = []
  for (let y = top; y <= Math.min(sh - 1, top + band); y += 1) {
    for (let x = 0; x < sw; x += 1) {
      if (data[(y * sw + x) * 4 + 3]! <= 10) continue
      xs.push(x)
    }
  }
  if (xs.length === 0) return { x: fallback.x, y: top }

  const headX = xs.reduce((sum, v) => sum + v, 0) / xs.length
  return { x: headX, y: top }
}

function extractFrameCanvases(
  sheetCtx: CanvasRenderingContext2D,
  meta: SpriteSheetMeta,
): { frames: Record<string, PreparedFrame[]>; referenceContentHeight: number } {
  const frames: Record<string, PreparedFrame[]> = {}
  const fallback: SpriteAnchor = meta.anchor ?? {
    x: meta.frameWidth / 2,
    y: meta.frameHeight,
  }
  const packedWalkHair = meta.packedWalkHair === true

  for (const [name, animation] of Object.entries(meta.animations)) {
    frames[name] = []
    for (let i = 0; i < animation.frames; i += 1) {
      const { sx, sy, sw, sh } = getFrameSource(meta, name, i)
      const main = sheetCtx.getImageData(sx, sy, sw, sh)
      // Only the walk_w row of hair-bearing sheets packs the next row's hair.
      if (packedWalkHair && name === 'walk_w') {
        clearBottomBleed(main.data, sw, sh)
      }

      // Restore that hair onto walk_e so the head isn't cropped.
      let overhang = 0
      let overhangData: ImageData | null = null
      if (packedWalkHair && name === 'walk_e' && animation.row > 0) {
        const prev = rowSource(meta, animation.row - 1, i)
        const prevPixels = sheetCtx.getImageData(prev.sx, prev.sy, prev.sw, prev.sh)
        const bleed = findBottomBleed(prevPixels.data, prev.sw, prev.sh)
        if (bleed) {
          overhang = prev.sh - bleed.contentStart
          overhangData = sheetCtx.getImageData(
            prev.sx,
            prev.sy + bleed.contentStart,
            prev.sw,
            overhang,
          )
        }
      }

      const totalH = overhang + sh
      const frameCanvas = document.createElement('canvas')
      frameCanvas.width = sw
      frameCanvas.height = totalH
      const frameCtx = frameCanvas.getContext('2d')
      if (!frameCtx) {
        throw new Error('Could not create frame canvas context')
      }

      if (overhangData) {
        frameCtx.putImageData(overhangData, 0, 0)
      }
      frameCtx.putImageData(main, 0, overhang)

      const composed = frameCtx.getImageData(0, 0, sw, totalH)
      const anchor = detectFeetAnchor(composed.data, sw, totalH, {
        x: fallback.x,
        y: fallback.y + overhang,
      })
      const head = detectHeadAnchor(composed.data, sw, totalH, {
        x: fallback.x,
        y: overhang,
      })
      const contentHeight = measureContentHeight(composed.data, sw, totalH)
      frames[name].push({ canvas: frameCanvas, anchor, head, contentHeight })
    }
  }

  // Prefer a standing/idle-like first frame as the size reference for the sheet.
  const preferred =
    frames.idle_s?.[0] ?? frames.wave_s?.[0] ?? Object.values(frames)[0]?.[0]
  const referenceContentHeight = preferred?.contentHeight ?? meta.frameHeight

  return { frames, referenceContentHeight }
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
  const { frames, referenceContentHeight } = extractFrameCanvases(ctx, meta)

  return { meta, canvas, frames, referenceContentHeight }
}

export function getPreparedFrame(
  sheet: PreparedSpriteSheet,
  animationName: string,
  frameIndex: number,
): PreparedFrame {
  const list = sheet.frames[animationName]
  if (!list?.length) {
    throw new Error(`Unknown animation: ${animationName}`)
  }
  const frame = ((frameIndex % list.length) + list.length) % list.length
  return list[frame]!
}
