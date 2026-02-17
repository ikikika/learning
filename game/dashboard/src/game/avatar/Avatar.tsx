import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import basicSheetUrl from '../../assets/avatars/avatar_basic_spritesheet.png'
import basicSheetMetaJson from '../../assets/avatars/avatar_basic_spritesheet.json'
import {
  getPreparedFrame,
  prepareSpriteSheet,
  type PreparedSpriteSheet,
  type SpriteSheetMeta,
} from './spritesheet'

const basicSheetMeta = basicSheetMetaJson as SpriteSheetMeta
/** Bump when frame-prep logic changes so the cached sheet is rebuilt. */
const SHEET_REVISION = 3

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
  animation?: string
  /** When true, loop the animation frames (walk). Idle uses a single pose. */
  playing?: boolean
}

let sheetPromise: Promise<PreparedSpriteSheet> | null = null
let sheetCacheKey = ''

function getSheet() {
  const cacheKey = `${basicSheetUrl}#${SHEET_REVISION}`
  if (!sheetPromise || sheetCacheKey !== cacheKey) {
    sheetCacheKey = cacheKey
    sheetPromise = prepareSpriteSheet(basicSheetMeta, basicSheetUrl).catch(
      (error) => {
        sheetPromise = null
        sheetCacheKey = ''
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
  playing = false,
}: AvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sheetRef = useRef<PreparedSpriteSheet | null>(null)
  const frameRef = useRef(0)
  const lastFrameTimeRef = useRef(0)

  const readPaintProps = useEffectEvent(() => ({
    x,
    y,
    scale,
    displayWidth,
    animation,
    playing,
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let rafId = 0

    const placeAtFeet = (
      frameWidth: number,
      frameHeight: number,
      anchorX: number,
      anchorY: number,
    ) => {
      const svg = svgRef.current
      const stage = stageRef.current
      if (!svg || !stage) return

      const ctm = svg.getScreenCTM()
      if (!ctm) return

      const { x: px, y: py, scale: sc, displayWidth: dw } = readPaintProps()
      const screen = new DOMPoint(px, py).matrixTransform(ctm)
      const stageRect = stage.getBoundingClientRect()

      const width = dw * sc
      const height = width * (frameHeight / frameWidth)
      const scaleX = width / frameWidth
      const scaleY = height / frameHeight

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.style.left = `${Math.round(screen.x - stageRect.left - anchorX * scaleX)}px`
      canvas.style.top = `${Math.round(screen.y - stageRect.top - anchorY * scaleY)}px`
    }

    const paint = (time: number) => {
      const sheet = sheetRef.current
      if (!sheet) return

      const {
        animation: animName,
        playing: isPlaying,
        scale: sc,
        displayWidth: dw,
      } = readPaintProps()
      const anim = sheet.meta.animations[animName]
      if (!anim) return

      if (isPlaying) {
        if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time
        const elapsed = time - lastFrameTimeRef.current
        if (elapsed >= anim.frameDurationMs) {
          const steps = Math.floor(elapsed / anim.frameDurationMs)
          frameRef.current = (frameRef.current + steps) % anim.frames
          lastFrameTimeRef.current = time
        }
      } else {
        frameRef.current = 0
        lastFrameTimeRef.current = 0
      }

      const prepared = getPreparedFrame(sheet, animName, frameRef.current)
      const sw = prepared.canvas.width
      const sh = prepared.canvas.height
      const cssWidth = dw * sc
      const cssHeight = cssWidth * (sh / sw)
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.ceil(cssWidth * dpr))
      canvas.height = Math.max(1, Math.ceil(cssHeight * dpr))

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssWidth, cssHeight)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(prepared.canvas, 0, 0, sw, sh, 0, 0, cssWidth, cssHeight)
      placeAtFeet(sw, sh, prepared.anchor.x, prepared.anchor.y)
    }

    const loop = (time: number) => {
      if (cancelled) return
      paint(time)
      rafId = requestAnimationFrame(loop)
    }

    const onResize = () => paint(performance.now())
    window.addEventListener('resize', onResize)

    getSheet()
      .then((loaded) => {
        if (cancelled) return
        sheetRef.current = loaded
        rafId = requestAnimationFrame(loop)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [stageRef, svgRef])

  useEffect(() => {
    frameRef.current = 0
    lastFrameTimeRef.current = 0
  }, [animation])

  return <canvas ref={canvasRef} className="world__avatar" aria-hidden />
}

export default Avatar
