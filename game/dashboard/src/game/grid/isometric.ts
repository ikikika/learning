import type { GridPoint, IsometricGridConfig, ScreenPoint } from './types'

export const DEFAULT_GRID: IsometricGridConfig = {
  tileWidth: 96,
  tileHeight: 48,
  cols: 10,
  rows: 10,
  originX: 0,
  originY: 0,
}

/** Convert logical grid coords → screen pixels (diamond / isometric projection). */
export function gridToScreen(
  point: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): ScreenPoint {
  const { tileWidth, tileHeight, originX, originY } = config
  const halfW = tileWidth / 2
  const halfH = tileHeight / 2

  return {
    x: originX + (point.gridX - point.gridY) * halfW,
    y: originY + (point.gridX + point.gridY) * halfH,
  }
}

/** Convert screen pixels → fractional grid coords. */
export function screenToGrid(
  point: ScreenPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): GridPoint {
  const { tileWidth, tileHeight, originX, originY } = config
  const halfW = tileWidth / 2
  const halfH = tileHeight / 2
  const localX = point.x - originX
  const localY = point.y - originY

  return {
    gridX: (localX / halfW + localY / halfH) / 2,
    gridY: (localY / halfH - localX / halfW) / 2,
  }
}

/** Snap fractional grid coords to the nearest cell. */
export function snapToCell(point: GridPoint): GridPoint {
  return {
    gridX: Math.round(point.gridX),
    gridY: Math.round(point.gridY),
  }
}

export function isInBounds(
  point: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): boolean {
  return (
    point.gridX >= 0 &&
    point.gridX < config.cols &&
    point.gridY >= 0 &&
    point.gridY < config.rows
  )
}

/**
 * Depth from grid position: higher values are closer to the front of the room.
 * Matches Y-as-depth: larger screen-Y (gridX + gridY) → closer / drawn later.
 */
export function depthFromGrid(point: GridPoint): number {
  return point.gridX + point.gridY
}

/**
 * Pseudo-3D scale from depth. Back of room is smaller; front is full size.
 * Tuned for a 10×10 grid (depth 0 … 18).
 */
export function scaleFromDepth(
  depth: number,
  maxDepth: number,
  minScale = 0.6,
  maxScale = 1,
): number {
  if (maxDepth <= 0) return maxScale
  const t = Math.min(1, Math.max(0, depth / maxDepth))
  return minScale + (maxScale - minScale) * t
}

/** Four corners of a diamond tile centered on the cell's screen position. */
export function tileCorners(
  point: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): [ScreenPoint, ScreenPoint, ScreenPoint, ScreenPoint] {
  const center = gridToScreen(point, config)
  const halfW = config.tileWidth / 2
  const halfH = config.tileHeight / 2

  return [
    { x: center.x, y: center.y - halfH }, // top
    { x: center.x + halfW, y: center.y }, // right
    { x: center.x, y: center.y + halfH }, // bottom
    { x: center.x - halfW, y: center.y }, // left
  ]
}

export function tilePath(
  point: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): string {
  const [top, right, bottom, left] = tileCorners(point, config)
  return `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${bottom.x} ${bottom.y} L ${left.x} ${left.y} Z`
}

/** Bounding box of the full grid in screen space (for SVG viewBox). */
export function gridBounds(config: IsometricGridConfig = DEFAULT_GRID): {
  minX: number
  minY: number
  width: number
  height: number
} {
  const halfW = config.tileWidth / 2
  const halfH = config.tileHeight / 2

  // Cell centers span these extremes; expand by half a tile for diamond extents.
  const minX = config.originX - (config.rows - 1) * halfW - halfW
  const maxX = config.originX + (config.cols - 1) * halfW + halfW
  const minY = config.originY - halfH
  const maxY =
    config.originY + (config.cols + config.rows - 2) * halfH + halfH

  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export function* iterateCells(
  config: IsometricGridConfig = DEFAULT_GRID,
): Generator<GridPoint> {
  for (let gridY = 0; gridY < config.rows; gridY += 1) {
    for (let gridX = 0; gridX < config.cols; gridX += 1) {
      yield { gridX, gridY }
    }
  }
}
