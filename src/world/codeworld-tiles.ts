import { TILE_SIZE, TILESET_COLUMNS } from '../config'

// Generates a replacement tileset canvas in the IDE/terminal palette so the
// whole world re-skins without touching map data, layout, or the renderer.
// Each index maps to the same slot the Kenney sheet used (see world/tiles.ts),
// so the existing tile indices keep working — only the pixels change.

const S = TILE_SIZE // 16
const COLS = TILESET_COLUMNS // 12
const ROWS = 10 // covers up to index 117

const C = {
  floor: '#0d1117',
  floorDot: '#181f29',
  bus: '#12202c',
  busLine: '#2f6d9e',
  busGlow: '#57a6e0',
  wall: '#161b22',
  wallHi: '#242c38',
  win: '#121820',
  winEdge: '#2a313c',
  pane: '#172a3a',
  paneEdge: '#315571',
  door: '#0c2418',
  doorGlow: '#7ee787',
  ink: '#aab4c0',
  dim: '#3a434f',
  amber: '#e3b341',
  green: '#7ee787',
  blue: '#6cb6ff',
  red: '#d66a5a',
} as const

type Ctx = CanvasRenderingContext2D

function floorBase(ctx: Ctx, ox: number, oy: number): void {
  ctx.fillStyle = C.floor
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.floorDot
  ctx.fillRect(ox + 3, oy + 3, 1, 1)
  ctx.fillRect(ox + 11, oy + 10, 1, 1)
}

// faint deco glyphs scattered on the ground (tuft / flower / sprout / etc.)
function glyph(ctx: Ctx, ox: number, oy: number, color: string): void {
  floorBase(ctx, ox, oy)
  ctx.fillStyle = color
  ctx.fillRect(ox + 7, oy + 8, 1, 3)
  ctx.fillRect(ox + 6, oy + 9, 3, 1)
}

// server-rack / monolith — the world border reads as infrastructure walls.
function rack(ctx: Ctx, ox: number, oy: number, led: string): void {
  floorBase(ctx, ox, oy)
  ctx.fillStyle = C.wall
  ctx.fillRect(ox + 1, oy + 1, S - 2, S - 1)
  ctx.fillStyle = C.wallHi
  ctx.fillRect(ox + 1, oy + 1, S - 2, 1)
  ctx.fillStyle = C.dim
  for (let y = 4; y < S - 1; y += 3) ctx.fillRect(ox + 3, oy + y, S - 6, 1)
  ctx.fillStyle = led
  ctx.fillRect(ox + S - 4, oy + 3, 2, 2)
}

// the commit-graph "bus": kind picks top / middle (lit wire) / bottom edge.
function bus(
  ctx: Ctx,
  ox: number,
  oy: number,
  kind: 'top' | 'mid' | 'bottom',
  leftCap: boolean
): void {
  ctx.fillStyle = C.floor
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.bus
  if (kind === 'top') ctx.fillRect(ox, oy + 5, S, S - 5)
  else if (kind === 'bottom') ctx.fillRect(ox, oy, S, S - 5)
  else ctx.fillRect(ox, oy, S, S)
  if (kind === 'top') {
    ctx.fillStyle = C.busLine
    ctx.fillRect(ox, oy + 5, S, 1)
  } else if (kind === 'bottom') {
    ctx.fillStyle = C.busLine
    ctx.fillRect(ox, oy + S - 6, S, 1)
  } else {
    ctx.fillStyle = C.busLine
    ctx.fillRect(ox, oy + 7, S, 3)
    ctx.fillStyle = C.busGlow
    ctx.fillRect(ox, oy + 8, S, 1)
  }
  if (leftCap) {
    ctx.fillStyle = C.busGlow
    ctx.fillRect(ox + 1, oy, 1, S)
    if (kind === 'mid') ctx.fillRect(ox + 1, oy + 6, 3, 3)
  }
}

type Role = 'left' | 'mid' | 'right'

function titlebar(ctx: Ctx, ox: number, oy: number, role: Role): void {
  ctx.fillStyle = C.floor
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.wall
  ctx.fillRect(ox, oy + 3, S, S - 3)
  ctx.fillStyle = C.wallHi
  ctx.fillRect(ox, oy + 3, S, 1)
  if (role === 'left') {
    ctx.fillStyle = C.winEdge
    ctx.fillRect(ox, oy + 3, 1, S - 3)
    ;[C.red, C.amber, C.green].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(ox + 3 + i * 3, oy + 7, 2, 2)
    })
  }
  if (role === 'right') {
    ctx.fillStyle = C.winEdge
    ctx.fillRect(ox + S - 1, oy + 3, 1, S - 3)
  }
}

function bodyRow(ctx: Ctx, ox: number, oy: number, role: Role, lit: boolean): void {
  ctx.fillStyle = C.win
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.winEdge
  if (role === 'left') ctx.fillRect(ox, oy, 1, S)
  if (role === 'right') ctx.fillRect(ox + S - 1, oy, 1, S)
  // a faint line of "code"
  ctx.fillStyle = lit ? C.paneEdge : C.dim
  const w = role === 'left' ? 7 : role === 'right' ? 8 : 11
  const x = role === 'left' ? ox + 4 : ox + 2
  ctx.fillRect(x, oy + 6, w, 1)
  if (lit) {
    ctx.fillStyle = C.blue
    ctx.fillRect(x, oy + 6, 3, 1)
  }
}

function pane(ctx: Ctx, ox: number, oy: number): void {
  ctx.fillStyle = C.win
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.pane
  ctx.fillRect(ox + 2, oy + 1, S - 4, S - 3)
  ctx.fillStyle = C.paneEdge
  ctx.fillRect(ox + 4, oy + 4, 8, 1)
  ctx.fillRect(ox + 4, oy + 7, 5, 1)
}

function door(ctx: Ctx, ox: number, oy: number): void {
  ctx.fillStyle = C.win
  ctx.fillRect(ox, oy, S, S)
  ctx.fillStyle = C.door
  ctx.fillRect(ox + 3, oy + 2, S - 6, S - 2)
  ctx.fillStyle = C.doorGlow
  // ">_" prompt
  ctx.fillRect(ox + 5, oy + 6, 1, 1)
  ctx.fillRect(ox + 6, oy + 7, 1, 1)
  ctx.fillRect(ox + 5, oy + 8, 1, 1)
  ctx.fillRect(ox + 8, oy + 9, 3, 1)
}

function sign(ctx: Ctx, ox: number, oy: number): void {
  floorBase(ctx, ox, oy)
  ctx.fillStyle = C.dim
  ctx.fillRect(ox + 7, oy + 9, 2, 5)
  ctx.fillStyle = C.wall
  ctx.fillRect(ox + 2, oy + 2, S - 4, 8)
  ctx.fillStyle = C.winEdge
  ctx.fillRect(ox + 2, oy + 2, S - 4, 1)
  ctx.fillStyle = C.green
  ctx.fillRect(ox + 4, oy + 5, 6, 1)
  ctx.fillRect(ox + 4, oy + 7, 4, 1)
}

function pad(ctx: Ctx, ox: number, oy: number): void {
  floorBase(ctx, ox, oy)
  ctx.strokeStyle = C.green
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(ox + S / 2, oy + S / 2, 5, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = C.green
  ctx.fillRect(ox + S / 2 - 1, oy + S / 2 - 1, 2, 2)
}

function rail(ctx: Ctx, ox: number, oy: number): void {
  floorBase(ctx, ox, oy)
  ctx.fillStyle = C.dim
  ctx.fillRect(ox, oy + 8, S, 1)
  ctx.fillRect(ox + 3, oy + 6, 1, 4)
  ctx.fillRect(ox + 11, oy + 6, 1, 4)
}

function port(ctx: Ctx, ox: number, oy: number): void {
  floorBase(ctx, ox, oy)
  ctx.fillStyle = C.wall
  ctx.fillRect(ox + 3, oy + 3, S - 6, S - 6)
  ctx.fillStyle = C.floor
  ctx.fillRect(ox + 5, oy + 5, S - 10, S - 10)
  ctx.fillStyle = C.blue
  ctx.fillRect(ox + 6, oy + 6, 1, 1)
}

function key(ctx: Ctx, ox: number, oy: number): void {
  floorBase(ctx, ox, oy)
  ctx.strokeStyle = C.amber
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(ox + 6, oy + 7, 2.5, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = C.amber
  ctx.fillRect(ox + 8, oy + 7, 5, 1)
  ctx.fillRect(ox + 11, oy + 7, 1, 3)
  ctx.fillRect(ox + 9, oy + 7, 1, 2)
}

const ROLE_AT = (i: number, left: number[], mid: number[]): Role =>
  left.includes(i) ? 'left' : mid.includes(i) ? 'mid' : 'right'

// Building tile groups (from world/tiles.ts BUILDING_STYLES).
const TITLE_LEFT = [48, 52]
const TITLE_MID = [49, 53]
const BODYTOP_LEFT = [60, 64]
const BODYTOP_MID = [61, 65]
const BODYMID_LEFT = [72, 76]
const BODYMID_MID = [73, 77]

export function createTileset(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = COLS * S
  canvas.height = ROWS * S
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    return canvas
  }
  ctx.imageSmoothingEnabled = false

  const at = (i: number): [number, number] => [
    (i % COLS) * S,
    Math.floor(i / COLS) * S,
  ]
  const draw = (i: number, fn: (ox: number, oy: number) => void): void => {
    const [ox, oy] = at(i)
    fn(ox, oy)
  }

  // ground
  draw(0, (x, y) => floorBase(ctx, x, y)) // grass
  draw(1, (x, y) => glyph(ctx, x, y, C.dim)) // tuft
  draw(2, (x, y) => glyph(ctx, x, y, C.green)) // flower

  // border "infrastructure" (trees → racks)
  draw(5, (x, y) => rack(ctx, x, y, C.blue))
  draw(28, (x, y) => rack(ctx, x, y, C.green))
  draw(27, (x, y) => rack(ctx, x, y, C.amber))

  // scattered deco glyphs
  ;[17, 29, 94].forEach((i) => draw(i, (x, y) => glyph(ctx, x, y, C.dim)))

  // commit-graph bus (path): 12/13/14 top, 24/25/26 mid, 36/37/38 bottom
  draw(12, (x, y) => bus(ctx, x, y, 'top', true))
  draw(13, (x, y) => bus(ctx, x, y, 'top', false))
  draw(14, (x, y) => bus(ctx, x, y, 'top', false))
  draw(24, (x, y) => bus(ctx, x, y, 'mid', true))
  draw(25, (x, y) => bus(ctx, x, y, 'mid', false))
  draw(26, (x, y) => bus(ctx, x, y, 'mid', false))
  draw(36, (x, y) => bus(ctx, x, y, 'bottom', true))
  draw(37, (x, y) => bus(ctx, x, y, 'bottom', false))
  draw(38, (x, y) => bus(ctx, x, y, 'bottom', false))

  // props
  draw(43, (x, y) => pad(ctx, x, y)) // warp pad
  draw(83, (x, y) => sign(ctx, x, y)) // sign
  ;[80, 81, 82].forEach((i) => draw(i, (x, y) => rail(ctx, x, y)))
  draw(104, (x, y) => port(ctx, x, y)) // well
  draw(117, (x, y) => key(ctx, x, y)) // trust.key

  // building windows
  ;[48, 49, 50, 52, 53, 54].forEach((i) =>
    draw(i, (x, y) => titlebar(ctx, x, y, ROLE_AT(i, TITLE_LEFT, TITLE_MID)))
  )
  ;[60, 61, 62, 64, 65, 66].forEach((i) =>
    draw(i, (x, y) =>
      bodyRow(ctx, x, y, ROLE_AT(i, BODYTOP_LEFT, BODYTOP_MID), false)
    )
  )
  ;[72, 73, 75, 76, 77, 79].forEach((i) =>
    draw(i, (x, y) =>
      bodyRow(ctx, x, y, ROLE_AT(i, BODYMID_LEFT, BODYMID_MID), true)
    )
  )
  ;[84, 88].forEach((i) => draw(i, (x, y) => pane(ctx, x, y)))
  ;[85, 89].forEach((i) => draw(i, (x, y) => door(ctx, x, y)))

  return canvas
}
