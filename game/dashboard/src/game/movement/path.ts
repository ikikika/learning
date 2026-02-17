import {
  DEFAULT_GRID,
  gridToScreen,
  type GridPoint,
  type IsometricGridConfig,
} from '../grid'

export type CardinalDirection = 'n' | 's' | 'e' | 'w'

/** 8-connected path of cell centers from `from` (exclusive) to `to` (inclusive). */
export function buildGridPath(from: GridPoint, to: GridPoint): GridPoint[] {
  const path: GridPoint[] = []
  let x = from.gridX
  let y = from.gridY

  while (x !== to.gridX || y !== to.gridY) {
    if (x < to.gridX) x += 1
    else if (x > to.gridX) x -= 1
    if (y < to.gridY) y += 1
    else if (y > to.gridY) y -= 1
    path.push({ gridX: x, gridY: y })
  }

  return path
}

/** Screen-space length of a grid step (isometric E/W is longer than N/S). */
export function screenStepDistance(
  from: GridPoint,
  to: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
): number {
  const a = gridToScreen(from, config)
  const b = gridToScreen(to, config)
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/** Duration so walk speed is constant in screen pixels (avoids E/W skating). */
export function segmentDurationMs(
  from: GridPoint,
  to: GridPoint,
  config: IsometricGridConfig = DEFAULT_GRID,
  pixelsPerSecond = 140,
): number {
  const distance = screenStepDistance(from, to, config)
  return Math.max(140, (distance / pixelsPerSecond) * 1000)
}

/** Pick a 4-way facing from a grid step (screen-space dominant axis). */
export function directionFromStep(
  from: GridPoint,
  to: GridPoint,
): CardinalDirection {
  const dX = to.gridX - from.gridX
  const dY = to.gridY - from.gridY

  // Isometric screen delta: sx ∝ (dX - dY), sy ∝ (dX + dY)
  const screenDx = dX - dY
  const screenDy = dX + dY

  if (Math.abs(screenDx) > Math.abs(screenDy)) {
    return screenDx > 0 ? 'e' : 'w'
  }
  return screenDy > 0 ? 's' : 'n'
}

export function walkAnimationFor(direction: CardinalDirection): string {
  return `walk_${direction}`
}

export function idleAnimationFor(direction: CardinalDirection): string {
  // Only front idle exists on the basic sheet today.
  void direction
  return 'idle_s'
}

export function sameCell(a: GridPoint, b: GridPoint): boolean {
  return a.gridX === b.gridX && a.gridY === b.gridY
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpCell(a: GridPoint, b: GridPoint, t: number): GridPoint {
  return {
    gridX: lerp(a.gridX, b.gridX, t),
    gridY: lerp(a.gridY, b.gridY, t),
  }
}
