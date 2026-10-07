import { LABEL_FONT_SIZE, TILE_SIZE } from '../config'
import { type Point } from '../world/layout'

export interface Objective {
  target: Point
  name: string
}

interface MarkerCamera {
  x: number
  y: number
  width: number
  height: number
}

const MARKER_FONT = `${LABEL_FONT_SIZE}px Galmuri9, monospace`
const EDGE_MARGIN = 6
const BOB_PIXELS = 2
const BOB_SPEED = 6
const ARROW_HALF = 4
const ARROW_LENGTH = 5
const CHIP_PADDING_X = 3
const CHIP_HEIGHT = LABEL_FONT_SIZE + 2
const INK = '#2b1d2e'
const MARKER_FILL = '#ffd23f'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function drawDownArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.fillStyle = INK
  ctx.beginPath()
  ctx.moveTo(x - ARROW_HALF - 1, y - 1)
  ctx.lineTo(x + ARROW_HALF + 1, y - 1)
  ctx.lineTo(x, y + ARROW_LENGTH + 1)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = MARKER_FILL
  ctx.beginPath()
  ctx.moveTo(x - ARROW_HALF, y)
  ctx.lineTo(x + ARROW_HALF, y)
  ctx.lineTo(x, y + ARROW_LENGTH)
  ctx.closePath()
  ctx.fill()
}

function drawChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  topY: number,
  maxWidth: number
): void {
  ctx.font = MARKER_FONT
  const width = Math.ceil(ctx.measureText(text).width) + CHIP_PADDING_X * 2
  const x = Math.round(clamp(centerX - width / 2, 1, maxWidth - width - 1))
  const y = Math.round(topY)
  ctx.fillStyle = INK
  ctx.fillRect(x - 1, y - 1, width + 2, CHIP_HEIGHT + 2)
  ctx.fillStyle = MARKER_FILL
  ctx.fillRect(x, y, width, CHIP_HEIGHT)
  ctx.fillStyle = INK
  ctx.textBaseline = 'top'
  ctx.fillText(text, x + CHIP_PADDING_X, y + 1)
}

// Points the way to the next recommended place. On screen it bobs above
// the door; off screen it sticks to the nearest edge with the place name.
export function drawObjective(
  ctx: CanvasRenderingContext2D,
  objective: Objective,
  camera: MarkerCamera,
  elapsedSeconds: number
): void {
  const bob = Math.round(Math.sin(elapsedSeconds * BOB_SPEED) * BOB_PIXELS)
  const centerX = (objective.target.x + 0.5) * TILE_SIZE - camera.x
  const topY = objective.target.y * TILE_SIZE - camera.y
  const isOnScreen =
    centerX > EDGE_MARGIN &&
    centerX < camera.width - EDGE_MARGIN &&
    topY > EDGE_MARGIN + ARROW_LENGTH &&
    topY < camera.height - EDGE_MARGIN
  if (isOnScreen) {
    drawDownArrow(ctx, Math.round(centerX), topY - ARROW_LENGTH - 3 + bob)
    return
  }
  const isLeft = centerX <= EDGE_MARGIN
  const isRight = centerX >= camera.width - EDGE_MARGIN
  const isBelow = !isLeft && !isRight && topY >= camera.height - EDGE_MARGIN
  const isAbove = !isLeft && !isRight && !isBelow
  const text = isLeft
    ? `◀ ${objective.name}`
    : isRight
      ? `${objective.name} ▶`
      : `${objective.name} ${isBelow ? '▼' : '▲'}`
  const anchorX = isLeft ? 0 : isRight ? camera.width : centerX
  const sideY = clamp(topY, EDGE_MARGIN, camera.height / 2)
  const chipY = isBelow
    ? camera.height - CHIP_HEIGHT - EDGE_MARGIN
    : isAbove
      ? EDGE_MARGIN
      : sideY
  drawChip(ctx, text, anchorX, chipY + bob, camera.width)
}
