import { useMemo, useRef, useState } from 'react'
import { Avatar } from './avatar/Avatar'
import {
  DEFAULT_GRID,
  depthFromGrid,
  gridBounds,
  gridToScreen,
  isInBounds,
  iterateCells,
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

  const config = useMemo(
    () => ({
      ...DEFAULT_GRID,
      ...configProp,
    }),
    [configProp],
  )

  const bounds = useMemo(() => gridBounds(config), [config])
  const cells = useMemo(() => [...iterateCells(config)], [config])
  const maxDepth = config.cols + config.rows - 2

  const startCell = useMemo(
    () => ({
      gridX: Math.floor(config.cols / 2),
      gridY: Math.floor(config.rows / 2),
    }),
    [config.cols, config.rows],
  )

  const [hover, setHover] = useState<GridPoint | null>(null)
  const [destination, setDestination] = useState<GridPoint | null>(startCell)
  const { position, animation, moving, walkTo } = useAvatarMovement(startCell)

  const padding = 24
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${
    bounds.width + padding * 2
  } ${bounds.height + padding * 2}`

  function hitTest(clientX: number, clientY: number, svg: SVGSVGElement) {
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const local = point.matrixTransform(ctm.inverse())
    const fractional = screenToGrid({ x: local.x, y: local.y }, config)
    const cell = snapToCell(fractional)
    return isInBounds(cell, config) ? cell : null
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
        <svg
          ref={svgRef}
          className="world__svg"
          viewBox={viewBox}
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
            x={bounds.minX - padding}
            y={bounds.minY - padding}
            width={bounds.width + padding * 2}
            height={bounds.height + padding * 2}
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
          animation={animation}
          playing={moving}
        />
      </div>
    </div>
  )
}

export default World
