import { getContent, getLang } from '../content'
import { type EntryId, type RegionId } from '../content/types'
import { type ColorGrade } from '../world/regions'
import { getKeyLabels, isTouchDevice, type KeysMode } from './keys'

const TOAST_MS = 2200
const GRADE_EPSILON = 0.01

function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (el === null) {
    throw new Error(`Missing #${id}`)
  }
  return el as T
}

export interface QuestState {
  next: EntryId | undefined
  seen: number
  total: number
}

export class Shell {
  readonly canvas = getElement<HTMLCanvasElement>('screen')
  readonly stage = getElement<HTMLElement>('stage')
  readonly dialogRoot = getElement<HTMLElement>('dialog')
  readonly touchRoot = getElement<HTMLElement>('touch')
  readonly titleRoot = getElement<HTMLElement>('title')
  readonly resumeRoot = getElement<HTMLElement>('resume')
  readonly cinemaRoot = getElement<HTMLElement>('cinema')
  readonly detailRoot = getElement<HTMLElement>('detail')
  readonly startButton = getElement<HTMLButtonElement>('start-btn')
  readonly langButton = getElement<HTMLButtonElement>('lang-btn')
  readonly tldrButton = getElement<HTMLButtonElement>('tldr-btn')
  readonly mapButton = getElement<HTMLButtonElement>('map-btn')
  readonly titleMapButton = getElement<HTMLButtonElement>('title-map-btn')
  readonly mapRoot = getElement<HTMLElement>('map')
  readonly coachRoot = getElement<HTMLElement>('coach')
  readonly questButton = getElement<HTMLButtonElement>('quest')
  readonly focusRing = getElement<HTMLElement>('focus-ring')
  private readonly hud = getElement<HTMLElement>('hud')
  private readonly toast = getElement<HTMLElement>('toast')
  private readonly keys = getElement<HTMLElement>('keys')
  private readonly keysTalk = getElement<HTMLElement>('keys-talk')
  private readonly keysControls = getElement<HTMLElement>('keys-controls')
  private readonly subtitle = getElement<HTMLElement>('title-subtitle')
  private readonly hint = getElement<HTMLElement>('title-hint')
  private toastTimer: number | undefined
  private lastGrade: ColorGrade = { grayscale: -1, sepia: -1 }
  private region: RegionId = 'head'
  private quest: QuestState = { next: undefined, seen: 0, total: 0 }
  private keysMode: KeysMode = 'dialog'

  applyText(): void {
    const { ui } = getContent()
    const lang = getLang()
    const isTouch = isTouchDevice()
    this.subtitle.textContent = ui.subtitle
    this.hint.textContent = isTouch ? ui.touchHint : ui.controlsHint
    this.startButton.textContent = ui.pressStart
    this.tldrButton.textContent = ui.tldr
    this.mapButton.textContent = ui.map
    this.titleMapButton.textContent = ui.titleMap
    this.langButton.textContent = lang === 'ko' ? 'EN' : '한'
    this.langButton.setAttribute(
      'aria-label',
      lang === 'ko' ? 'Switch to English' : '한국어로 전환'
    )
    this.titleRoot
      .querySelectorAll<HTMLButtonElement>('[data-lang]')
      .forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.lang === lang)
        )
      })
    this.showRegion(this.region)
    this.showQuest(this.quest)
    this.showKeys(this.keysMode)
  }

  showQuest(quest: QuestState): void {
    this.quest = quest
    const { ui, entries } = getContent()
    const progress = `${quest.seen}/${quest.total}`
    if (quest.next === undefined) {
      this.questButton.textContent = `★ ${ui.questDone} · ${progress}`
      return
    }
    const title = entries[quest.next].title
    this.questButton.textContent = `▶ ${ui.questNext}: ${title} · ${progress}`
  }

  showRegion(region: RegionId): void {
    this.region = region
    const label = getContent().regions[region]
    this.hud.textContent = `⎇ ${label.tag} · ${label.name} (${label.period})`
  }

  // Bottom-center key bar: the full control list stays visible while walking,
  // and facing a door adds a highlighted prompt above it. Hidden while a dialog
  // shows its own hint. Touch players already see the pad, so they only get
  // the door prompt.
  showKeys(mode: KeysMode): void {
    this.keysMode = mode
    const { ui } = getContent()
    const isTouch = isTouchDevice()
    const isTalk = mode === 'talk'
    this.keys.hidden = mode === 'dialog' || (mode === 'walk' && isTouch)
    this.keysTalk.hidden = !isTalk
    this.keysTalk.textContent = `▶ ${getKeyLabels().action} ${ui.hintTalk}`
    this.keysControls.hidden = isTouch
    this.keysControls.textContent = ui.controlsHint
  }

  showToast(message: string): void {
    this.toast.textContent = message
    this.toast.hidden = false
    window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => {
      this.toast.hidden = true
    }, TOAST_MS)
  }

  applyColorGrade(grade: ColorGrade): void {
    const hasChanged =
      Math.abs(grade.grayscale - this.lastGrade.grayscale) > GRADE_EPSILON ||
      Math.abs(grade.sepia - this.lastGrade.sepia) > GRADE_EPSILON
    if (!hasChanged) {
      return
    }
    this.lastGrade = grade
    const filter = `grayscale(${grade.grayscale.toFixed(2)}) sepia(${grade.sepia.toFixed(2)})`
    this.canvas.style.filter = filter
  }
}
