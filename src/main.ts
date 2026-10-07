import './style.css'
import { LABEL_FONT_SIZE } from './config'
import { fitCanvas } from './ui/viewport'
import { getLang, onLangChange, setLang } from './content'
import { type EntryId } from './content/types'
import { Game } from './game/game'
import { Input } from './game/input'
import { createSpriteSheet } from './sprites/raster'
import { Coach, hasSeenCoach } from './ui/coach'
import { renderDetail, type DetailPanel } from './ui/detail'
import { Dialog } from './ui/dialog'
import { renderRoadmap } from './ui/roadmap'
import { Shell } from './ui/shell'
import { renderTldr } from './ui/tldr'
import { bindTouchControls } from './ui/touch'
import { findNextLandmark, ROUTE } from './world/landmarks'

const MAX_DELTA_SECONDS = 0.05
const TLDR_HASH = '#tldr'
const MAP_HASH = '#map'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = (): void => resolve(image)
    image.onerror = (): void => reject(new Error(`Failed to load ${src}`))
    image.src = src
  })
}

function clearHash(): void {
  if (window.location.hash !== '') {
    history.replaceState(null, '', window.location.pathname)
  }
}

async function main(): Promise<void> {
  const shell = new Shell()
  const input = new Input()
  // Keys pressed while an overlay was up must not leak into the game.
  const flushInput = (): void => {
    input.consumeAction()
    input.consumeCancel()
  }
  let isDetailOpen = false
  let detailPanel: DetailPanel | null = null
  const closeDetail = (): void => {
    isDetailOpen = false
    shell.detailRoot.hidden = true
    flushInput()
  }
  const dialog = new Dialog(shell.dialogRoot, (entry) => {
    isDetailOpen = true
    detailPanel = renderDetail(shell.detailRoot, entry, closeDetail)
    shell.detailRoot.hidden = false
    shell.detailRoot.scrollTop = 0
  })
  const game = new Game(input, dialog, {
    onRegionChange: (region) => shell.showRegion(region),
    onToast: (message) => shell.showToast(message),
    onColorGrade: (grade) => shell.applyColorGrade(grade),
    onKeysChange: (mode) => shell.showKeys(mode),
    onVisit: (visited) => {
      shell.showQuest({
        next: findNextLandmark(visited)?.entry,
        seen: ROUTE.filter((entry) => visited.has(entry)).length,
        total: ROUTE.length,
      })
    },
  })
  const coach = new Coach(shell.coachRoot, {
    player: shell.focusRing,
    quest: shell.questButton,
    map: shell.mapButton,
  })

  input.attachKeyboard(window)
  bindTouchControls(shell.touchRoot, input)
  setLang(getLang())
  shell.applyText()

  let isStarted = false
  let isTldrOpen = false
  let isMapOpen = false

  const isPaused = (): boolean =>
    !isStarted || isTldrOpen || isMapOpen || isDetailOpen || coach.isOpen()

  const startGame = (shouldGuide: boolean): void => {
    if (isStarted) {
      return
    }
    isStarted = true
    shell.titleRoot.hidden = true
    flushInput()
    game.start()
    if (shouldGuide && !hasSeenCoach()) {
      coach.start(flushInput)
    }
  }

  const closeTldr = (): void => {
    isTldrOpen = false
    shell.tldrRoot.hidden = true
    clearHash()
    flushInput()
  }
  const openTldr = (): void => {
    isTldrOpen = true
    renderTldr(shell.tldrRoot, closeTldr)
    shell.tldrRoot.hidden = false
  }

  const closeMap = (): void => {
    isMapOpen = false
    shell.mapRoot.hidden = true
    clearHash()
    flushInput()
  }
  const travelTo = (entry: EntryId): void => {
    closeMap()
    startGame(false)
    game.travelTo(entry)
  }
  const renderMap = (): void => {
    renderRoadmap(shell.mapRoot, {
      visited: game.getVisited(),
      onTravel: travelTo,
      onClose: closeMap,
      onOpenTldr: () => {
        closeMap()
        openTldr()
      },
      onReplayGuide: () => {
        closeMap()
        startGame(false)
        coach.start(flushInput)
      },
    })
  }
  const openMap = (): void => {
    coach.finish()
    isMapOpen = true
    renderMap()
    shell.mapRoot.hidden = false
    shell.mapRoot.scrollTop = 0
  }
  const toggleMap = (): void => (isMapOpen ? closeMap() : openMap())

  onLangChange(() => {
    shell.applyText()
    dialog.close()
    if (isDetailOpen) {
      closeDetail()
    }
    coach.render()
    if (isTldrOpen) {
      renderTldr(shell.tldrRoot, closeTldr)
    }
    if (isMapOpen) {
      renderMap()
    }
  })

  shell.startButton.addEventListener('click', () => startGame(true))
  shell.titleMapButton.addEventListener('click', openMap)
  shell.titleRoot
    .querySelectorAll<HTMLButtonElement>('[data-lang]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        setLang(button.dataset.lang === 'en' ? 'en' : 'ko')
      })
    })
  shell.langButton.addEventListener('click', () => {
    setLang(getLang() === 'ko' ? 'en' : 'ko')
  })
  shell.mapButton.addEventListener('click', toggleMap)
  shell.questButton.addEventListener('click', openMap)
  shell.tldrButton.addEventListener('click', () =>
    isTldrOpen ? closeTldr() : openTldr()
  )

  window.addEventListener('keydown', (event) => {
    const isConfirmKey = event.code === 'Enter' || event.code === 'Space'
    if (isDetailOpen) {
      if (event.code === 'Escape') {
        closeDetail()
      } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        detailPanel?.moveTab(event.code === 'ArrowLeft' ? -1 : 1)
      }
      return
    }
    if (event.code === 'Escape' && (isTldrOpen || isMapOpen)) {
      return isTldrOpen ? closeTldr() : closeMap()
    }
    if (coach.isOpen()) {
      if (event.code === 'Escape') {
        coach.finish()
      } else if (isConfirmKey) {
        coach.next()
      }
      return
    }
    if (event.code === 'KeyM' && !isTldrOpen && !dialog.isOpen()) {
      toggleMap()
      return
    }
    if (!isStarted && !isTldrOpen && !isMapOpen && isConfirmKey) {
      startGame(true)
    }
  })

  if (window.location.hash === TLDR_HASH) {
    openTldr()
  }
  if (window.location.hash === MAP_HASH) {
    openMap()
  }

  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('start')) {
      startGame(!params.has('noguide'))
    }
    const x = Number(params.get('x'))
    const y = Number(params.get('y'))
    if (params.has('x') && params.has('y')) {
      const facing = params.get('f') === 'up' ? 'up' : 'down'
      game.placeAt(x, y, facing)
    }
    const entry = params.get('entry')
    if (entry !== null) {
      game.openEntry(entry as EntryId)
    }
  }

  const [tileset] = await Promise.all([
    loadImage('/tiles.png'),
    document.fonts.load(`${LABEL_FONT_SIZE}px Galmuri9`),
  ])
  const assets = { tileset, sprites: createSpriteSheet() }
  const ctx = shell.canvas.getContext('2d')
  if (ctx === null) {
    return
  }

  let view = fitCanvas(shell.canvas, shell.stage)
  window.addEventListener('resize', () => {
    view = fitCanvas(shell.canvas, shell.stage)
  })

  let lastTime = performance.now()
  const frame = (now: number): void => {
    const delta = Math.min(MAX_DELTA_SECONDS, (now - lastTime) / 1000)
    lastTime = now
    if (!isPaused()) {
      game.update(delta)
    }
    game.render(ctx, assets, view.width, view.height)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

void main()
