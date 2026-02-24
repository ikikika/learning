import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from './avatar/Avatar'
import {
  DEFAULT_GRID,
  depthFromGrid,
  expandRectToAspect,
  gridBounds,
  gridToScreen,
  iterateCellsCoveringRect,
  scaleFromDepth,
  screenToGrid,
  snapToCell,
  tilePath,
  type GridPoint,
  type IsometricGridConfig,
} from './grid'
import { useAvatarMovement } from './useAvatarMovement'
import './World.css'

type WorldProps = {
  config?: IsometricGridConfig
  /** When true, draw diamond outlines (dev / Phase 2). Final UI hides these. */
  showGrid?: boolean
}

function cellFill(point: GridPoint): string {
  const parity = (point.gridX + point.gridY) % 2
  return parity === 0 ? 'var(--tile-a)' : 'var(--tile-b)'
}

export function World({
  config: configProp,
  showGrid = true,
}: WorldProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  const config = useMemo(
    () => ({
      ...DEFAULT_GRID,
      ...configProp,
    }),
    [configProp],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const update = () => {
      const { width, height } = stage.getBoundingClientRect()
      setStageSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const bounds = useMemo(() => gridBounds(config), [config])
  const padding = 24
  const coreRect = useMemo(
    () => ({
      minX: bounds.minX - padding,
      minY: bounds.minY - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2,
    }),
    [bounds],
  )

  const stageAspect =
    stageSize.width > 0 && stageSize.height > 0
      ? stageSize.width / stageSize.height
      : coreRect.width / coreRect.height

  const stageRect = useMemo(
    () => expandRectToAspect(coreRect, stageAspect),
    [coreRect, stageAspect],
  )

  const cells = useMemo(
    () => [...iterateCellsCoveringRect(stageRect, config)],
    [stageRect, config],
  )
  const floorCells = useMemo(() => {
    const keys = new Set(cells.map((c) => `${c.gridX},${c.gridY}`))
    return keys
  }, [cells])
  const maxDepth = useMemo(() => {
    let max = 0
    for (const cell of cells) {
      max = Math.max(max, depthFromGrid(cell))
    }
    return max
  }, [cells])

  const startCell = useMemo(
    () => ({
      gridX: Math.floor(config.cols / 2),
      gridY: Math.floor(config.rows / 2),
    }),
    [config.cols, config.rows],
  )

  const [hover, setHover] = useState<GridPoint | null>(null)
  const [destination, setDestination] = useState<GridPoint | null>(startCell)
  const [emote, setEmote] = useState<'wave_s' | 'celebrate_s' | null>(null)
  const [helmetEquipped, setHelmetEquipped] = useState(false)
  const { position, animation, moving, walkTo } = useAvatarMovement(startCell)

  const activeAnimation = emote ?? animation
  const isPlaying = moving || emote !== null
  const loopAnimation = emote === null

  function playEmote(next: 'wave_s' | 'celebrate_s') {
    if (moving || emote) return
    setEmote(next)
  }

  const viewBox = `${stageRect.minX} ${stageRect.minY} ${stageRect.width} ${stageRect.height}`

  function isFloorCell(cell: GridPoint) {
    return floorCells.has(`${cell.gridX},${cell.gridY}`)
  }

  function hitTest(clientX: number, clientY: number, svg: SVGSVGElement) {
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const local = point.matrixTransform(ctm.inverse())
    const fractional = screenToGrid({ x: local.x, y: local.y }, config)
    const cell = snapToCell(fractional)
    return isFloorCell(cell) ? cell : null
  }

  const active = hover ?? destination
  const activeDepth = active ? depthFromGrid(active) : null
  const activeScale =
    activeDepth === null ? null : scaleFromDepth(activeDepth, maxDepth)

  const avatarScreen = gridToScreen(position, config)
  const avatarDepth = depthFromGrid(position)
  const avatarScale = scaleFromDepth(avatarDepth, maxDepth)
  const occupied = {
    gridX: Math.round(position.gridX),
    gridY: Math.round(position.gridY),
  }

  return (
    <div className="world">
      <header className="world__chrome">
        <p className="world__label">Room grid</p>
        <p className="world__meta">
          {active
            ? `cell (${active.gridX}, ${active.gridY}) · depth ${activeDepth?.toFixed(0)} · scale ${activeScale?.toFixed(2)}${moving ? ' · walking' : ''}`
            : 'click a tile to walk'}
        </p>
      </header>

      <div className="world__stage" ref={stageRef}>
        <div className="world__actions" role="group" aria-label="Avatar actions">
          <button
            type="button"
            className={`world__action${emote === 'wave_s' ? ' world__action--active' : ''}`}
            disabled={moving || emote !== null}
            aria-pressed={emote === 'wave_s'}
            onClick={() => playEmote('wave_s')}
          >
            Wave
          </button>
          <button
            type="button"
            className={`world__action${emote === 'celebrate_s' ? ' world__action--active' : ''}`}
            disabled={moving || emote !== null}
            aria-pressed={emote === 'celebrate_s'}
            onClick={() => playEmote('celebrate_s')}
          >
            Celebrate
          </button>
          <button
            type="button"
            className={`world__action${helmetEquipped ? ' world__action--active' : ''}`}
            aria-pressed={helmetEquipped}
            onClick={() => setHelmetEquipped((on) => !on)}
          >
            {helmetEquipped ? 'Unequip Helmet' : 'Equip Helmet'}
          </button>
        </div>

        <svg
          ref={svgRef}
          className="world__svg"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Isometric room grid"
          onPointerLeave={() => setHover(null)}
          onPointerMove={(event) => {
            const cell = hitTest(
              event.clientX,
              event.clientY,
              event.currentTarget,
            )
            setHover(cell)
          }}
          onClick={(event) => {
            if (emote) return
            const cell = hitTest(
              event.clientX,
              event.clientY,
              event.currentTarget,
            )
            if (!cell) return
            setDestination(cell)
            walkTo(cell)
          }}
        >
          <defs>
            <linearGradient id="room-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--room-back)" />
              <stop offset="100%" stopColor="var(--room-front)" />
            </linearGradient>
          </defs>

          <rect
            className="world__backdrop"
            x={stageRect.minX}
            y={stageRect.minY}
            width={stageRect.width}
            height={stageRect.height}
            fill="url(#room-wash)"
          />

          {[...cells]
            .sort((a, b) => depthFromGrid(a) - depthFromGrid(b))
            .map((cell) => {
              const isHover =
                hover?.gridX === cell.gridX && hover?.gridY === cell.gridY
              const isDestination =
                destination?.gridX === cell.gridX &&
                destination?.gridY === cell.gridY
              const isOccupied =
                occupied.gridX === cell.gridX && occupied.gridY === cell.gridY

              return (
                <g key={`${cell.gridX}-${cell.gridY}`}>
                  <path
                    d={tilePath(cell, config)}
                    fill={cellFill(cell)}
                    className={[
                      'world__tile',
                      isHover ? 'world__tile--hover' : '',
                      isDestination ? 'world__tile--selected' : '',
                      isOccupied ? 'world__tile--occupied' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    stroke={showGrid ? 'var(--tile-stroke)' : 'none'}
                    strokeWidth={showGrid ? 1 : 0}
                  />
                </g>
              )
            })}
        </svg>

        <Avatar
          svgRef={svgRef}
          stageRef={stageRef}
          x={avatarScreen.x}
          y={avatarScreen.y}
          scale={avatarScale}
          animation={activeAnimation}
          playing={isPlaying}
          loop={loopAnimation}
          helmetEquipped={helmetEquipped}
          onComplete={() => setEmote(null)}
        />
      </div>
    </div>
  )
}

export default World
