import { getContent } from '../content'
import { type CoachTarget } from '../content/types'
import { createButton, createElement } from './dom'

const STORAGE_KEY = 'broccoli-log:coach-seen'
const SPOTLIGHT_CLASS = 'is-spotlit'

export function hasSeenCoach(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markCoachSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Without storage the guide simply shows again next visit.
  }
}

// First-visit coach marks: a short card per step, with a ring around
// the thing it talks about so visitors know where to look.
export class Coach {
  private stepIndex = -1
  private onFinish: () => void = () => undefined

  constructor(
    private readonly root: HTMLElement,
    private readonly targets: Partial<Record<CoachTarget, HTMLElement>>
  ) {}

  isOpen(): boolean {
    return this.stepIndex >= 0
  }

  start(onFinish: () => void): void {
    this.onFinish = onFinish
    this.stepIndex = 0
    this.render()
  }

  next(): void {
    if (!this.isOpen()) {
      return
    }
    const isLast = this.stepIndex >= getContent().ui.coach.length - 1
    if (isLast) {
      this.finish()
      return
    }
    this.stepIndex += 1
    this.render()
  }

  finish(): void {
    if (!this.isOpen()) {
      return
    }
    this.stepIndex = -1
    this.clearSpotlight()
    this.root.hidden = true
    this.root.replaceChildren()
    markCoachSeen()
    this.onFinish()
  }

  render(): void {
    if (!this.isOpen()) {
      return
    }
    const { ui } = getContent()
    const step = ui.coach[this.stepIndex]
    if (step === undefined) {
      this.finish()
      return
    }
    const isLast = this.stepIndex >= ui.coach.length - 1
    const card = createElement('div', undefined, 'coach-card')
    card.dataset.target = step.target
    card.appendChild(
      createElement(
        'span',
        `${this.stepIndex + 1} / ${ui.coach.length}`,
        'coach-step'
      )
    )
    card.appendChild(createElement('strong', step.title, 'coach-title'))
    card.appendChild(createElement('p', step.body, 'coach-body'))
    const actions = createElement('div', undefined, 'coach-actions')
    if (!isLast) {
      actions.appendChild(
        createButton(ui.coachSkip, 'coach-skip', () => this.finish())
      )
    }
    actions.appendChild(
      createButton(isLast ? ui.coachDone : ui.coachNext, 'coach-next', () =>
        this.next()
      )
    )
    card.appendChild(actions)
    this.root.replaceChildren(card)
    this.root.hidden = false
    this.spotlight(step.target)
  }

  private spotlight(target: CoachTarget): void {
    this.clearSpotlight()
    this.targets[target]?.classList.add(SPOTLIGHT_CLASS)
  }

  private clearSpotlight(): void {
    Object.values(this.targets).forEach((el) =>
      el.classList.remove(SPOTLIGHT_CLASS)
    )
  }
}
