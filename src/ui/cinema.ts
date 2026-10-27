import { getCinema, type CinemaData, type Scene } from '../content/cinema'
import { createElement } from './dom'

export interface CinemaCallbacks {
  onWalk: () => void
  onResume: () => void
}

// Inline markup → DOM. Content is fully author-controlled (no user input), so
// a small formatter to innerHTML is safe and keeps the scene copy readable.
function fmt(s: string): string {
  return s
    .replace(/\{em\}/g, '<span class="em">')
    .replace(/\{\/em\}/g, '</span>')
    .replace(/\{b\}/g, '<strong>')
    .replace(/\{\/b\}/g, '</strong>')
    .replace(/\n/g, '<br />')
}

function fmtGate(s: string): string {
  return s
    .replace(/\{ok\}/g, '<span class="ok">✓</span>')
    .replace(/\{k\}/g, '<span class="k">')
    .replace(/\{\/k\}/g, '</span>')
    .replace(/\{m\}/g, '<span class="m">')
    .replace(/\{\/m\}/g, '</span>')
    .replace(/\{ok-line\}/g, '<span class="ok">')
    .replace(/\{\/ok-line\}/g, '</span>')
}

function rich(tag: keyof HTMLElementTagNameMap, cls: string, markup: string): HTMLElement {
  const el = createElement(tag, undefined, cls)
  el.innerHTML = fmt(markup)
  return el
}

function anchor(label: string, href: string, cls: string): HTMLElement {
  const a = document.createElement('a')
  a.href = href
  a.textContent = label
  a.className = cls
  if (href.startsWith('http')) {
    a.rel = 'noopener'
    a.target = '_blank'
  }
  return a
}

function buildGate(d: CinemaData): HTMLElement {
  const box = createElement('div', undefined, 'cine-gate')
  const btn = createElement('button', d.gateButton, 'run')
  btn.setAttribute('type', 'button')
  const term = createElement('div', undefined, 'gterm')
  term.innerHTML = `<span class="m">${d.gateIntro}</span>`
  btn.addEventListener('click', () => {
    btn.setAttribute('disabled', 'true')
    term.innerHTML = ''
    let i = 0
    const tick = (): void => {
      if (i < d.gateSteps.length) {
        term.innerHTML += (i ? '<br />' : '') + fmtGate(d.gateSteps[i] ?? '')
        i++
        window.setTimeout(tick, 460)
      } else {
        window.setTimeout(() => {
          btn.removeAttribute('disabled')
          btn.textContent = d.gateButtonAgain
        }, 400)
      }
    }
    tick()
  })
  box.append(btn, term)
  return box
}

function buildScene(scene: Scene): HTMLElement {
  const sec = createElement('section', undefined, 'cine-scene')
  sec.appendChild(createElement('div', scene.year, 'yr'))
  const tag = createElement('span', undefined, `tag ${scene.state}`)
  tag.appendChild(createElement('span', undefined, 'pip'))
  tag.appendChild(document.createTextNode(scene.stateLabel))
  sec.appendChild(tag)
  sec.appendChild(rich('h2', '', scene.heading))
  scene.body.forEach((p) => sec.appendChild(rich('p', '', p)))
  if (scene.gate === true) {
    sec.appendChild(buildGate(getCinema()))
  }
  if (scene.result !== undefined) {
    const r = createElement('span', undefined, 'result')
    if (scene.resultNum !== undefined) {
      r.appendChild(createElement('span', scene.resultNum, 'n'))
    }
    r.appendChild(document.createTextNode(` ${scene.result}`))
    sec.appendChild(r)
  }
  return sec
}

type RGB = [number, number, number]
const RED: RGB = [255, 123, 114]
const GREEN: RGB = [126, 231, 135]
const NODE_COUNT = 54
const GRID_COLS = 9
const GRID_ROWS = 6

let dispose: (() => void) | null = null

export function renderCinema(root: HTMLElement, cbs: CinemaCallbacks): void {
  dispose?.()
  const d = getCinema()

  const canvas = createElement('canvas', undefined, 'cine-bg') as HTMLCanvasElement
  const veil = createElement('div', undefined, 'cine-veil')

  const top = createElement('div', undefined, 'cine-top')
  top.appendChild(createElement('span', 'broccoli.log', 'lab'))
  const bar = createElement('div', undefined, 'bar')
  const barFill = createElement('i')
  bar.appendChild(barFill)
  top.appendChild(bar)
  const stateLbl = createElement('span', d.stateChaos, 'state')
  top.appendChild(stateLbl)

  const main = createElement('main', undefined, 'cine-main')

  const hero = createElement('section', undefined, 'cine-scene cine-hero in')
  hero.appendChild(rich('h1', '', d.heroTitle))
  hero.appendChild(rich('p', 'sub', d.heroSub))
  hero.appendChild(createElement('p', d.heroWho, 'who'))
  const cue = createElement('div', undefined, 'scrollcue')
  cue.appendChild(createElement('span', undefined, 'dot'))
  cue.appendChild(document.createTextNode(` ${d.scrollCue}`))
  hero.appendChild(cue)
  main.appendChild(hero)

  d.scenes.forEach((scene) => main.appendChild(buildScene(scene)))

  const close = createElement('section', undefined, 'cine-scene cine-close')
  const ctag = createElement('span', undefined, 'tag order')
  ctag.appendChild(createElement('span', undefined, 'pip'))
  ctag.appendChild(document.createTextNode(d.closeStateLabel))
  close.appendChild(ctag)
  close.appendChild(rich('h2', '', d.closeHeading))
  close.appendChild(createElement('p', d.closeBody))
  const links = createElement('div', undefined, 'cine-links')
  const walk = createElement('button', d.ctaWalk, 'prime')
  walk.setAttribute('type', 'button')
  walk.addEventListener('click', cbs.onWalk)
  const resume = createElement('button', d.ctaResume, '')
  resume.setAttribute('type', 'button')
  resume.addEventListener('click', cbs.onResume)
  links.append(walk, resume, anchor(d.ctaContact, 'mailto:broccoliindb@gmail.com', ''))
  close.appendChild(links)
  main.appendChild(close)

  root.replaceChildren(canvas, veil, top, main)
  root.scrollTop = 0

  // ---- background: chaos (tangled red) → order (green grid) by scroll ----
  const ctx = canvas.getContext('2d')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let seed = 12345
  const rnd = (): number => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    cx: rnd(),
    cy: rnd(),
    ox: ((i % GRID_COLS) + 0.5) / GRID_COLS,
    oy: (Math.floor(i / GRID_COLS) + 0.75) / (GRID_ROWS + 1),
  }))
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
  const mix = (c1: RGB, c2: RGB, t: number): string =>
    `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`

  let dpr = 1
  let w = 0
  let h = 0
  const resize = (): void => {
    dpr = Math.min(2, window.devicePixelRatio || 1)
    w = canvas.width = window.innerWidth * dpr
    h = canvas.height = window.innerHeight * dpr
  }
  resize()

  let prog = 0
  let target = 0
  const onScroll = (): void => {
    const max = root.scrollHeight - root.clientHeight
    target = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0
    barFill.style.width = `${target * 100}%`
    if (target < 0.33) {
      stateLbl.textContent = d.stateChaos
      stateLbl.style.color = 'var(--cred)'
    } else if (target < 0.7) {
      stateLbl.textContent = d.stateTransition
      stateLbl.style.color = 'var(--camber)'
    } else {
      stateLbl.textContent = d.stateOrder
      stateLbl.style.color = 'var(--cgreen)'
    }
  }
  root.addEventListener('scroll', onScroll)
  window.addEventListener('resize', resize)
  onScroll()

  let rafId = 0
  let tick = 0
  const draw = (): void => {
    rafId = window.requestAnimationFrame(draw)
    if (root.hidden || ctx === null) {
      return
    }
    tick++
    prog += (target - prog) * 0.08
    const p = reduce ? target : prog
    ctx.clearRect(0, 0, w, h)
    const pts = nodes.map((n) => {
      const jx = (1 - p) * Math.sin(n.cx * 37 + tick / 26) * 0.012
      return { x: (lerp(n.cx, n.ox, p) + jx) * w, y: lerp(n.cy, n.oy, p) * h }
    })
    const col = mix(RED, GREEN, p)
    ctx.lineWidth = dpr * 0.65
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = col
    for (let i = 0; i < NODE_COUNT; i++) {
      const a = pts[i]
      const j = p < 0.5 ? pts[(i * 7 + 3) % NODE_COUNT] : pts[i % GRID_COLS === GRID_COLS - 1 ? i : i + 1]
      if (a === undefined || j === undefined) {
        continue
      }
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(j.x, j.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 0.9
    ctx.fillStyle = col
    pts.forEach((pt) => {
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, dpr * 1.6, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
  }
  rafId = window.requestAnimationFrame(draw)

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
        }
      })
    },
    { root, threshold: 0.25 }
  )
  main.querySelectorAll('.cine-scene').forEach((s) => io.observe(s))

  dispose = (): void => {
    window.cancelAnimationFrame(rafId)
    root.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', resize)
    io.disconnect()
  }
}
