import { TYPE_CHARS_PER_SECOND } from '../config'
import { getContent } from '../content'
import { type Entry } from '../content/types'
import { hasDetailCards } from './detail'
import { getKeyLabels } from './keys'

type Phase = 'summary' | 'choice' | 'more'

interface HintPart {
  key: string
  label: string
}

function hasMoreToTell(entry: Entry | null): boolean {
  if (entry === null) {
    return false
  }
  return entry.more.length > 0 || hasDetailCards(entry)
}

function createSpan(text: string): HTMLSpanElement {
  const span = document.createElement('span')
  span.textContent = text
  return span
}

export class Dialog {
  private readonly root: HTMLElement
  private readonly titleEl: HTMLElement
  private readonly textEl: HTMLElement
  private readonly hintEl: HTMLElement
  private readonly choicesEl: HTMLElement
  private entry: Entry | null = null
  private phase: Phase = 'summary'
  private lines: string[] = []
  private lineIndex = 0
  private visibleChars = 0

  constructor(
    root: HTMLElement,
    private readonly onOpenDetail: (entry: Entry) => void
  ) {
    this.root = root
    this.titleEl = this.createChild('dialog-title')
    this.textEl = this.createChild('dialog-text')
    this.choicesEl = this.createChild('dialog-choices')
    this.hintEl = this.createChild('dialog-hint')
    this.textEl.setAttribute('aria-live', 'polite')
  }

  private createChild(className: string): HTMLElement {
    const el = document.createElement('div')
    el.className = className
    this.root.appendChild(el)
    return el
  }

  isOpen(): boolean {
    return this.entry !== null
  }

  open(entry: Entry): void {
    this.entry = entry
    this.titleEl.textContent = entry.title
    this.root.hidden = false
    this.startLines('summary', entry.summary)
  }

  close(): void {
    this.entry = null
    this.root.hidden = true
    this.choicesEl.replaceChildren()
  }

  private startLines(phase: Phase, lines: string[]): void {
    this.phase = phase
    this.lines = lines
    this.lineIndex = 0
    this.visibleChars = 0
    this.choicesEl.replaceChildren()
    this.render()
  }

  private getCurrentLine(): string {
    return this.lines[this.lineIndex] ?? ''
  }

  private isLineComplete(): boolean {
    return this.visibleChars >= this.getCurrentLine().length
  }

  update(deltaSeconds: number): void {
    if (this.entry === null || this.phase === 'choice') {
      return
    }
    if (this.isLineComplete()) {
      return
    }
    this.visibleChars += deltaSeconds * TYPE_CHARS_PER_SECOND
    this.render()
  }

  handleAction(): void {
    if (this.entry === null) {
      return
    }
    if (this.phase === 'choice') {
      this.openMore(this.entry)
      return
    }
    if (!this.isLineComplete()) {
      this.visibleChars = this.getCurrentLine().length
      this.render()
      return
    }
    if (this.lineIndex < this.lines.length - 1) {
      this.lineIndex += 1
      this.visibleChars = 0
      this.render()
      return
    }
    this.finishLines()
  }

  private openMore(entry: Entry): void {
    if (!hasDetailCards(entry)) {
      this.startLines('more', entry.more)
      return
    }
    this.close()
    this.onOpenDetail(entry)
  }

  handleCancel(): void {
    this.close()
  }

  private finishLines(): void {
    const hasMore = this.phase === 'summary' && hasMoreToTell(this.entry)
    if (!hasMore) {
      this.close()
      return
    }
    this.phase = 'choice'
    this.renderChoices()
  }

  private renderChoices(): void {
    const ui = getContent().ui
    const moreButton = this.createChoice(`▶ ${ui.more}`, () =>
      this.handleAction()
    )
    const closeButton = this.createChoice(ui.close, () => this.close())
    this.choicesEl.replaceChildren(moreButton, closeButton)
    const keys = getKeyLabels()
    this.setHint([
      { key: keys.action, label: ui.more },
      { key: keys.cancel, label: ui.close },
    ])
  }

  // Only the ▼/■ marker blinks; the key name must stay readable, so it is
  // drawn as a keycap next to its action.
  private setHint(parts: readonly HintPart[], marker = ''): void {
    const nodes: HTMLElement[] = []
    if (marker !== '') {
      const markerEl = document.createElement('span')
      markerEl.className = 'dialog-marker'
      markerEl.textContent = `${marker} `
      nodes.push(markerEl)
    }
    parts.forEach((part, index) => {
      if (index > 0) {
        nodes.push(createSpan(' · '))
      }
      const keyEl = document.createElement('kbd')
      keyEl.className = 'dialog-key'
      keyEl.textContent = part.key
      nodes.push(keyEl, createSpan(` ${part.label}`))
    })
    this.hintEl.replaceChildren(...nodes)
  }


  private createChoice(label: string, onSelect: () => void): HTMLElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = label
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      onSelect()
    })
    return button
  }

  private render(): void {
    const line = this.getCurrentLine()
    this.textEl.textContent = line.slice(0, Math.floor(this.visibleChars))
    const { ui } = getContent()
    const { action } = getKeyLabels()
    if (!this.isLineComplete()) {
      this.setHint([{ key: action, label: ui.hintSkip }])
      return
    }
    const isLast = this.lineIndex >= this.lines.length - 1
    const hasChoice = this.phase === 'summary' && hasMoreToTell(this.entry)
    if (isLast && !hasChoice) {
      this.setHint([{ key: action, label: ui.close }], '■')
      return
    }
    this.setHint([{ key: action, label: ui.hintNext }], '▼')
  }
}
