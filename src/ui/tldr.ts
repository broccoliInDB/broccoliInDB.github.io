import { GITHUB_URL } from '../config'
import { getContent } from '../content'
import { createElement } from './dom'

function createList(items: string[]): HTMLElement {
  const list = createElement('ul')
  items.forEach((item) => list.appendChild(createElement('li', item)))
  return list
}

// A plain one-page summary for visitors who do not want to walk.
export function renderTldr(root: HTMLElement, onClose: () => void): void {
  const { tldr, ui } = getContent()
  const panel = createElement('article', undefined, 'tldr-panel')

  const closeButton = createElement('button', `✕ ${ui.close}`, 'tldr-close')
  closeButton.addEventListener('click', onClose)
  panel.appendChild(closeButton)

  panel.appendChild(createElement('h1', tldr.heading))
  panel.appendChild(createElement('p', tldr.tagline, 'tldr-tagline'))

  tldr.sections.forEach((section) => {
    panel.appendChild(createElement('h2', section.title))
    panel.appendChild(createList(section.items))
  })

  panel.appendChild(createElement('h2', tldr.timelineTitle))
  const timeline = createElement('ol', undefined, 'tldr-timeline')
  tldr.timeline.forEach((item) => {
    const row = createElement('li')
    row.appendChild(createElement('span', item.period, 'tldr-period'))
    row.appendChild(createElement('strong', item.title))
    if (item.detail !== '') {
      row.appendChild(createElement('p', item.detail))
    }
    timeline.appendChild(row)
  })
  panel.appendChild(timeline)

  panel.appendChild(createElement('h2', tldr.linksTitle))
  const link = document.createElement('a')
  link.href = GITHUB_URL
  link.textContent = 'github.com/broccoliInDB'
  link.rel = 'noopener'
  panel.appendChild(link)

  root.replaceChildren(panel)
}
