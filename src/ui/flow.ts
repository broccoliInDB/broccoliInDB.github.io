import { getContent } from '../content'
import { type Flow, type FlowStep } from '../content/types'
import { createElement } from './dom'

function createNode(step: FlowStep): HTMLElement {
  const node = createElement('div', undefined, 'flow-node')
  node.appendChild(createElement('strong', step.label))
  if (step.note !== undefined) {
    node.appendChild(createElement('span', step.note))
  }
  return node
}

function createRow(
  steps: FlowStep[],
  arrow: string,
  className: string
): HTMLElement {
  const row = createElement('div', undefined, className)
  steps.forEach((step, index) => {
    if (index > 0) {
      row.appendChild(createElement('span', arrow, 'flow-arrow'))
    }
    row.appendChild(createNode(step))
  })
  return row
}

function createCompareSide(label: string, lines: string[]): HTMLElement {
  const side = createElement('div', undefined, 'flow-side')
  side.appendChild(createElement('span', label, 'flow-tag'))
  const list = createElement('ul')
  lines.forEach((line) => list.appendChild(createElement('li', line)))
  side.appendChild(list)
  return side
}

// Diagrams are plain boxes and arrows so they read the same on a phone:
// rows wrap, stacks stay vertical, before/after stack under each other.
export function createFlow(flow: Flow): HTMLElement {
  const figure = createElement('figure', undefined, `flow flow-${flow.kind}`)
  if (flow.kind === 'compare') {
    const { ui } = getContent()
    const before = createCompareSide(ui.flowBefore, flow.before)
    before.classList.add('is-before')
    const after = createCompareSide(ui.flowAfter, flow.after)
    after.classList.add('is-after')
    figure.append(before, createElement('span', '▶', 'flow-arrow'), after)
    return figure
  }
  const arrow = flow.kind === 'stack' ? '▼' : '▶'
  figure.appendChild(createRow(flow.steps, arrow, 'flow-row'))
  return figure
}
