import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import headSheetUrl from '../../assets/avatars/avatar_head_spritesheet.png'
import headSheetMetaJson from '../../assets/avatars/avatar_head_spritesheet.json'
import bodySheetUrl from '../../assets/avatars/avatar_body_spritesheet.png'
import bodySheetMetaJson from '../../assets/avatars/avatar_body_spritesheet.json'
import handsSheetUrl from '../../assets/avatars/avatar_hands_spritesheet.png'
import handsSheetMetaJson from '../../assets/avatars/avatar_hands_spritesheet.json'
import feetSheetUrl from '../../assets/avatars/avatar_feet_spritesheet.png'
import feetSheetMetaJson from '../../assets/avatars/avatar_feet_spritesheet.json'
import emoteSheetUrl from '../../assets/avatars/avatar_wave_celebrate_spritesheet.png'
import emoteSheetMetaJson from '../../assets/avatars/avatar_wave_celebrate_spritesheet.json'
import helmetSheetUrl from '../../assets/avatars/helmet_red_spritesheet.png'
import helmetSheetMetaJson from '../../assets/avatars/helmet_red_spritesheet.json'
import {
  getPreparedFrame,
  prepareSpriteSheet,
  type PreparedFrame,
  type PreparedSpriteSheet,
  type SpriteSheetMeta,
} from './spritesheet'

const headSheetMeta = headSheetMetaJson as SpriteSheetMeta
const bodySheetMeta = bodySheetMetaJson as SpriteSheetMeta
const handsSheetMeta = handsSheetMetaJson as SpriteSheetMeta
const feetSheetMeta = feetSheetMetaJson as SpriteSheetMeta
const emoteSheetMeta = emoteSheetMetaJson as SpriteSheetMeta
const helmetSheetMeta = helmetSheetMetaJson as SpriteSheetMeta

/** Bump when frame-prep logic or layer assets change. */
const SHEET_REVISION = 14

const EMOTE_ANIMATIONS = new Set(['wave_s', 'celebrate_s'])

/** Draw order for the paper-doll body (equipment draws after head). */
type BodyLayerName = 'feet' | 'body' | 'hands' | 'head'

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
  /** Equip the red helmet overlay layer. */
  helmetEquipped?: boolean
  onComplete?: () => void
}

type SheetBundle = {
  feet: PreparedSpriteSheet
  body: PreparedSpriteSheet
  hands: PreparedSpriteSheet
  head: PreparedSpriteSheet
  emote: PreparedSpriteSheet
  helmet: PreparedSpriteSheet
  /** Standing-pose height used to size emotes against the layered avatar. */
  referenceContentHeight: number
}

let sheetPromise: Promise<SheetBundle> | null = null
let sheetCacheKey = ''

function getSheets() {
  const cacheKey = [
    headSheetUrl,
    bodySheetUrl,
    handsSheetUrl,
    feetSheetUrl,
    emoteSheetUrl,
    helmetSheetUrl,
    SHEET_REVISION,
  ].join('|')
  if (!sheetPromise || sheetCacheKey !== cacheKey) {
    sheetCacheKey = cacheKey
    sheetPromise = Promise.all([
      prepareSpriteSheet(feetSheetMeta, feetSheetUrl),
      prepareSpriteSheet(bodySheetMeta, bodySheetUrl),
      prepareSpriteSheet(handsSheetMeta, handsSheetUrl),
      prepareSpriteSheet(headSheetMeta, headSheetUrl),
      prepareSpriteSheet(emoteSheetMeta, emoteSheetUrl),
      prepareSpriteSheet(helmetSheetMeta, helmetSheetUrl),
    ])
      .then(([feet, body, hands, head, emote, helmet]) => {
        const headIdle = getPreparedFrame(head, 'idle_s', 0)
        const feetIdle = getPreparedFrame(feet, 'idle_s', 0)
        const referenceContentHeight = Math.max(
          1,
          Math.round(feetIdle.anchor.y - headIdle.head.y + 1),
        )
        return {
          feet,
          body,
          hands,
          head,
          emote,
          helmet,
          referenceContentHeight,
        }
      })
      .catch((error) => {
        sheetPromise = null
        sheetCacheKey = ''
        throw error
      })
  }
  return sheetPromise
}

function bodyLayerFrame(
  bundle: SheetBundle,
  layer: BodyLayerName,
  animationName: string,
  frameIndex: number,
): PreparedFrame {
  return getPreparedFrame(bundle[layer], animationName, frameIndex)
}

/** Compact helmet sheet: map body/emote clips to a facing row. */
function helmetAnimationFor(bodyAnimation: string): string {
  if (bodyAnimation === 'walk_n') return 'walk_n'
  if (bodyAnimation === 'walk_w') return 'walk_w'
  if (bodyAnimation === 'walk_e') return 'walk_e'
  // idle_s, walk_s, wave_s, celebrate_s → front
  return 'idle_s'
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
  helmetEquipped = false,
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
    helmetEquipped,
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
        helmetEquipped: showHelmet,
      } = readPaintProps()

      const isEmote = EMOTE_ANIMATIONS.has(animName)
      const timingSheet = isEmote ? bundle.emote : bundle.head
      const anim = timingSheet.meta.animations[animName]
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

      const frameIndex = frameRef.current
      const dpr = window.devicePixelRatio || 1
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.imageSmoothingEnabled = false

      if (isEmote) {
        const prepared = getPreparedFrame(bundle.emote, animName, frameIndex)
        const sw = prepared.canvas.width
        const sh = prepared.canvas.height
        const drawScale =
          bundle.referenceContentHeight /
          Math.max(1, bundle.emote.referenceContentHeight)
        const cssWidth = dw * sc * drawScale
        const cssHeight = cssWidth * (sh / sw)

        canvas.width = Math.max(1, Math.ceil(cssWidth * dpr))
        canvas.height = Math.max(1, Math.ceil(cssHeight * dpr))
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, cssWidth, cssHeight)
        ctx.drawImage(prepared.canvas, 0, 0, sw, sh, 0, 0, cssWidth, cssHeight)

        if (showHelmet) {
          const helmetAnim = helmetAnimationFor(animName)
          const helmetFrame = getPreparedFrame(bundle.helmet, helmetAnim, 0)
          const px = cssWidth / sw
          const dx = (prepared.head.x - helmetFrame.head.x) * px
          const dy = (prepared.head.y - helmetFrame.head.y) * px
          ctx.drawImage(
            helmetFrame.canvas,
            0,
            0,
            helmetFrame.canvas.width,
            helmetFrame.canvas.height,
            dx,
            dy,
            helmetFrame.canvas.width * px,
            helmetFrame.canvas.height * px,
          )
        }

        placeAtFeet(sw, sh, prepared.anchor.x, prepared.anchor.y, drawScale)
        return
      }

      const headFrame = bodyLayerFrame(bundle, 'head', animName, frameIndex)
      const bodyFrame = bodyLayerFrame(bundle, 'body', animName, frameIndex)
      const handsFrame = bodyLayerFrame(bundle, 'hands', animName, frameIndex)
      const feetFrame = bodyLayerFrame(bundle, 'feet', animName, frameIndex)

      const sw = headFrame.canvas.width
      // Head may be taller after restoring walk_e hair overhang from walk_w.
      const overhang = Math.max(0, headFrame.canvas.height - bodyFrame.canvas.height)
      const sh = headFrame.canvas.height
      const drawScale = 1
      const cssWidth = dw * sc * drawScale
      const cssHeight = cssWidth * (sh / sw)
      const px = cssWidth / sw

      canvas.width = Math.max(1, Math.ceil(cssWidth * dpr))
      canvas.height = Math.max(1, Math.ceil(cssHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssWidth, cssHeight)

      const drawLayer = (frame: PreparedFrame, yOffsetPx: number) => {
        const fw = frame.canvas.width
        const fh = frame.canvas.height
        ctx.drawImage(
          frame.canvas,
          0,
          0,
          fw,
          fh,
          0,
          yOffsetPx * px,
          fw * px,
          fh * px,
        )
      }

      // feet → body → hands → head (helmet after head)
      drawLayer(feetFrame, overhang)
      drawLayer(bodyFrame, overhang)
      drawLayer(handsFrame, overhang)
      drawLayer(headFrame, 0)

      if (showHelmet) {
        const helmetAnim = helmetAnimationFor(animName)
        const helmetFrame = getPreparedFrame(bundle.helmet, helmetAnim, 0)
        const dx = (headFrame.head.x - helmetFrame.head.x) * px
        const dy = (headFrame.head.y - helmetFrame.head.y) * px
        ctx.drawImage(
          helmetFrame.canvas,
          0,
          0,
          helmetFrame.canvas.width,
          helmetFrame.canvas.height,
          dx,
          dy,
          helmetFrame.canvas.width * px,
          helmetFrame.canvas.height * px,
        )
      }

      placeAtFeet(
        sw,
        sh,
        feetFrame.anchor.x,
        feetFrame.anchor.y + overhang,
        drawScale,
      )
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
