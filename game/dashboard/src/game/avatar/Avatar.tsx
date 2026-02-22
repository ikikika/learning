import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import headSheetUrl from '../../assets/avatars/avatar_head_spritesheet.png'
import headSheetMetaJson from '../../assets/avatars/avatar_head_spritesheet.json'
import bodySheetUrl from '../../assets/avatars/avatar_body_spritesheet.png'
import bodySheetMetaJson from '../../assets/avatars/avatar_body_spritesheet.json'
import handsSheetUrl from '../../assets/avatars/avatar_hands_spritesheet.png'
import handsSheetMetaJson from '../../assets/avatars/avatar_hands_spritesheet.json'
import feetSheetUrl from '../../assets/avatars/avatar_feet_spritesheet.png'
import feetSheetMetaJson from '../../assets/avatars/avatar_feet_spritesheet.json'
import headHelmetSheetUrl from '../../assets/avatars/avatar_head_white_helmet_spritesheet.png'
import headHelmetSheetMetaJson from '../../assets/avatars/avatar_head_white_helmet_spritesheet.json'
import waveFeetUrl from '../../assets/avatars/avatar_wave_feet_spritesheet.png'
import waveFeetMetaJson from '../../assets/avatars/avatar_wave_feet_spritesheet.json'
import waveBodyUrl from '../../assets/avatars/avatar_wave_body_spritesheet.png'
import waveBodyMetaJson from '../../assets/avatars/avatar_wave_body_spritesheet.json'
import waveHandsUrl from '../../assets/avatars/avatar_wave_hands_spritesheet.png'
import waveHandsMetaJson from '../../assets/avatars/avatar_wave_hands_spritesheet.json'
import waveHeadUrl from '../../assets/avatars/avatar_wave_head_spritesheet.png'
import waveHeadMetaJson from '../../assets/avatars/avatar_wave_head_spritesheet.json'
import waveHeadHelmetUrl from '../../assets/avatars/avatar_wave_head_white_helmet_spritesheet.png'
import waveHeadHelmetMetaJson from '../../assets/avatars/avatar_wave_head_white_helmet_spritesheet.json'
import celebrateFeetUrl from '../../assets/avatars/avatar_celebrate_feet_spritesheet.png'
import celebrateFeetMetaJson from '../../assets/avatars/avatar_celebrate_feet_spritesheet.json'
import celebrateBodyUrl from '../../assets/avatars/avatar_celebrate_body_spritesheet.png'
import celebrateBodyMetaJson from '../../assets/avatars/avatar_celebrate_body_spritesheet.json'
import celebrateHandsUrl from '../../assets/avatars/avatar_celebrate_hands_spritesheet.png'
import celebrateHandsMetaJson from '../../assets/avatars/avatar_celebrate_hands_spritesheet.json'
import celebrateHeadUrl from '../../assets/avatars/avatar_celebrate_head_spritesheet.png'
import celebrateHeadMetaJson from '../../assets/avatars/avatar_celebrate_head_spritesheet.json'
import celebrateHeadHelmetUrl from '../../assets/avatars/avatar_celebrate_head_white_helmet_spritesheet.png'
import celebrateHeadHelmetMetaJson from '../../assets/avatars/avatar_celebrate_head_white_helmet_spritesheet.json'
import {
  getPreparedFrame,
  prepareSpriteSheet,
  type PreparedFrame,
  type PreparedSpriteSheet,
  type SpriteSheetMeta,
} from './spritesheet'

const headSheetMeta = headSheetMetaJson as SpriteSheetMeta
const headHelmetSheetMeta = headHelmetSheetMetaJson as SpriteSheetMeta
const bodySheetMeta = bodySheetMetaJson as SpriteSheetMeta
const handsSheetMeta = handsSheetMetaJson as SpriteSheetMeta
const feetSheetMeta = feetSheetMetaJson as SpriteSheetMeta
const waveFeetMeta = waveFeetMetaJson as SpriteSheetMeta
const waveBodyMeta = waveBodyMetaJson as SpriteSheetMeta
const waveHandsMeta = waveHandsMetaJson as SpriteSheetMeta
const waveHeadMeta = waveHeadMetaJson as SpriteSheetMeta
const waveHeadHelmetMeta = waveHeadHelmetMetaJson as SpriteSheetMeta
const celebrateFeetMeta = celebrateFeetMetaJson as SpriteSheetMeta
const celebrateBodyMeta = celebrateBodyMetaJson as SpriteSheetMeta
const celebrateHandsMeta = celebrateHandsMetaJson as SpriteSheetMeta
const celebrateHeadMeta = celebrateHeadMetaJson as SpriteSheetMeta
const celebrateHeadHelmetMeta = celebrateHeadHelmetMetaJson as SpriteSheetMeta

/** Bump when frame-prep logic or layer assets change. */
const SHEET_REVISION = 32

const EMOTE_ANIMATIONS = new Set(['wave_s', 'celebrate_s'])

/** Draw order for the paper-doll body. */
type BodyLayerName = 'feet' | 'body' | 'hands' | 'head'

type LayerBundle = {
  feet: PreparedSpriteSheet
  body: PreparedSpriteSheet
  hands: PreparedSpriteSheet
  head: PreparedSpriteSheet
}

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
  /** Swap head layer to the white-helmet head spritesheet. */
  helmetEquipped?: boolean
  onComplete?: () => void
}

type SheetBundle = {
  walk: LayerBundle
  headHelmet: PreparedSpriteSheet
  wave: LayerBundle
  waveHeadHelmet: PreparedSpriteSheet
  celebrate: LayerBundle
  celebrateHeadHelmet: PreparedSpriteSheet
  /** Standing-pose height used to size emotes against the layered avatar. */
  referenceContentHeight: number
  /** Full paper-doll height for wave (feet→head), not head-layer-only. */
  waveContentHeight: number
  /** Full paper-doll height for celebrate (feet→head), not head-layer-only. */
  celebrateContentHeight: number
}

let sheetPromise: Promise<SheetBundle> | null = null
let sheetCacheKey = ''

function paperDollHeight(layers: LayerBundle, animationName: string): number {
  const head = getPreparedFrame(layers.head, animationName, 0)
  const feet = getPreparedFrame(layers.feet, animationName, 0)
  return Math.max(1, Math.round(feet.anchor.y - head.head.y + 1))
}

function getSheets() {
  const cacheKey = [
    headSheetUrl,
    headHelmetSheetUrl,
    bodySheetUrl,
    handsSheetUrl,
    feetSheetUrl,
    waveFeetUrl,
    waveBodyUrl,
    waveHandsUrl,
    waveHeadUrl,
    waveHeadHelmetUrl,
    celebrateFeetUrl,
    celebrateBodyUrl,
    celebrateHandsUrl,
    celebrateHeadUrl,
    celebrateHeadHelmetUrl,
    SHEET_REVISION,
  ].join('|')
  if (!sheetPromise || sheetCacheKey !== cacheKey) {
    sheetCacheKey = cacheKey
    sheetPromise = Promise.all([
      prepareSpriteSheet(feetSheetMeta, feetSheetUrl),
      prepareSpriteSheet(bodySheetMeta, bodySheetUrl),
      prepareSpriteSheet(handsSheetMeta, handsSheetUrl),
      prepareSpriteSheet(headSheetMeta, headSheetUrl),
      prepareSpriteSheet(headHelmetSheetMeta, headHelmetSheetUrl),
      prepareSpriteSheet(waveFeetMeta, waveFeetUrl),
      prepareSpriteSheet(waveBodyMeta, waveBodyUrl),
      prepareSpriteSheet(waveHandsMeta, waveHandsUrl),
      prepareSpriteSheet(waveHeadMeta, waveHeadUrl),
      prepareSpriteSheet(waveHeadHelmetMeta, waveHeadHelmetUrl),
      prepareSpriteSheet(celebrateFeetMeta, celebrateFeetUrl),
      prepareSpriteSheet(celebrateBodyMeta, celebrateBodyUrl),
      prepareSpriteSheet(celebrateHandsMeta, celebrateHandsUrl),
      prepareSpriteSheet(celebrateHeadMeta, celebrateHeadUrl),
      prepareSpriteSheet(celebrateHeadHelmetMeta, celebrateHeadHelmetUrl),
    ])
      .then(
        ([
          feet,
          body,
          hands,
          head,
          headHelmet,
          waveFeet,
          waveBody,
          waveHands,
          waveHead,
          waveHeadHelmet,
          celebrateFeet,
          celebrateBody,
          celebrateHands,
          celebrateHead,
          celebrateHeadHelmet,
        ]) => {
          const walk = { feet, body, hands, head }
          const wave = {
            feet: waveFeet,
            body: waveBody,
            hands: waveHands,
            head: waveHead,
          }
          const celebrate = {
            feet: celebrateFeet,
            body: celebrateBody,
            hands: celebrateHands,
            head: celebrateHead,
          }
          return {
            walk,
            headHelmet,
            wave,
            waveHeadHelmet,
            celebrate,
            celebrateHeadHelmet,
            referenceContentHeight: paperDollHeight(walk, 'idle_s'),
            waveContentHeight: paperDollHeight(wave, 'wave_s'),
            celebrateContentHeight: paperDollHeight(celebrate, 'celebrate_s'),
          }
        },
      )
      .catch((error) => {
        sheetPromise = null
        sheetCacheKey = ''
        throw error
      })
  }
  return sheetPromise
}

function layerFrame(
  layers: LayerBundle,
  layer: BodyLayerName,
  animationName: string,
  frameIndex: number,
): PreparedFrame {
  return getPreparedFrame(layers[layer], animationName, frameIndex)
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
      const emoteLayers =
        animName === 'celebrate_s' ? bundle.celebrate : bundle.wave
      const timingSheet = isEmote ? emoteLayers.head : bundle.walk.head
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

      const layers: LayerBundle = isEmote ? emoteLayers : bundle.walk
      let headSheet = layers.head
      if (showHelmet) {
        if (animName === 'wave_s') headSheet = bundle.waveHeadHelmet
        else if (animName === 'celebrate_s') headSheet = bundle.celebrateHeadHelmet
        else if (!isEmote) headSheet = bundle.headHelmet
      }
      const headFrame = getPreparedFrame(headSheet, animName, frameIndex)
      const bodyFrame = layerFrame(layers, 'body', animName, frameIndex)
      const handsFrame = layerFrame(layers, 'hands', animName, frameIndex)
      const feetFrame = layerFrame(layers, 'feet', animName, frameIndex)

      const sw = headFrame.canvas.width
      // Head may be taller after restoring walk_e hair overhang from walk_w.
      const overhang = Math.max(0, headFrame.canvas.height - bodyFrame.canvas.height)
      const sh = headFrame.canvas.height
      const emoteContentHeight =
        animName === 'celebrate_s'
          ? bundle.celebrateContentHeight
          : bundle.waveContentHeight
      const drawScale = isEmote
        ? bundle.referenceContentHeight / Math.max(1, emoteContentHeight)
        : 1
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

      // Walk/idle: feet → body → hands → head
      // Wave (and celebrate): hands above head/helmet so the wave reads in front
      drawLayer(feetFrame, overhang)
      drawLayer(bodyFrame, overhang)
      if (animName === 'wave_s' || animName === 'celebrate_s') {
        drawLayer(headFrame, 0)
        drawLayer(handsFrame, overhang)
      } else {
        drawLayer(handsFrame, overhang)
        drawLayer(headFrame, 0)
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
