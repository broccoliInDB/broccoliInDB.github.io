// Generates profile/banner.svg — the animated strip shown on the GitHub
// profile README, where JavaScript cannot run. Pure SVG + CSS animation.
import { writeFileSync } from 'node:fs'
import { FRAMES, PALETTE, SPRITE_SIZE } from '../src/sprites/broccoli'

const WIDTH = 240
const HEIGHT = 56
const PATH_TOP = 18
const PATH_BOTTOM = 42
const WALK_SECONDS = 14
const FRAME_SECONDS = 0.12
const STEP_FRAMES = 4
const POSTS = [
  { x: 26, tag: 'v0.1' },
  { x: 82, tag: 'v1.5' },
  { x: 138, tag: 'v1.9' },
  { x: 196, tag: 'HEAD' },
]

function toRects(rows: string[]): string {
  const rects: string[] = []
  rows.forEach((row, y) => {
    let runStart = 0
    for (let x = 1; x <= row.length; x++) {
      const isSameColor = x < row.length && row[x] === row[runStart]
      if (isSameColor) {
        continue
      }
      const color = PALETTE[row[runStart] ?? '.']
      if (color !== undefined) {
        rects.push(
          `<rect x="${runStart}" y="${y}" width="${x - runStart}" height="1" fill="${color}"/>`
        )
      }
      runStart = x
    }
  })
  return rects.join('')
}

function drawTufts(): string {
  const tufts: string[] = []
  for (let x = 6; x < WIDTH; x += 23) {
    tufts.push(
      `<rect x="${x}" y="${6 + (x % 7)}" width="1" height="2" fill="#5c9e4f"/>`
    )
    tufts.push(
      `<rect x="${x + 11}" y="${46 + (x % 5)}" width="1" height="2" fill="#5c9e4f"/>`
    )
  }
  for (let x = 3; x < WIDTH; x += 9) {
    tufts.push(
      `<rect x="${x}" y="${PATH_TOP + 1}" width="1" height="1" fill="#f4c99a"/>`
    )
    tufts.push(
      `<rect x="${x + 4}" y="${PATH_BOTTOM - 2}" width="1" height="1" fill="#f4c99a"/>`
    )
  }
  return tufts.join('')
}

function drawPosts(): string {
  return POSTS.map(
    ({ x, tag }) =>
      `<g><rect x="${x - 1}" y="4" width="22" height="9" fill="#2b1d2e"/>` +
      `<rect x="${x}" y="5" width="20" height="7" fill="#c8874f"/>` +
      `<rect x="${x + 9}" y="13" width="2" height="5" fill="#2b1d2e"/>` +
      `<text x="${x + 10}" y="10.6" font-size="5.2" text-anchor="middle" fill="#2b1d2e" font-family="ui-monospace,Menlo,monospace" font-weight="700">${tag}</text></g>`
  ).join('')
}

function drawWalker(): string {
  const frames = FRAMES.side
    .slice(0, STEP_FRAMES)
    .map(
      (frame, index) =>
        `<g class="f" style="animation-delay:-${((STEP_FRAMES - index) * FRAME_SECONDS).toFixed(2)}s">${toRects(frame)}</g>`
    )
    .join('')
  return `<g class="walker"><g transform="scale(-1 1) translate(-${SPRITE_SIZE} 0)">${frames}</g></g>`
}

const style = `
.f{opacity:0;animation:step ${(FRAME_SECONDS * STEP_FRAMES).toFixed(2)}s steps(1) infinite}
@keyframes step{0%{opacity:1}25%,100%{opacity:0}}
.walker{animation:walk ${WALK_SECONDS}s linear infinite}
@keyframes walk{from{transform:translate(${WIDTH + 4}px,${PATH_TOP + 4}px)}to{transform:translate(-${SPRITE_SIZE + 4}px,${PATH_TOP + 4}px)}}
@media (prefers-reduced-motion:reduce){.walker{animation:none;transform:translate(${POSTS[3]?.x ?? 0}px,${PATH_TOP + 4}px)}.f{animation:none}.f:first-child{opacity:1}}
`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH * 4}" height="${HEIGHT * 4}" shape-rendering="crispEdges" role="img" aria-label="broccoli walking from HEAD back through v1.9, v1.5 and v0.1">
<title>broccoli.log — walking back through the commit log</title>
<defs><linearGradient id="past" x1="0" x2="1"><stop offset="0" stop-color="#9a9a9a" stop-opacity="0.75"/><stop offset="0.72" stop-color="#9a9a9a" stop-opacity="0"/></linearGradient></defs>
<style>${style}</style>
<rect width="${WIDTH}" height="${HEIGHT}" fill="#7ec26a"/>
<rect y="${PATH_TOP}" width="${WIDTH}" height="${PATH_BOTTOM - PATH_TOP}" fill="#e8a467"/>
<rect y="${PATH_TOP}" width="${WIDTH}" height="1" fill="#5c9e4f"/>
<rect y="${PATH_BOTTOM - 1}" width="${WIDTH}" height="1" fill="#5c9e4f"/>
${drawTufts()}
${drawPosts()}
${drawWalker()}
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#past)" style="mix-blend-mode:saturation"/>
</svg>
`

writeFileSync(new URL('../profile/banner.svg', import.meta.url), svg)
console.log(`banner.svg written (${svg.length} bytes)`)
