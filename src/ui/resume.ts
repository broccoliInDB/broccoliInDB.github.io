import { getLang, setLang } from '../content'
import {
  getResume,
  type AxStructureBlock,
  type ResumeData,
} from '../content/resume'
import { createElement } from './dom'

// The career landing: one IDE/terminal "session" that reads top to bottom.
// Prose stays in a readable sans; only code tokens use the mono class (CSS).

function anchor(label: string, href: string, className: string): HTMLElement {
  const a = document.createElement('a')
  a.href = href
  a.textContent = label
  a.className = className
  if (href.startsWith('http')) {
    a.rel = 'noopener'
    a.target = '_blank'
  }
  return a
}

// A `$ command  # note` prompt line.
function promptLine(command: string, note?: string): HTMLElement {
  const p = createElement('p', undefined, 'cmd')
  p.appendChild(createElement('span', '$', 'p'))
  p.appendChild(document.createTextNode(` ${command}`))
  if (note !== undefined) {
    p.appendChild(document.createTextNode(' '))
    p.appendChild(createElement('span', note, 'note'))
  }
  return p
}

// Build a text node + highlighted span + text node from a 3-part segment list.
function highlighted(parent: HTMLElement, parts: string[], hlClass: string): void {
  parent.appendChild(document.createTextNode(parts[0] ?? ''))
  parent.appendChild(createElement('span', parts[1] ?? '', hlClass))
  parent.appendChild(document.createTextNode(parts[2] ?? ''))
}

function renderHero(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.whoamiCmd))
  const who = createElement('div', undefined, 'out whoami')
  const line1 = createElement('div')
  line1.appendChild(createElement('span', d.name, 'hl'))
  line1.appendChild(createElement('span', ' · ', 'dim'))
  line1.appendChild(document.createTextNode(d.handle))
  line1.appendChild(createElement('span', ` — ${d.role}`, 'dim'))
  who.appendChild(line1)
  who.appendChild(createElement('div', d.meta, 'dim'))
  body.appendChild(who)

  body.appendChild(promptLine(d.thesisCmd))
  const out = createElement('div', undefined, 'out')
  const thesis = createElement('p', undefined, 'thesis')
  thesis.appendChild(createElement('span', d.thesisPre, 'h'))
  thesis.appendChild(document.createTextNode(d.thesisHead))
  thesis.appendChild(createElement('span', d.thesisEm, 'em'))
  out.appendChild(thesis)
  const sub = createElement('p', undefined, 'sub-line')
  highlighted(sub, d.thesisSub, 'str')
  out.appendChild(sub)
  body.appendChild(out)
}

function renderStack(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.stackCmd, d.stackNote))
  const out = createElement('div', undefined, 'out stack-block')

  const tier = (
    label: string,
    items: string[],
    className: string
  ): HTMLElement => {
    const row = createElement('div', undefined, `stack-tier ${className}`)
    row.appendChild(createElement('span', label, 'tl'))
    const chips = createElement('div', undefined, 'stack-chips')
    items.forEach((t) => chips.appendChild(createElement('span', t, 'chip')))
    row.appendChild(chips)
    return row
  }

  out.appendChild(tier(d.stackPrimary.label, d.stackPrimary.items, 'lead'))
  out.appendChild(tier(d.stackAi.label, d.stackAi.items, 'lead'))
  out.appendChild(createElement('div', undefined, 'stack-div'))
  d.stackRest.forEach((t) => out.appendChild(tier(t.label, t.items, 'muted')))

  body.appendChild(out)
}

function renderCareer(body: HTMLElement, d: ResumeData, root: HTMLElement): void {
  const head = promptLine(d.careerCmd, d.careerNote)
  head.id = 'rs-career'
  body.appendChild(head)
  const out = createElement('div', undefined, 'out gitlog')
  d.career.forEach((row) => {
    const rowEl = createElement('div', undefined, 'row')
    const line = createElement('div', undefined, 'line')
    line.appendChild(createElement('span', row.ref, 'ref'))
    if (row.tag !== undefined) {
      line.appendChild(createElement('span', row.tag, 'head'))
    }
    line.appendChild(createElement('span', row.date, 'date'))
    line.appendChild(
      createElement('span', row.msg, row.details === undefined ? 'dim' : 'msg')
    )
    if (row.company !== undefined) {
      line.appendChild(createElement('span', row.company, 'co'))
    }
    rowEl.appendChild(line)
    if (row.details !== undefined) {
      const detail = createElement('div', undefined, 'detail')
      row.details.forEach((t) => detail.appendChild(createElement('div', t, 'c')))
      if (row.stack !== undefined) {
        detail.appendChild(createElement('div', row.stack.join(' · '), 'stack'))
      }
      if (row.axDetail === true) {
        const btn = createElement('button', d.axDetailLabel, 'ax-detail-btn')
        btn.setAttribute('type', 'button')
        btn.addEventListener('click', () =>
          openDetailModal(root, d.axStructureTitle, d.axStructure)
        )
        detail.appendChild(btn)
      }
      if (row.adDetail === true) {
        const btn = createElement('button', d.adDetailLabel, 'ax-detail-btn')
        btn.setAttribute('type', 'button')
        btn.addEventListener('click', () =>
          openDetailModal(root, d.adStructureTitle, d.adStructure)
        )
        detail.appendChild(btn)
      }
      if (row.missionDetail === true) {
        const btn = createElement('button', d.missionDetailLabel, 'ax-detail-btn')
        btn.setAttribute('type', 'button')
        btn.addEventListener('click', () =>
          openDetailModal(root, d.missionStructureTitle, d.missionStructure)
        )
        detail.appendChild(btn)
      }
      rowEl.appendChild(detail)
    }
    out.appendChild(rowEl)
  })
  body.appendChild(out)
}

function renderImpact(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.impactCmd, d.impactNote))
  const out = createElement('div', undefined, 'out')
  const grid = createElement('div', undefined, 'stats-grid')
  d.stats.forEach((s) => {
    const stat = createElement('div', undefined, 'stat')
    const v = createElement('div', undefined, 'v')
    v.appendChild(document.createTextNode(s.value))
    if (s.unit !== undefined) {
      v.appendChild(createElement('small', s.unit))
    }
    stat.appendChild(v)
    stat.appendChild(createElement('div', s.label, 'k'))
    grid.appendChild(stat)
  })
  out.appendChild(grid)
  body.appendChild(out)
}

function renderPrinciples(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine('cat how-i-work.md', `# ${d.principlesTitle}`))
  const out = createElement('div', undefined, 'out')
  const list = createElement('div', undefined, 'principles')
  d.principles.forEach((p) => {
    const item = createElement('div', undefined, 'principle')
    item.appendChild(createElement('div', p.k, 'pk'))
    item.appendChild(createElement('div', p.v, 'pv'))
    list.appendChild(item)
  })
  out.appendChild(list)
  body.appendChild(out)
}

function renderAx(body: HTMLElement, d: ResumeData): void {
  const axHead = promptLine(d.axCmd, d.axNote)
  axHead.id = 'rs-ax'
  body.appendChild(axHead)
  const out = createElement('div', undefined, 'out')

  const head = createElement('p', undefined, 'thesis-head')
  head.appendChild(document.createTextNode(d.axHead))
  head.appendChild(createElement('span', d.axHeadEm1, 'em'))
  head.appendChild(document.createTextNode(d.axHeadMid))
  head.appendChild(createElement('span', d.axHeadEm2, 'em'))
  out.appendChild(head)

  const lede = createElement('p', undefined, 'ax-lede')
  highlighted(lede, d.axLede, 'b-hl')
  out.appendChild(lede)

  const compare = createElement('div', undefined, 'compare')
  const makeSide = (tag: string, items: string[], side: string): HTMLElement => {
    const cs = createElement('div', undefined, `cs ${side}`)
    cs.appendChild(createElement('div', tag, 'ct'))
    const ul = createElement('ul')
    items.forEach((t) => ul.appendChild(createElement('li', t)))
    cs.appendChild(ul)
    return cs
  }
  compare.appendChild(makeSide(d.beforeTag, d.before, 'before'))
  compare.appendChild(makeSide(d.afterTag, d.after, 'after'))
  out.appendChild(compare)

  const gate = createElement('div', undefined, 'gate')
  d.gate.forEach((g) => {
    const row = createElement('div', undefined, 'g')
    row.appendChild(createElement('span', '▸', 'arrow'))
    row.appendChild(createElement('span', g.k, 'gk'))
    row.appendChild(createElement('span', g.v, 'gv'))
    gate.appendChild(row)
  })
  gate.appendChild(createElement('div', d.gatePass, 'pass'))
  out.appendChild(gate)

  const chips = createElement('div', undefined, 'ax-chips')
  d.axChips.forEach((c) => {
    const span = createElement('span')
    span.appendChild(document.createTextNode(`${c.label} `))
    span.appendChild(createElement('b', c.strong))
    chips.appendChild(span)
  })
  out.appendChild(chips)
  body.appendChild(out)
}

function renderCraft(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.craftCmd, d.craftNote))
  const out = createElement('div', undefined, 'out')
  const row = createElement('div', undefined, 'lsrow')
  d.craft.forEach((c) => {
    const dir = createElement('div', undefined, 'dir')
    const dn = createElement('span', c.name, 'dn')
    dn.appendChild(createElement('span', c.badge, 'db'))
    dir.appendChild(dn)
    dir.appendChild(createElement('p', c.desc))
    dir.appendChild(createElement('div', c.stack, 'ds'))
    row.appendChild(dir)
  })
  out.appendChild(row)
  body.appendChild(out)
}

function renderContact(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.contactCmd))
  const out = createElement('div', undefined, 'out')
  const links = createElement('div', undefined, 'linkrow')
  const email = d.links.find((l) => l.href.startsWith('mailto:'))
  if (email !== undefined) {
    links.appendChild(anchor(email.href.replace('mailto:', ''), email.href, 'prime'))
  }
  d.links
    .filter((l) => !l.href.startsWith('mailto:'))
    .forEach((l) => links.appendChild(anchor(l.label, l.href, '')))
  out.appendChild(links)
  body.appendChild(out)

  const end = createElement('p', undefined, 'cmd')
  end.appendChild(createElement('span', '$', 'p'))
  end.appendChild(createElement('span', undefined, 'cursor'))
  body.appendChild(end)

  if (d.foot) body.appendChild(createElement('p', d.foot, 'foot'))
}

// A detail modal — reused by the AX structure and the ad-capture case study.
function openDetailModal(
  root: HTMLElement,
  title: string,
  blocks: AxStructureBlock[]
): void {
  const ko = getLang() === 'ko'
  const overlay = createElement('div', undefined, 'ax-modal-overlay')
  const panel = createElement('div', undefined, 'ax-modal')

  const head = createElement('div', undefined, 'ax-modal-head')
  head.appendChild(createElement('h3', title, 'ax-modal-title'))
  const close = createElement('button', '×', 'ax-modal-close')
  close.setAttribute('type', 'button')
  close.setAttribute('aria-label', ko ? '닫기' : 'Close')
  head.appendChild(close)
  panel.appendChild(head)

  const list = createElement('div', undefined, 'ax-modal-list')
  blocks.forEach((blk) => {
    const item = createElement('div', undefined, 'ax-blk')
    const top = createElement('div', undefined, 'ax-blk-top')
    top.appendChild(createElement('span', blk.n, 'ax-blk-n'))
    top.appendChild(createElement('span', blk.title, 'ax-blk-title'))
    item.appendChild(top)
    if (blk.body !== undefined) {
      item.appendChild(createElement('p', blk.body, 'ax-blk-body'))
    }
    if (blk.list !== undefined) {
      const ul = createElement('ul', undefined, 'ax-blk-list')
      blk.list.forEach((t) => ul.appendChild(createElement('li', t)))
      item.appendChild(ul)
    }
    if (blk.chips !== undefined) {
      const chipRow = createElement('div', undefined, 'ax-blk-chips')
      blk.chips.forEach((t) => chipRow.appendChild(createElement('span', t, 'ax-chip')))
      item.appendChild(chipRow)
    }
    if (blk.diagram !== undefined) {
      item.appendChild(createElement('pre', blk.diagram, 'ax-blk-diagram'))
    }
    list.appendChild(item)
  })
  panel.appendChild(list)
  overlay.appendChild(panel)

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      dismiss()
    }
  }
  function dismiss(): void {
    overlay.remove()
    document.removeEventListener('keydown', onKey, true)
  }
  close.addEventListener('click', dismiss)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss()
  })
  document.addEventListener('keydown', onKey, true)

  root.appendChild(overlay)
  close.focus()
}

// A clickable traffic-light dot wired to a real window action.
function dot(variant: string, label: string, onClick: () => void): HTMLElement {
  const b = createElement('button', undefined, `dot ${variant}`)
  b.setAttribute('type', 'button')
  b.setAttribute('aria-label', label)
  b.title = label
  b.addEventListener('click', onClick)
  return b
}

// A clickable tab that smooth-scrolls a section into view.
function tab(label: string, targetId: string): HTMLElement {
  const t = createElement('span', label, 'tab link')
  t.setAttribute('role', 'button')
  t.setAttribute('tabindex', '0')
  t.title = label
  const go = (): void =>
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  t.addEventListener('click', go)
  t.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      go()
    }
  })
  return t
}

// Render the whole career page into `root` (the #resume overlay).
export function renderResume(
  root: HTMLElement,
  onClose: () => void
): void {
  const d = getResume()
  const win = createElement('div', undefined, 'win')

  const bar = createElement('div', undefined, 'titlebar')
  const ko = getLang() === 'ko'
  bar.appendChild(dot('close', ko ? '닫기 (홈으로)' : 'Close (back to home)', onClose))
  bar.appendChild(
    dot('contact', ko ? '맨 아래(연락처)로' : 'Jump to contact', () =>
      root.scrollTo({ top: root.scrollHeight, behavior: 'smooth' })
    )
  )
  bar.appendChild(
    dot('top', ko ? '맨 위로' : 'Scroll to top', () =>
      root.scrollTo({ top: 0, behavior: 'smooth' })
    )
  )
  const tabs = createElement('div', undefined, 'tabs')
  tabs.appendChild(createElement('span', 'broccoli — zsh', 'tab active'))
  tabs.appendChild(tab('career.log', 'rs-career'))
  tabs.appendChild(tab('ax-gate.ts', 'rs-ax'))
  bar.appendChild(tabs)
  const branch = createElement('span', undefined, 'branch')
  branch.appendChild(document.createTextNode('⎇ '))
  branch.appendChild(createElement('b', 'main'))
  bar.appendChild(branch)
  const lang = createElement('button', getLang() === 'ko' ? 'EN' : '한', 'lang-toggle')
  lang.setAttribute('type', 'button')
  lang.setAttribute(
    'aria-label',
    getLang() === 'ko' ? 'Switch to English' : '한국어로 전환'
  )
  lang.addEventListener('click', () => setLang(getLang() === 'ko' ? 'en' : 'ko'))
  bar.appendChild(lang)
  win.appendChild(bar)

  const body = createElement('div', undefined, 'body')
  renderHero(body, d)
  renderStack(body, d)
  renderCareer(body, d, root)
  renderImpact(body, d)
  renderPrinciples(body, d)
  renderAx(body, d)
  renderCraft(body, d)
  renderContact(body, d)
  const back = createElement(
    'button',
    getLang() === 'ko' ? '▲ 메인으로' : '▲ Back to home',
    'back-main'
  )
  back.setAttribute('type', 'button')
  back.addEventListener('click', onClose)
  body.appendChild(back)
  win.appendChild(body)

  root.replaceChildren(win)
}
