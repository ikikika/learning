import { useEffect, useRef, type RefObject } from 'react'
import basicSheetUrl from '../../assets/avatars/avatar_basic_spritesheet.png'
import basicSheetMetaJson from '../../assets/avatars/avatar_basic_spritesheet.json'
import {
  getFrameSource,
  prepareSpriteSheet,
  type PreparedSpriteSheet,
  type SpriteSheetMeta,
} from './spritesheet'

const basicSheetMeta = basicSheetMetaJson as SpriteSheetMeta

type AvatarProps = {
  /** SVG element that owns the isometric viewBox */
  svgRef: RefObject<SVGSVGElement | null>
  /** Stage wrapper used for CSS positioning */
  stageRef: RefObject<HTMLElement | null>
  /** Screen X of the tile center (feet anchor) in SVG user units */
  x: number
  /** Screen Y of the tile center (feet anchor) in SVG user units */
  y: number
  /** Depth-based scale from the world grid */
  scale?: number
  /** Drawn width of one frame before depth scale */
  displayWidth?: number
  /** Spritesheet animation name; only frame 0 is drawn (static idle). */
  animation?: string
}

let sheetPromise: Promise<PreparedSpriteSheet> | null = null

function getSheet() {
  if (!sheetPromise) {
    sheetPromise = prepareSpriteSheet(basicSheetMeta, basicSheetUrl).catch(
      (error) => {
        sheetPromise = null
        throw error
      },
    )
  }
  return sheetPromise
}

export function Avatar({
  svgRef,
  stageRef,
  x,
  y,
  scale = 1,
  displayWidth = 96,
  animation = 'idle_s',
}: AvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let sheet: PreparedSpriteSheet | null = null

    const placeAtTileCenter = (frameWidth: number, frameHeight: number) => {
      const svg = svgRef.current
      const stage = stageRef.current
      if (!svg || !stage || !sheet) return

      const ctm = svg.getScreenCTM()
      if (!ctm) return

      const screen = new DOMPoint(x, y).matrixTransform(ctm)
      const stageRect = stage.getBoundingClientRect()

      const width = displayWidth * scale
      const height = width * (frameHeight / frameWidth)
      const scaleX = width / frameWidth
      const scaleY = height / frameHeight

      // Anchor to the character's feet inside the frame, not the frame box.
      const anchorX = sheet.meta.anchor?.x ?? frameWidth / 2
      const anchorY = sheet.meta.anchor?.y ?? frameHeight

      const left = Math.round(screen.x - stageRect.left - anchorX * scaleX)
      const top = Math.round(screen.y - stageRect.top - anchorY * scaleY)

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.style.left = `${left}px`
      canvas.style.top = `${top}px`
    }

    const paintStaticIdle = () => {
      if (!sheet) return

      const { sx, sy, sw, sh } = getFrameSource(sheet.meta, animation, 0)
      const cssWidth = displayWidth * scale
      const cssHeight = cssWidth * (sh / sw)
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.ceil(cssWidth * dpr))
      canvas.height = Math.max(1, Math.ceil(cssHeight * dpr))

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssWidth, cssHeight)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(sheet.canvas, sx, sy, sw, sh, 0, 0, cssWidth, cssHeight)
      placeAtTileCenter(sw, sh)
    }

    const onResize = () => paintStaticIdle()
    window.addEventListener('resize', onResize)

    getSheet()
      .then((loaded) => {
        if (cancelled) return
        sheet = loaded
        paintStaticIdle()
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
    }
  }, [animation, displayWidth, scale, stageRef, svgRef, x, y])

  return <canvas ref={canvasRef} className="world__avatar" aria-hidden />
}

export default Avatar
