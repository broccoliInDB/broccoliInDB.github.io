import { getContent } from '../content'
import { type EntryId, type RegionId } from '../content/types'
import { getRouteLandmarks, type Landmark } from '../world/landmarks'
import { createButton, createElement } from './dom'

export interface RoadmapActions {
  visited: ReadonlySet<EntryId>
  onTravel: (entry: EntryId) => void
  onClose: () => void
  onOpenTldr: () => void
  onReplayGuide: () => void
}

// Present first, then back in time — the same order as the road.
const REGION_ORDER: readonly RegionId[] = ['head', 'v19', 'v15', 'v01', 'init']

function createPlaceRow(
  landmark: Landmark,
  actions: RoadmapActions
): HTMLElement {
  const { entries, ui } = getContent()
  const entry = entries[landmark.entry]
  const isVisited = actions.visited.has(landmark.entry)
  const row = createElement('li', undefined, 'roadmap-place')
  const button = createButton('', 'roadmap-go', () =>
    actions.onTravel(landmark.entry)
  )
  const head = createElement('span', undefined, 'roadmap-head')
  head.appendChild(createElement('strong', entry.title))
  if (isVisited) {
    head.appendChild(
      createElement('span', `✓ ${ui.mapVisited}`, 'roadmap-seen')
    )
  }
  button.appendChild(head)
  button.appendChild(
    createElement('span', entry.summary[0] ?? '', 'roadmap-line')
  )
  button.appendChild(createElement('span', ui.mapTravel, 'roadmap-cta'))
  row.appendChild(button)
  return row
}

function createRegionSection(
  region: RegionId,
  landmarks: Landmark[],
  actions: RoadmapActions
): HTMLElement {
  const label = getContent().regions[region]
  const section = createElement('section', undefined, 'roadmap-region')
  const heading = createElement('h2')
  heading.appendChild(createElement('span', label.tag, 'roadmap-tag'))
  heading.appendChild(
    document.createTextNode(` ${label.name} · ${label.period}`)
  )
  section.appendChild(heading)
  const list = createElement('ol', undefined, 'roadmap-list')
  landmarks.forEach((item) => list.appendChild(createPlaceRow(item, actions)))
  section.appendChild(list)
  return section
}

// A place-by-place index: one conclusion per place, one tap to go there.
export function renderRoadmap(
  root: HTMLElement,
  actions: RoadmapActions
): void {
  const { ui, tldr } = getContent()
  const landmarks = getRouteLandmarks()
  const panel = createElement('article', undefined, 'roadmap-panel')

  panel.appendChild(
    createButton(`✕ ${ui.close}`, 'panel-close', actions.onClose)
  )
  panel.appendChild(createElement('h1', ui.mapTitle))
  panel.appendChild(createElement('p', tldr.tagline, 'roadmap-tagline'))
  panel.appendChild(createElement('p', ui.mapLead, 'roadmap-lead'))

  REGION_ORDER.forEach((region) => {
    const inRegion = landmarks.filter((item) => item.region === region)
    if (inRegion.length > 0) {
      panel.appendChild(createRegionSection(region, inRegion, actions))
    }
  })

  const footer = createElement('div', undefined, 'roadmap-footer')
  footer.appendChild(
    createButton(ui.mapTldr, 'roadmap-link', actions.onOpenTldr)
  )
  footer.appendChild(
    createButton(ui.mapReplayGuide, 'roadmap-link', actions.onReplayGuide)
  )
  panel.appendChild(footer)

  root.replaceChildren(panel)
}
