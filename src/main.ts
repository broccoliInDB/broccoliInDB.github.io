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
import { renderCinema, type CinemaCallbacks } from './ui/cinema'
import { renderResume } from './ui/resume'
import { CareerWalk } from './careerwalk/careerwalk'
import { bindTouchControls } from './ui/touch'
import { createTileset } from './world/codeworld-tiles'
import { findNextLandmark, ROUTE } from './world/landmarks'

const MAX_DELTA_SECONDS = 0.05
const MAP_HASH = '#map'
const TLDR_HASH = '#resume'
const GAME_HASH = '#game'

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
  // The career-walk decision game. Esc / ✕ steps back to the previous view.
  const careerwalk = new CareerWalk((): void => {
    history.back()
  })

  input.attachKeyboard(window)
  bindTouchControls(shell.touchRoot, input)
  setLang(getLang())
  shell.applyText()

  let isStarted = false
  let isTldrOpen = false
  let isMapOpen = false
  let isGameOpen = false

  const isPaused = (): boolean =>
    !isStarted ||
    isTldrOpen ||
    isMapOpen ||
    isDetailOpen ||
    isGameOpen ||
    coach.isOpen() ||
    !shell.cinemaRoot.hidden

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

  // Hash router. applyRoute() is the single place that shows/hides views: it
  // reconciles the DOM to location.hash and never touches history. Forward
  // navigation pushes a hash via go(); closing/back uses history.back(), whose
  // popstate re-runs applyRoute() to reveal the previous view.
  //   cinema → no hash   resume → #resume   game → #game   map → #map
  const closeTldr = (): void => {
    if (isTldrOpen) history.back()
  }

  const renderMap = (): void => {
    renderRoadmap(shell.mapRoot, {
      visited: game.getVisited(),
      onTravel: travelTo,
      onClose: () => history.back(),
      onOpenTldr: () => go(TLDR_HASH),
      onReplayGuide: () => {
        go(GAME_HASH)
        coach.start(flushInput)
      },
    })
  }

  // The scroll cinema is the landing narrative; from it you step into the game
  // (onWalk) or the detailed resume (onResume).
  const cinemaCbs: CinemaCallbacks = {
    onWalk: (): void => go(GAME_HASH),
    onResume: (): void => go(TLDR_HASH),
  }
  const openCinema = (): void => {
    renderCinema(shell.cinemaRoot, cinemaCbs)
    shell.cinemaRoot.hidden = false
  }

  const showResume = (): void => {
    isTldrOpen = true
    renderResume(shell.resumeRoot, closeTldr)
    shell.resumeRoot.hidden = false
    shell.resumeRoot.scrollTop = 0
  }
  const hideResume = (): void => {
    if (!isTldrOpen) return
    isTldrOpen = false
    shell.resumeRoot.hidden = true
    flushInput()
  }
  const showMap = (): void => {
    coach.finish()
    isMapOpen = true
    renderMap()
    shell.mapRoot.hidden = false
    shell.mapRoot.scrollTop = 0
  }
  const hideMap = (): void => {
    if (!isMapOpen) return
    isMapOpen = false
    shell.mapRoot.hidden = true
    flushInput()
  }
  // The career-walk game mounts into its own full-screen root and owns its
  // input; it tears down on exit so re-entry restarts fresh.
  const openGame = (): void => {
    if (isGameOpen) return
    isGameOpen = true
    shell.careerwalkRoot.hidden = false
    careerwalk.start(shell.careerwalkRoot)
  }
  const closeGame = (): void => {
    if (!isGameOpen) return
    isGameOpen = false
    careerwalk.stop()
    shell.careerwalkRoot.hidden = true
    flushInput()
  }

  const applyRoute = (): void => {
    switch (window.location.hash) {
      case TLDR_HASH:
        closeGame()
        hideMap()
        if (!isTldrOpen) showResume()
        break
      case MAP_HASH:
        closeGame()
        hideResume()
        if (!isMapOpen) showMap()
        break
      case GAME_HASH:
        hideResume()
        hideMap()
        shell.cinemaRoot.hidden = true
        openGame()
        break
      default:
        // Cinema (empty/unknown hash) is the landing; leaving the game returns
        // here and tears the game down.
        closeGame()
        hideResume()
        hideMap()
        openCinema()
    }
  }
  const go = (hash: string): void => {
    history.pushState(null, '', hash === '' ? window.location.pathname : hash)
    applyRoute()
  }
  const toggleMap = (): void => {
    if (isMapOpen) history.back()
    else go(MAP_HASH)
  }
  const travelTo = (entry: EntryId): void => {
    go(GAME_HASH)
    game.travelTo(entry)
  }
  window.addEventListener('popstate', applyRoute)

  onLangChange(() => {
    shell.applyText()
    dialog.close()
    if (isDetailOpen) {
      closeDetail()
    }
    coach.render()
    if (isTldrOpen) {
      renderResume(shell.resumeRoot, closeTldr)
    }
    if (isMapOpen) {
      renderMap()
    }
    if (!shell.cinemaRoot.hidden) {
      renderCinema(shell.cinemaRoot, cinemaCbs)
    }
  })

  shell.startButton.addEventListener('click', () => go(GAME_HASH))
  shell.titleMapButton.addEventListener('click', toggleMap)
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
  shell.questButton.addEventListener('click', toggleMap)
  shell.tldrButton.addEventListener('click', () =>
    isTldrOpen ? history.back() : go(TLDR_HASH)
  )

  window.addEventListener('keydown', (event) => {
    // The career-walk game owns all keys while open (its own window listener).
    if (isGameOpen) {
      return
    }
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
      history.back()
      return
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
      go(GAME_HASH)
    }
  })

  // Career page is the landing; the old title screen is retired.
  shell.titleRoot.hidden = true
  let bootedToGame = false

  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('start')) {
      startGame(!params.has('noguide'))
      bootedToGame = true
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

  // A DEV ?start boot already entered the game; reflect it in the URL so Back
  // returns to the landing. Otherwise applyRoute() reconciles to the loaded
  // hash (#resume/#game/#map), defaulting to cinema.
  if (bootedToGame) {
    history.replaceState(null, '', GAME_HASH)
  }
  applyRoute()

  await document.fonts.load(`${LABEL_FONT_SIZE}px Galmuri9`)
  const assets = { tileset: createTileset(), sprites: createSpriteSheet() }
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
