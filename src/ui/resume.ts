import { getLang, setLang } from '../content'
import { getResume, type ResumeData } from '../content/resume'
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

function renderHero(body: HTMLElement, d: ResumeData, onWalk: () => void): void {
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
  const links = createElement('div', undefined, 'linkrow')
  const walk = createElement('button', d.walk, 'prime')
  walk.setAttribute('type', 'button')
  walk.addEventListener('click', onWalk)
  links.appendChild(walk)
  d.links.forEach((l) => links.appendChild(anchor(l.label, l.href, '')))
  out.appendChild(links)
  body.appendChild(out)
}

function renderCareer(body: HTMLElement, d: ResumeData): void {
  body.appendChild(promptLine(d.careerCmd, d.careerNote))
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
    rowEl.appendChild(line)
    if (row.details !== undefined) {
      const detail = createElement('div', undefined, 'detail')
      row.details.forEach((t) => detail.appendChild(createElement('div', t, 'c')))
      if (row.stack !== undefined) {
        detail.appendChild(createElement('div', row.stack.join(' · '), 'stack'))
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
  body.appendChild(promptLine(d.axCmd, d.axNote))
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

  body.appendChild(createElement('p', d.foot, 'foot'))
}

// Render the whole career page into `root` (the #resume overlay).
export function renderResume(root: HTMLElement, onWalk: () => void): void {
  const d = getResume()
  const win = createElement('div', undefined, 'win')

  const bar = createElement('div', undefined, 'titlebar')
  for (let i = 0; i < 3; i++) bar.appendChild(createElement('span', undefined, 'dot'))
  const tabs = createElement('div', undefined, 'tabs')
  tabs.appendChild(createElement('span', 'broccoli — zsh', 'tab active'))
  tabs.appendChild(createElement('span', 'career.log', 'tab'))
  tabs.appendChild(createElement('span', 'ax-gate.ts', 'tab'))
  bar.appendChild(tabs)
  const branch = createElement('span', undefined, 'branch')
  branch.appendChild(document.createTextNode('⎇ '))
  branch.appendChild(createElement('b', 'main'))
  branch.appendChild(document.createTextNode(' · 홈쇼핑모아'))
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
  renderHero(body, d, onWalk)
  renderCareer(body, d)
  renderImpact(body, d)
  renderPrinciples(body, d)
  renderAx(body, d)
  renderCraft(body, d)
  renderContact(body, d)
  win.appendChild(body)

  root.replaceChildren(win)
}
