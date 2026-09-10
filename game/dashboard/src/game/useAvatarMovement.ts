import { useEffect, useRef, useState } from 'react'
import type { GridPoint } from './grid'
import {
  buildGridPath,
  directionFromStep,
  idleAnimationFor,
  lerpCell,
  sameCell,
  segmentDurationMs,
  walkAnimationFor,
  type CardinalDirection,
} from './movement/path'

type AvatarMotion = {
  /** Continuous grid position (fractional while walking) */
  position: GridPoint
  animation: string
  facing: CardinalDirection
  moving: boolean
}

type UseAvatarMovementResult = AvatarMotion & {
  walkTo: (destination: GridPoint) => void
}

export function useAvatarMovement(start: GridPoint): UseAvatarMovementResult {
  const [motion, setMotion] = useState<AvatarMotion>({
    position: start,
    animation: 'idle_s',
    facing: 's',
    moving: false,
  })

  const positionRef = useRef(start)
  const facingRef = useRef<CardinalDirection>('s')
  const pathRef = useRef<GridPoint[]>([])
  const segmentFromRef = useRef(start)
  const segmentStartMsRef = useRef(0)
  const segmentDurationRef = useRef(280)
  const rafRef = useRef(0)

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function beginSegment(from: GridPoint, to: GridPoint, now: number) {
    segmentFromRef.current = from
    segmentStartMsRef.current = now
    segmentDurationRef.current = segmentDurationMs(from, to)
    const facing = directionFromStep(from, to)
    facingRef.current = facing
    return facing
  }

  function tick(now: number) {
    const path = pathRef.current
    if (path.length === 0) {
      setMotion({
        position: positionRef.current,
        animation: idleAnimationFor(facingRef.current),
        facing: facingRef.current,
        moving: false,
      })
      return
    }

    const target = path[0]!
    const from = segmentFromRef.current
    const duration = segmentDurationRef.current
    const elapsed = now - segmentStartMsRef.current
    const t = Math.min(1, elapsed / duration)
    const nextPos = lerpCell(from, target, t)
    positionRef.current = nextPos

    const facing = facingRef.current

    if (t >= 1) {
      positionRef.current = target
      pathRef.current = path.slice(1)

      if (pathRef.current.length === 0) {
        setMotion({
          position: target,
          animation: idleAnimationFor(facing),
          facing,
          moving: false,
        })
        return
      }

      const upcoming = pathRef.current[0]!
      const nextFacing = beginSegment(target, upcoming, now)
      setMotion({
        position: target,
        animation: walkAnimationFor(nextFacing),
        facing: nextFacing,
        moving: true,
      })
    } else {
      setMotion({
        position: nextPos,
        animation: walkAnimationFor(facing),
        facing,
        moving: true,
      })
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  function walkTo(destination: GridPoint) {
    const from = {
      gridX: Math.round(positionRef.current.gridX),
      gridY: Math.round(positionRef.current.gridY),
    }

    if (sameCell(from, destination)) {
      cancelAnimationFrame(rafRef.current)
      pathRef.current = []
      positionRef.current = destination
      setMotion({
        position: destination,
        animation: idleAnimationFor(facingRef.current),
        facing: facingRef.current,
        moving: false,
      })
      return
    }

    const path = buildGridPath(from, destination)
    pathRef.current = path
    const now = performance.now()
    const first = path[0]!
    // Start from the current (possibly mid-tile) position toward the first cell.
    const facing = beginSegment(positionRef.current, first, now)

    cancelAnimationFrame(rafRef.current)
    setMotion({
      position: positionRef.current,
      animation: walkAnimationFor(facing),
      facing,
      moving: true,
    })
    rafRef.current = requestAnimationFrame(tick)
  }

  return {
    ...motion,
    walkTo,
  }
}
