import { LABEL_FONT_SIZE, TILE_SIZE, TILESET_COLUMNS } from '../config'
import { type SpriteSheet } from '../sprites/raster'
import { EMPTY, getTile, type World } from '../world/map'
import { type Point } from '../world/layout'
import { drawObjective, type Objective } from './objective-marker'
import {
  getAnimationFrame,
  getRenderPosition,
  type PlayerState,
} from './player'

export interface Camera {
  x: number
  y: number
  width: number
  height: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function computeCamera(
  world: World,
  focus: Point,
  viewWidth: number,
  viewHeight: number
): Camera {
  const worldWidthPx = world.width * TILE_SIZE
  const worldHeightPx = world.height * TILE_SIZE
  const centerX = focus.x * TILE_SIZE + TILE_SIZE / 2
  const centerY = focus.y * TILE_SIZE + TILE_SIZE / 2
  return {
    x: Math.round(clamp(centerX - viewWidth / 2, 0, worldWidthPx - viewWidth)),
    y: Math.round(
      clamp(centerY - viewHeight / 2, 0, worldHeightPx - viewHeight)
    ),
    width: viewWidth,
    height: viewHeight,
  }
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  tileset: CanvasImageSource,
  tile: number,
  screenX: number,
  screenY: number
): void {
  if (tile === EMPTY) {
    return
  }
  const sourceX = (tile % TILESET_COLUMNS) * TILE_SIZE
  const sourceY = Math.floor(tile / TILESET_COLUMNS) * TILE_SIZE
  ctx.drawImage(
    tileset,
    sourceX,
    sourceY,
    TILE_SIZE,
    TILE_SIZE,
    screenX,
    screenY,
    TILE_SIZE,
    TILE_SIZE
  )
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  tileset: CanvasImageSource,
  world: World,
  layer: number[],
  camera: Camera
): void {
  const firstX = Math.floor(camera.x / TILE_SIZE)
  const firstY = Math.floor(camera.y / TILE_SIZE)
  const lastX = Math.min(
    world.width - 1,
    Math.ceil((camera.x + camera.width) / TILE_SIZE)
  )
  const lastY = Math.min(
    world.height - 1,
    Math.ceil((camera.y + camera.height) / TILE_SIZE)
  )
  for (let y = firstY; y <= lastY; y++) {
    for (let x = firstX; x <= lastX; x++) {
      drawTile(
        ctx,
        tileset,
        getTile(layer, x, y),
        x * TILE_SIZE - camera.x,
        y * TILE_SIZE - camera.y
      )
    }
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  sprites: SpriteSheet,
  player: PlayerState,
  camera: Camera
): void {
  const position = getRenderPosition(player)
  const screenX = Math.round(position.x * TILE_SIZE - camera.x)
  const screenY = Math.round(position.y * TILE_SIZE - camera.y)
  const frameIndex = getAnimationFrame(player)
  const direction =
    player.facing === 'left' || player.facing === 'right'
      ? 'side'
      : player.facing
  const frame = sprites[direction][frameIndex]
  if (frame === undefined) {
    return
  }
  if (player.facing !== 'left') {
    ctx.drawImage(frame, screenX, screenY)
    return
  }
  ctx.save()
  ctx.scale(-1, 1)
  ctx.drawImage(frame, -screenX - TILE_SIZE, screenY)
  ctx.restore()
}

export interface RenderAssets {
  tileset: CanvasImageSource
  sprites: SpriteSheet
}

export interface Label {
  text: string
  centerX: number
  topY: number
}

const LABEL_FONT = `${LABEL_FONT_SIZE}px Galmuri9, monospace`
const LABEL_PADDING_X = 2
const LABEL_HEIGHT = 12

function drawLabel(
  ctx: CanvasRenderingContext2D,
  label: Label,
  camera: Camera
): void {
  ctx.font = LABEL_FONT
  const width =
    Math.ceil(ctx.measureText(label.text).width) + LABEL_PADDING_X * 2
  const x = Math.round(label.centerX * TILE_SIZE - camera.x - width / 2)
  const y = Math.round(label.topY * TILE_SIZE - camera.y)
  if (x + width < 0 || x > camera.width || y > camera.height) {
    return
  }
  ctx.fillStyle = '#2b1d2e'
  ctx.fillRect(x - 1, y - 1, width + 2, LABEL_HEIGHT + 2)
  ctx.fillStyle = '#fbf7ef'
  ctx.fillRect(x, y, width, LABEL_HEIGHT)
  ctx.fillStyle = '#2b1d2e'
  ctx.textBaseline = 'top'
  ctx.fillText(label.text, x + LABEL_PADDING_X, y + 1)
}

function drawPrompt(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  camera: Camera
): void {
  const position = getRenderPosition(player)
  const x = Math.round(position.x * TILE_SIZE - camera.x) + 10
  const y = Math.round(position.y * TILE_SIZE - camera.y) - 9
  ctx.fillStyle = '#2b1d2e'
  ctx.fillRect(x - 1, y - 1, 11, 11)
  ctx.fillStyle = '#5fb34a'
  ctx.fillRect(x, y, 9, 9)
  ctx.fillStyle = '#12301a'
  ctx.font = LABEL_FONT
  ctx.textBaseline = 'top'
  ctx.fillText('!', x + 3, y - 1)
}

export { type Objective }

export interface FrameExtras {
  labels: Label[]
  canInteract: boolean
  objective: Objective | undefined
  elapsedSeconds: number
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  assets: RenderAssets,
  world: World,
  player: PlayerState,
  camera: Camera,
  extras: FrameExtras
): void {
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, camera.width, camera.height)
  drawLayer(ctx, assets.tileset, world, world.ground, camera)
  drawLayer(ctx, assets.tileset, world, world.deco, camera)
  drawPlayer(ctx, assets.sprites, player, camera)
  extras.labels.forEach((label) => drawLabel(ctx, label, camera))
  if (extras.objective !== undefined) {
    drawObjective(ctx, extras.objective, camera, extras.elapsedSeconds)
  }
  if (extras.canInteract) {
    drawPrompt(ctx, player, camera)
  }
}
