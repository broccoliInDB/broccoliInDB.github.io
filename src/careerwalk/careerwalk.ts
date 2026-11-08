import { CW_END, CW_ERAS, type CwEra, type CwItem } from '../content/careerwalk'

// A side-scrolling decision walk through broccoli's career. Each era node opens
// a dark "PR panel": you make his real engineering choice. Right choices earn
// rail items; wrong ones add debt that makes the broccoli heavier (lower jumps),
// litters the path with bugs, and — at the end — blocks ./gate.sh from merging.
// Self-contained: owns its own canvas, DOM overlay and input, mounted into a
// root element and torn down on exit so re-entry always restarts fresh.

interface Part {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  col: string
}
interface Bug {
  x: number
  y: number
  w: number
  h: number
  hit: boolean
}
interface Platform {
  x: number
  w: number
  y: number
  ground?: boolean
}

const G = 120
const SEG = 640
const START_X = 170
const GRAV = 0.78
const MOVE = 4.2
const BASE_JUMP = 14.5
const MAX_FALL = 20

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
function mix(c1: number[], c2: number[], t: number): string {
  const r = Math.round(lerp(c1[0] ?? 0, c2[0] ?? 0, t))
  const g = Math.round(lerp(c1[1] ?? 0, c2[1] ?? 0, t))
  const b = Math.round(lerp(c1[2] ?? 0, c2[2] ?? 0, t))
  return `rgb(${r},${g},${b})`
}

export class CareerWalk {
  private readonly onExit: () => void
  private root: HTMLElement | null = null
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private sheet!: HTMLElement
  private modal!: HTMLElement
  private invEl!: HTMLElement
  private debtEl!: HTMLElement
  private eraEl!: HTMLElement
  private progEl!: HTMLElement
  private tipEl!: HTMLElement

  private W = 0
  private H = 0
  private readonly DPR = Math.min(window.devicePixelRatio || 1, 2)

  private readonly nodeX: number[] = []
  private gateX = 0
  private worldEnd = 0
  private platforms: Platform[] = []

  private readonly p = {
    x: START_X,
    y: 0,
    vx: 0,
    vy: 0,
    w: 26,
    h: 30,
    onGround: false,
    face: 1,
    sq: 1,
    anim: 0,
  }
  private coyote = 0
  private buffer = 0
  private holdJump = false
  private readonly keys: Record<string, boolean> = {}

  private started = false
  private ended = false
  private modalOpen = false
  private idx = 0
  private debt = 0
  private mood = 0
  private readonly items: Array<CwItem & { good: boolean }> = []
  private readonly bugs: Bug[] = []
  private readonly parts: Part[] = []

  private pendingEra: CwEra | null = null
  private chosen = false
  private raf = 0
  private last = 0

  private readonly onResize = (): void => this.resize()
  private readonly onKeyDown = (e: KeyboardEvent): void => this.keyDown(e)
  private readonly onKeyUp = (e: KeyboardEvent): void => this.keyUp(e)

  constructor(onExit: () => void) {
    this.onExit = onExit
  }

  start(root: HTMLElement): void {
    this.root = root
    this.resetState()
    root.innerHTML = this.skeleton()
    this.canvas = root.querySelector('.cw-canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.sheet = root.querySelector('.cw-sheet') as HTMLElement
    this.modal = root.querySelector('.cw-modal') as HTMLElement
    this.invEl = root.querySelector('.cw-inv') as HTMLElement
    this.debtEl = root.querySelector('.cw-debt b') as HTMLElement
    this.eraEl = root.querySelector('.cw-era') as HTMLElement
    this.progEl = root.querySelector('.cw-prog') as HTMLElement
    this.tipEl = root.querySelector('.cw-tip') as HTMLElement
    ;(root.querySelector('.cw-exit') as HTMLElement).onclick = (): void =>
      this.onExit()
    ;(root.querySelector('.cw-rep') as HTMLElement).onclick = (): void => {
      this.start(root)
    }

    this.resize()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    this.last = performance.now()
    this.loop(this.last)
  }

  stop(): void {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    if (this.root !== null) {
      this.root.innerHTML = ''
    }
    this.root = null
  }

  private resetState(): void {
    this.nodeX.length = 0
    CW_ERAS.forEach((_, i) => this.nodeX.push(START_X + 120 + SEG * i))
    this.gateX = (this.nodeX[this.nodeX.length - 1] ?? 0) + 420
    this.worldEnd = this.gateX + 240
    this.platforms = [{ x: -400, w: this.worldEnd + 800, y: 0, ground: true }]
    this.nodeX.forEach((x) => {
      this.platforms.push({ x: x - 150, w: 104, y: 64 })
      this.platforms.push({ x: x - 14, w: 120, y: 134 })
    })
    Object.assign(this.p, {
      x: START_X,
      y: 0,
      vx: 0,
      vy: 0,
      onGround: false,
      face: 1,
      sq: 1,
      anim: 0,
    })
    this.coyote = 0
    this.buffer = 0
    this.holdJump = false
    for (const k of Object.keys(this.keys)) this.keys[k] = false
    this.started = false
    this.ended = false
    this.modalOpen = false
    this.idx = 0
    this.debt = 0
    this.mood = 0
    this.items.length = 0
    this.bugs.length = 0
    this.parts.length = 0
    this.pendingEra = null
    this.chosen = false
  }

  private skeleton(): string {
    const n = CW_ERAS.length
    return (
      '<canvas class="cw-canvas"></canvas>' +
      '<div class="cw-crt"></div>' +
      '<button class="cw-exit" type="button" aria-label="나가기">✕</button>' +
      '<div class="cw-hud">' +
      '<span class="cw-tag">🥦 <b>broccoli.log</b> — 커밋 로그를 걷는 10년</span>' +
      `<span class="cw-tag"><span class="cw-era">2015 · 시작</span>&nbsp; <span class="cw-prog">0 / ${n}</span></span>` +
      '</div>' +
      '<div class="cw-inv"></div>' +
      '<div class="cw-debt">부채 <b>0</b></div>' +
      '<div class="cw-tip cw-center"><div class="cw-t1">▶ 커밋 로그를 걸어보기</div>' +
      "<div class=\"cw-t2\">→ 로 달리고 Space 로 점프 · 막마다 그때의 '선택'을 직접 하게 됨</div></div>" +
      '<div class="cw-modal"><div class="cw-sheet"></div></div>' +
      '<div class="cw-end cw-center"><div class="cw-big"></div><div class="cw-sub"></div>' +
      `<button class="cw-rep" type="button">${CW_END.replay}</button></div>` +
      '<div class="cw-hint">←→ 이동 · Space 점프 · 선택 1 2 또는 클릭 · Esc 나가기</div>'
    )
  }

  // ---- input ----
  private keyDown(e: KeyboardEvent): void {
    const k = e.key
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'Spacebar'].includes(k)) {
      e.preventDefault()
    }
    if (k === 'Escape') {
      if (this.modalOpen && this.chosen) this.contStep()
      else this.onExit()
      return
    }
    if (this.modalOpen) {
      if (k === '1' || k === '2') this.pickByKey(Number(k) - 1)
      else if (k === 'Enter' || k === ' ' || k === 'Spacebar') this.contStep()
      return
    }
    this.keys[k] = true
    if (!this.started) {
      this.started = true
      this.tipEl.style.opacity = '0'
    }
    if (k === ' ' || k === 'Spacebar' || k === 'ArrowUp') {
      this.buffer = 8
      this.holdJump = true
    }
  }
  private keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false
    if (['ArrowUp', ' ', 'Spacebar'].includes(e.key)) this.holdJump = false
  }

  // ---- decision panel ----
  private openModal(era: CwEra): void {
    this.modalOpen = true
    this.pendingEra = era
    this.chosen = false
    const ctxRows = era.ctx
      .map(
        (r) =>
          `<div class="cw-row"><span class="cw-k">${r[0]}</span><span class="cw-v">${r[1]}</span></div>`
      )
      .join('')
    const codeBlk =
      era.code !== undefined ? `<div class="cw-code">${era.code}</div>` : ''
    const warnBlk =
      era.warn !== undefined
        ? `<div class="cw-warn"><span>⚠</span><span>${era.warn}</span></div>`
        : ''
    const opts = era.options
      .map(
        (o, i) =>
          `<button class="cw-opt" type="button" data-i="${i}"><span class="cw-n">${i + 1}</span><span>${o.text}</span><span class="cw-ar">↵</span></button>`
      )
      .join('')
    this.sheet.innerHTML =
      `<div class="cw-hd"><span class="cw-yr">▌ ${era.label}</span><span class="cw-co">${era.co}</span></div>` +
      `<div class="cw-sbody"><p class="cw-lbl">상황 · context</p>` +
      codeBlk +
      `<div class="cw-ctx">${ctxRows}</div>` +
      warnBlk +
      `<p class="cw-lbl cw-q">어떻게 할까</p>${opts}</div>`
    this.sheet
      .querySelectorAll<HTMLButtonElement>('.cw-opt')
      .forEach((b) => (b.onclick = (): void => this.pick(Number(b.dataset.i))))
    this.sheet.scrollTop = 0
    this.modal.classList.add('on')
  }

  private pickByKey(i: number): void {
    if (this.pendingEra !== null && i < this.pendingEra.options.length && !this.chosen) {
      this.pick(i)
    }
  }

  private pick(i: number): void {
    if (this.pendingEra === null) return
    const o = this.pendingEra.options[i]
    if (o === undefined) return
    this.chosen = true
    const good = o.kind === 'right'
    this.items.push({ ...o.item, good })
    this.renderInv()
    if (good) {
      this.mood = Math.min(this.mood + 1, CW_ERAS.length)
      this.burst(this.p.x + this.p.w / 2, this.p.y + 30, 14, '#7ee660')
      this.clearNearBugs()
    } else {
      this.debt++
      this.mood = Math.max(this.mood - 1, -CW_ERAS.length)
      this.debtEl.textContent = String(this.debt)
      this.spawnBugs(this.p.x + 260, 2)
    }
    const body = this.sheet.querySelector('.cw-sbody') as HTMLElement
    body.innerHTML =
      `<div class="cw-result ${good ? 'good' : 'bad'}">` +
      `<span class="cw-ti">${good ? '✅ 레일 획득' : '🧟 부채 발생'} · ${o.item.icon} ${o.item.name}</span>` +
      `<span class="cw-rv">${o.reveal}</span></div>` +
      '<button class="cw-cont" type="button">계속 ▸</button>'
    ;(body.querySelector('.cw-cont') as HTMLElement).onclick = (): void =>
      this.contStep()
    this.sheet.scrollTop = 0
  }

  private contStep(): void {
    if (!this.chosen) return
    this.modal.classList.remove('on')
    this.modalOpen = false
    this.pendingEra = null
    this.idx++
    this.progEl.textContent = `${this.idx} / ${CW_ERAS.length}`
  }

  private renderInv(): void {
    this.invEl.innerHTML = this.items
      .map(
        (x) =>
          `<span class="cw-it ${x.good ? 'good' : 'bad'}">${x.icon} ${x.name}</span>`
      )
      .join('')
  }

  private spawnBugs(x: number, n: number): void {
    for (let i = 0; i < n; i++) {
      this.bugs.push({ x: x + i * 70 + Math.sin(i) * 20, y: 22, w: 20, h: 20, hit: false })
    }
  }
  private clearNearBugs(): void {
    for (const b of this.bugs) {
      if (Math.abs(b.x - this.p.x) < 360) b.hit = true
    }
  }
  private burst(x: number, y: number, n: number, col: string): void {
    for (let i = 0; i < n; i++) {
      this.parts.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 1,
        life: 22,
        col,
      })
    }
  }

  private jumpV(): number {
    return BASE_JUMP - Math.min(this.debt, 4) * 1.25
  }

  private resize(): void {
    this.W = window.innerWidth
    this.H = window.innerHeight
    this.canvas.width = this.W * this.DPR
    this.canvas.height = this.H * this.DPR
    this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0)
  }

  private step(): void {
    if (!this.started || this.modalOpen || this.ended) return
    const p = this.p
    let ax = 0
    if (this.keys['ArrowLeft']) ax -= 1
    if (this.keys['ArrowRight']) ax += 1
    if (ax !== 0) p.face = ax
    p.vx += (ax * MOVE - p.vx) * 0.4
    p.x += p.vx
    if (p.x < 0) p.x = 0

    this.coyote = p.onGround ? 6 : this.coyote - 1
    if (this.buffer > 0 && this.coyote > 0) {
      p.vy = this.jumpV()
      p.onGround = false
      this.coyote = 0
      this.buffer = 0
      p.sq = 0.7
      this.burst(p.x + p.w / 2, p.y, 5, '#7ee660')
    }
    if (this.buffer > 0) this.buffer--
    p.vy -= GRAV
    if (p.vy < -MAX_FALL) p.vy = -MAX_FALL
    if (p.vy > 0 && !this.holdJump) p.vy *= 0.86
    p.y += p.vy

    const wasGround = p.onGround
    p.onGround = false
    for (const pl of this.platforms) {
      const top = pl.ground === true ? 0 : pl.y
      if (pl.ground === true) {
        if (p.y <= 0) {
          p.y = 0
          p.vy = 0
          p.onGround = true
        }
        continue
      }
      const overX = p.x + p.w > pl.x && p.x < pl.x + pl.w
      if (overX && p.vy <= 0 && p.y <= top + 4 && p.y > top - 24) {
        p.y = top
        p.vy = 0
        p.onGround = true
      }
    }
    if (p.y < 0) {
      p.y = 0
      p.vy = 0
      p.onGround = true
    }
    if (p.onGround && !wasGround) {
      p.sq = 1.4
      this.burst(p.x + p.w / 2, p.y, 6, '#3a2d57')
    }
    p.sq += (1 - p.sq) * 0.2
    p.anim += Math.abs(p.vx) * 0.1 + 0.04

    const curNode = this.nodeX[this.idx]
    const curEra = CW_ERAS[this.idx]
    if (curNode !== undefined && curEra !== undefined && p.x > curNode - 6) {
      this.eraEl.textContent = curEra.label
      this.openModal(curEra)
      p.vx = 0
    }
    for (const b of this.bugs) {
      if (b.hit) continue
      if (p.y < 30 && Math.abs(p.x + p.w / 2 - b.x) < 24) {
        b.hit = true
        p.vx = -6
        p.x -= 10
        this.burst(b.x, b.y + 10, 10, '#e86a54')
      }
    }
    if (this.idx >= CW_ERAS.length && p.x > this.gateX - 6 && !this.ended) {
      p.x = this.gateX - 6
      this.evaluate()
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const q = this.parts[i]
      if (q === undefined) continue
      q.x += q.vx
      q.y += q.vy
      q.vy -= 0.3
      q.life--
      if (q.life <= 0) this.parts.splice(i, 1)
    }
  }

  private evaluate(): void {
    this.ended = true
    const root = this.root
    if (root === null) return
    const big = root.querySelector('.cw-big') as HTMLElement
    const sub = root.querySelector('.cw-sub') as HTMLElement
    if (this.debt === 0) {
      big.textContent = CW_END.winTitle
      big.className = 'cw-big win'
      sub.textContent = CW_END.winBody
    } else {
      big.textContent = CW_END.blockTitle
      big.className = 'cw-big block'
      sub.innerHTML =
        `${CW_END.blockBody(this.debt)}<br><span class="cw-tail">${CW_END.blockBodyTail}</span>`
    }
    ;(root.querySelector('.cw-end') as HTMLElement).classList.add('on')
  }

  private camX(): number {
    const c = this.p.x - this.W * 0.34
    const m = this.worldEnd - this.W
    return Math.max(0, Math.min(c, Math.max(0, m)))
  }

  private broccoli(sx: number, baseY: number, sc: number, face: number, bob: number): void {
    const ctx = this.ctx
    const u = 3.2
    ctx.save()
    ctx.translate(sx, baseY)
    ctx.scale(face * (2 - sc), sc)
    ctx.translate(0, bob)
    const px = (x: number, y: number, w: number, h: number, c: string): void => {
      ctx.fillStyle = c
      ctx.fillRect(Math.round(x * u), Math.round(y * u), Math.ceil(w * u), Math.ceil(h * u))
    }
    px(-2, 0, 4, -3, '#d8e9b0')
    px(-2, -0.2, 1, -3, '#c2d697')
    px(-4, -3, 8, -3, '#3f7a33')
    px(-5, -5, 10, -2, '#4e9a3f')
    px(-4, -7, 8, -2, '#5fb34a')
    px(-3, -8.5, 6, -1.5, '#6fcf52')
    px(-4, -6.5, 1.5, -1.5, '#2f5e26')
    px(1.5, -6.5, 1.5, -1.5, '#2f5e26')
    px(-1, -8, 1.5, -1.5, '#86e86a')
    px(-4.5, -4, 1.3, -1.3, '#86e86a')
    px(-2.5, -4.5, 1.4, -1.6, '#1b1226')
    px(1.1, -4.5, 1.4, -1.6, '#1b1226')
    px(-2.2, -4.1, 0.6, -0.6, '#fff')
    px(1.4, -4.1, 0.6, -0.6, '#fff')
    ctx.restore()
  }

  private draw(): void {
    const ctx = this.ctx
    const cx = this.camX()
    const baseY = this.H - G
    const t = (this.mood + CW_ERAS.length) / (CW_ERAS.length * 2)
    const g = ctx.createLinearGradient(0, 0, 0, this.H)
    g.addColorStop(0, mix([22, 12, 20], [14, 16, 24], t))
    g.addColorStop(1, mix([40, 18, 30], [23, 21, 46], t))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, this.W, this.H)
    ctx.fillStyle = mix([226, 100, 80], [126, 230, 96], t)
      .replace('rgb(', 'rgba(')
      .replace(')', ',0.4)')
    for (let i = 0; i < 60; i++) {
      const sx = ((((i * 137 - cx * 0.2) % (this.W + 40)) + this.W + 40) % (this.W + 40)) - 20
      const sy = (i * 83) % (baseY - 40)
      ctx.fillRect(sx, sy, 2, 2)
    }
    ctx.fillStyle = mix([38, 18, 32], [22, 20, 50], t)
    for (let hx = -((cx * 0.4) % 260); hx < this.W + 260; hx += 260) {
      ctx.beginPath()
      ctx.moveTo(hx, baseY)
      ctx.quadraticCurveTo(hx + 130, baseY - 110, hx + 260, baseY)
      ctx.fill()
    }
    ctx.fillStyle = mix([38, 22, 44], [34, 38, 52], t)
    ctx.fillRect(0, baseY, this.W, G)
    ctx.fillStyle = mix([226, 100, 80], [95, 179, 74], t)
    ctx.fillRect(0, baseY, this.W, 4)
    ctx.strokeStyle = 'rgba(126,230,96,0.24)'
    ctx.setLineDash([3, 11])
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, baseY - 2)
    ctx.lineTo(this.W, baseY - 2)
    ctx.stroke()
    ctx.setLineDash([])
    for (const pl of this.platforms) {
      if (pl.ground === true) continue
      const x = pl.x - cx
      const y = baseY - pl.y - 16
      if (x > this.W || x + pl.w < 0) continue
      ctx.fillStyle = '#2c2340'
      ctx.fillRect(x, y, pl.w, 16)
      ctx.fillStyle = '#5fb34a'
      ctx.fillRect(x, y, pl.w, 3)
      ctx.fillStyle = mix([38, 22, 44], [34, 38, 52], t)
      ctx.fillRect(x, y + 16, pl.w, 20)
    }
    ctx.textAlign = 'center'
    this.nodeX.forEach((nx, i) => {
      const x = nx - cx
      const y = baseY - 150 - 18
      if (x > this.W + 50 || x < -50) return
      const era = CW_ERAS[i]
      if (era === undefined) return
      const done = i < this.idx
      if (!done) {
        const pulse = 1 + Math.sin(performance.now() / 300 + i) * 0.18
        ctx.globalAlpha = 0.28
        ctx.fillStyle = '#e6b44a'
        ctx.beginPath()
        ctx.arc(x, y, 14 * pulse, 0, 7)
        ctx.fill()
        ctx.globalAlpha = 1
      }
      ctx.fillStyle = done ? '#7ee660' : '#e6b44a'
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 7)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = done ? 'rgba(126,230,96,0.95)' : 'rgba(230,180,74,0.95)'
      ctx.font = '10px Galmuri9, monospace'
      ctx.fillText(era.label.split(' ')[0] ?? era.label, x, y - 17)
      if (!done) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.fillText('? 선택', x, y - 31)
      }
    })
    const gx = this.gateX - cx
    if (gx < this.W + 60 && gx > -60) {
      ctx.fillStyle = 'rgba(126,230,96,0.14)'
      ctx.fillRect(gx - 4, baseY - 150, 8, 150)
      ctx.fillStyle = '#7ee660'
      ctx.font = '12px Galmuri11, monospace'
      ctx.fillText('./gate.sh', gx, baseY - 158)
    }
    for (const b of this.bugs) {
      if (b.hit) continue
      const x = b.x - cx
      const y = baseY - b.y - b.h
      if (x > this.W || x < -30) continue
      ctx.font = '19px serif'
      ctx.fillText('🐛', x + b.w / 2, y + b.h)
    }
    for (const q of this.parts) {
      ctx.fillStyle = q.col
      ctx.globalAlpha = Math.max(0, q.life / 22)
      ctx.fillRect(q.x - cx - 1.5, baseY - q.y - 1.5, 3, 3)
    }
    ctx.globalAlpha = 1
    const bob = this.started
      ? Math.sin(this.p.anim) * (this.p.onGround ? 1.2 : 0)
      : Math.sin(performance.now() / 350) * 1.5
    this.broccoli(this.p.x + this.p.w / 2 - cx, baseY - this.p.y, this.p.sq, this.p.face, -bob)
  }

  private loop(now: number): void {
    const dt = Math.min((now - this.last) / 16.67, 2.2)
    this.last = now
    const n = Math.max(1, Math.round(dt))
    for (let i = 0; i < n; i++) this.step()
    this.draw()
    this.raf = window.requestAnimationFrame((ts) => this.loop(ts))
  }
}
