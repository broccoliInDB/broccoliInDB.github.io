import { FRAMES, PALETTE, SPRITE_SIZE, type SpriteDirection } from './broccoli'

export type SpriteSheet = Record<SpriteDirection, HTMLCanvasElement[]>

function rasterize(rows: string[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = SPRITE_SIZE
  canvas.height = SPRITE_SIZE
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    return canvas
  }
  rows.forEach((row, y) => {
    ;[...row].forEach((char, x) => {
      const color = PALETTE[char]
      if (color === undefined) {
        return
      }
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    })
  })
  return canvas
}

export function createSpriteSheet(): SpriteSheet {
  return {
    down: FRAMES.down.map(rasterize),
    up: FRAMES.up.map(rasterize),
    side: FRAMES.side.map(rasterize),
  }
}
