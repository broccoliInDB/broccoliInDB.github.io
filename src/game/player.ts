import { RUN_SECONDS_PER_TILE, WALK_SECONDS_PER_TILE } from '../config'
import { type Facing, type Point } from '../world/layout'

const STEP: Record<Facing, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const FRAMES_PER_STEP = 2

export interface PlayerState {
  tileX: number
  tileY: number
  facing: Facing
  from: Point | null
  progress: number
  secondsPerTile: number
  stepCount: number
}

export function createPlayer(spawn: Point, facing: Facing): PlayerState {
  return {
    tileX: spawn.x,
    tileY: spawn.y,
    facing,
    from: null,
    progress: 0,
    secondsPerTile: WALK_SECONDS_PER_TILE,
    stepCount: 0,
  }
}

export function getFacingTile(player: PlayerState): Point {
  const step = STEP[player.facing]
  return { x: player.tileX + step.x, y: player.tileY + step.y }
}

export function isMoving(player: PlayerState): boolean {
  return player.from !== null
}

// Grid movement like classic handheld RPGs: the player commits to a whole
// tile, and the render position interpolates between tiles.
export function tryStartStep(
  player: PlayerState,
  direction: Facing,
  isRunning: boolean,
  isBlocked: (x: number, y: number) => boolean
): boolean {
  player.facing = direction
  const target = getFacingTile(player)
  if (isBlocked(target.x, target.y)) {
    return false
  }
  player.from = { x: player.tileX, y: player.tileY }
  player.tileX = target.x
  player.tileY = target.y
  player.progress = 0
  player.secondsPerTile = isRunning
    ? RUN_SECONDS_PER_TILE
    : WALK_SECONDS_PER_TILE
  return true
}

// Returns true on the frame a step completes.
export function advanceStep(
  player: PlayerState,
  deltaSeconds: number
): boolean {
  if (player.from === null) {
    return false
  }
  player.progress += deltaSeconds / player.secondsPerTile
  if (player.progress < 1) {
    return false
  }
  player.from = null
  player.progress = 0
  player.stepCount += 1
  return true
}

export function getRenderPosition(player: PlayerState): Point {
  if (player.from === null) {
    return { x: player.tileX, y: player.tileY }
  }
  const t = player.progress
  return {
    x: player.from.x + (player.tileX - player.from.x) * t,
    y: player.from.y + (player.tileY - player.from.y) * t,
  }
}

export function getAnimationFrame(player: PlayerState): number {
  if (player.from === null) {
    return 0
  }
  if (player.progress >= 0.5) {
    return 0
  }
  return player.stepCount % FRAMES_PER_STEP === 0 ? 1 : 3
}

export function teleport(
  player: PlayerState,
  point: Point,
  facing: Facing
): void {
  player.tileX = point.x
  player.tileY = point.y
  player.from = null
  player.progress = 0
  player.facing = facing
}
