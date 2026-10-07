import { getContent } from '../content'
import { type DetailItem, type DetailTab, type Entry } from '../content/types'
import { createButton, createElement } from './dom'
import { createFlow } from './flow'

export interface DetailPanel {
  moveTab: (delta: number) => void
}

export function hasDetailCards(entry: Entry): boolean {
  return (entry.cards?.length ?? 0) > 0 || (entry.tabs?.length ?? 0) > 0
}

function createLabeledLine(label: string, text: string): HTMLElement {
  const line = createElement('p', undefined, 'detail-line')
  line.appendChild(createElement('b', label))
  line.appendChild(createElement('span', text))
  return line
}

function createItem(item: DetailItem): HTMLElement {
  const { ui } = getContent()
  const el = createElement('li', undefined, 'detail-item')
  const head = createElement('div', undefined, 'detail-item-head')
  head.appendChild(createElement('h2', item.title))
  if (item.period !== undefined) {
    head.appendChild(createElement('span', item.period, 'detail-period'))
  }
  el.appendChild(head)
  if (item.flow !== undefined) {
    el.appendChild(createFlow(item.flow))
  }
  const lines: [string, string | undefined][] = [
    [ui.detailSituation, item.situation],
    [ui.detailDecision, item.decision],
    [ui.detailResult, item.result],
  ]
  lines.forEach(([label, text]) => {
    if (text !== undefined) {
      el.appendChild(createLabeledLine(label, text))
    }
  })
  if (item.body !== undefined) {
    el.appendChild(createElement('p', item.body, 'detail-body'))
  }
  return el
}

function createItemList(items: DetailItem[]): HTMLElement {
  const list = createElement('ol', undefined, 'detail-cards')
  items.forEach((item) => list.appendChild(createItem(item)))
  return list
}

function createTabBody(tab: DetailTab): HTMLElement {
  const body = createElement('div', undefined, 'detail-tab-body')
  body.appendChild(createItemList(tab.items))
  const more = tab.more ?? []
  if (more.length === 0) {
    return body
  }
  const details = document.createElement('details')
  details.className = 'detail-more'
  const summary = document.createElement('summary')
  summary.textContent = `${getContent().ui.detailMore} (${more.length})`
  details.append(summary, createItemList(more))
  body.appendChild(details)
  return body
}

function renderTabs(panel: HTMLElement, tabs: DetailTab[]): DetailPanel {
  const bar = createElement('div', undefined, 'detail-tabs')
  bar.setAttribute('role', 'tablist')
  const slot = createElement('div')
  let active = 0
  const buttons = tabs.map((tab, index) =>
    createButton(tab.label, 'detail-tab', () => select(index))
  )
  const select = (index: number): void => {
    active = (index + tabs.length) % tabs.length
    buttons.forEach((button, i) => {
      button.setAttribute('role', 'tab')
      button.setAttribute('aria-selected', String(i === active))
    })
    const tab = tabs[active]
    if (tab !== undefined) {
      slot.replaceChildren(createTabBody(tab))
    }
  }
  bar.append(...buttons)
  panel.append(bar, slot)
  select(0)
  return { moveTab: (delta) => select(active + delta) }
}

// The deep view behind "See details": tabs of design notes with diagrams,
// or a plain card list for short entries.
export function renderDetail(
  root: HTMLElement,
  entry: Entry,
  onClose: () => void
): DetailPanel {
  const { ui } = getContent()
  const panel = createElement('article', undefined, 'tldr-panel detail-panel')

  const closeButton = createElement('button', `✕ ${ui.close}`, 'tldr-close')
  closeButton.addEventListener('click', onClose)
  panel.appendChild(closeButton)

  panel.appendChild(createElement('h1', entry.title))
  entry.summary.forEach((line) =>
    panel.appendChild(createElement('p', line, 'tldr-tagline'))
  )

  let controller: DetailPanel = { moveTab: () => undefined }
  if (entry.tabs !== undefined && entry.tabs.length > 0) {
    controller = renderTabs(panel, entry.tabs)
  } else {
    panel.appendChild(
      createItemList(
        (entry.cards ?? []).map((card) => ({
          title: card.title,
          body: card.body,
        }))
      )
    )
  }

  if (entry.stack !== undefined) {
    panel.appendChild(createElement('p', entry.stack, 'detail-stack'))
  }

  root.replaceChildren(panel)
  return controller
}
