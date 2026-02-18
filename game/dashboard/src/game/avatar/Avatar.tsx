import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import basicSheetUrl from '../../assets/avatars/avatar_basic_spritesheet.png'
import basicSheetMetaJson from '../../assets/avatars/avatar_basic_spritesheet.json'
import emoteSheetUrl from '../../assets/avatars/avatar_wave_celebrate_spritesheet.png'
import emoteSheetMetaJson from '../../assets/avatars/avatar_wave_celebrate_spritesheet.json'
import {
  getPreparedFrame,
  prepareSpriteSheet,
  type PreparedSpriteSheet,
  type SpriteSheetMeta,
} from './spritesheet'

const basicSheetMeta = basicSheetMetaJson as SpriteSheetMeta
const emoteSheetMeta = emoteSheetMetaJson as SpriteSheetMeta

/** Bump when frame-prep logic changes so the cached sheet is rebuilt. */
const SHEET_REVISION = 6

const EMOTE_ANIMATIONS = new Set(['wave_s', 'celebrate_s'])

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
  /** When true, advance animation frames. */
  playing?: boolean
  /** When false, play once then call onComplete (emotes). */
  loop?: boolean
  onComplete?: () => void
}

type SheetBundle = {
  basic: PreparedSpriteSheet
  emote: PreparedSpriteSheet
}

let sheetPromise: Promise<SheetBundle> | null = null
let sheetCacheKey = ''

function getSheets() {
  const cacheKey = `${basicSheetUrl}|${emoteSheetUrl}#${SHEET_REVISION}`
  if (!sheetPromise || sheetCacheKey !== cacheKey) {
    sheetCacheKey = cacheKey
    sheetPromise = Promise.all([
      prepareSpriteSheet(basicSheetMeta, basicSheetUrl),
      prepareSpriteSheet(emoteSheetMeta, emoteSheetUrl),
    ])
      .then(([basic, emote]) => ({ basic, emote }))
      .catch((error) => {
        sheetPromise = null
        sheetCacheKey = ''
        throw error
      })
  }
  return sheetPromise
}

function sheetForAnimation(bundle: SheetBundle, animationName: string) {
  return EMOTE_ANIMATIONS.has(animationName) ? bundle.emote : bundle.basic
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
  loop = true,
  onComplete,
}: AvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sheetsRef = useRef<SheetBundle | null>(null)
  const frameRef = useRef(0)
  const lastFrameTimeRef = useRef(0)
  const completedRef = useRef(false)

  const readPaintProps = useEffectEvent(() => ({
    x,
    y,
    scale,
    displayWidth,
    animation,
    playing,
    loop,
  }))

  const notifyComplete = useEffectEvent(() => {
    onComplete?.()
  })

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
      drawScale: number,
    ) => {
      const svg = svgRef.current
      const stage = stageRef.current
      if (!svg || !stage) return

      const ctm = svg.getScreenCTM()
      if (!ctm) return

      const { x: px, y: py, scale: sc, displayWidth: dw } = readPaintProps()
      const screen = new DOMPoint(px, py).matrixTransform(ctm)
      const stageRect = stage.getBoundingClientRect()

      const width = dw * sc * drawScale
      const height = width * (frameHeight / frameWidth)
      const scaleX = width / frameWidth
      const scaleY = height / frameHeight

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.style.left = `${Math.round(screen.x - stageRect.left - anchorX * scaleX)}px`
      canvas.style.top = `${Math.round(screen.y - stageRect.top - anchorY * scaleY)}px`
    }

    const paint = (time: number) => {
      const bundle = sheetsRef.current
      if (!bundle) return

      const {
        animation: animName,
        playing: isPlaying,
        scale: sc,
        displayWidth: dw,
        loop: shouldLoop,
      } = readPaintProps()

      const sheet = sheetForAnimation(bundle, animName)
      const anim = sheet.meta.animations[animName]
      if (!anim) return

      if (isPlaying) {
        if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time
        const elapsed = time - lastFrameTimeRef.current
        if (elapsed >= anim.frameDurationMs) {
          const steps = Math.floor(elapsed / anim.frameDurationMs)
          const next = frameRef.current + steps
          lastFrameTimeRef.current = time

          if (!shouldLoop && next >= anim.frames) {
            frameRef.current = anim.frames - 1
            if (!completedRef.current) {
              completedRef.current = true
              notifyComplete()
            }
          } else {
            frameRef.current = next % anim.frames
          }
        }
      } else {
        frameRef.current = 0
        lastFrameTimeRef.current = 0
        completedRef.current = false
      }

      const prepared = getPreparedFrame(sheet, animName, frameRef.current)
      const sw = prepared.canvas.width
      const sh = prepared.canvas.height
      // Match emote art size to the basic avatar, then apply depth scale.
      const drawScale =
        bundle.basic.referenceContentHeight /
        Math.max(1, sheet.referenceContentHeight)
      const cssWidth = dw * sc * drawScale
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
      placeAtFeet(sw, sh, prepared.anchor.x, prepared.anchor.y, drawScale)
    }

    const loopFrame = (time: number) => {
      if (cancelled) return
      paint(time)
      rafId = requestAnimationFrame(loopFrame)
    }

    const onResize = () => paint(performance.now())
    window.addEventListener('resize', onResize)

    getSheets()
      .then((loaded) => {
        if (cancelled) return
        sheetsRef.current = loaded
        rafId = requestAnimationFrame(loopFrame)
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
    completedRef.current = false
  }, [animation])

  return <canvas ref={canvasRef} className="world__avatar" aria-hidden />
}

export default Avatar
