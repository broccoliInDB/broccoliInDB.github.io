import { getContent } from '../content'
import { type EntryId, type RegionId } from '../content/types'
import { type Dialog } from '../ui/dialog'
import { type KeysMode } from '../ui/keys'
import { BUILDING_WIDTH } from '../config'
import { BUILDINGS, SPAWN, WARP_PAD, type Facing } from '../world/layout'
import {
  buildWorld,
  clearDeco,
  isSolid,
  type Interaction,
  type World,
} from '../world/map'
import {
  findNextLandmark,
  getLandmark,
  type Landmark,
} from '../world/landmarks'
import { findRegion, getColorGrade, type ColorGrade } from '../world/regions'
import { type Input } from './input'
import {
  advanceStep,
  createPlayer,
  getFacingTile,
  getRenderPosition,
  isMoving,
  teleport,
  tryStartStep,
  type PlayerState,
} from './player'
import {
  computeCamera,
  renderFrame,
  type Label,
  type Objective,
  type RenderAssets,
} from './renderer'

const LABEL_ROOF_OFFSET = 1.55
const VISITED_MARK = '✓ '

export interface GameHooks {
  onRegionChange: (region: RegionId) => void
  onToast: (message: string) => void
  onColorGrade: (grade: ColorGrade) => void
  onVisit: (visited: ReadonlySet<EntryId>) => void
  onKeysChange: (mode: KeysMode) => void
}

export class Game {
  private readonly world: World = buildWorld()
  private readonly player: PlayerState = createPlayer(SPAWN, SPAWN.facing)
  private readonly collected = new Set<EntryId>()
  private readonly visited = new Set<EntryId>()
  private elapsedSeconds = 0
  private region: RegionId
  private keysMode: KeysMode | null = null

  constructor(
    private readonly input: Input,
    private readonly dialog: Dialog,
    private readonly hooks: GameHooks
  ) {
    this.region = findRegion(this.player.tileX).id
  }

  start(): void {
    this.hooks.onRegionChange(this.region)
    this.hooks.onVisit(this.visited)
  }

  getVisited(): ReadonlySet<EntryId> {
    return this.visited
  }

  getNextLandmark(): Landmark | undefined {
    return findNextLandmark(this.visited)
  }

  // Fast travel from the map: land in front of the place and start talking.
  travelTo(entry: EntryId): void {
    const landmark = getLandmark(entry)
    if (landmark === undefined) {
      return
    }
    teleport(this.player, landmark.stand, landmark.facing)
    this.checkRegion()
    this.talkTo(entry)
  }

  // Dev-only shortcut for visual checks (see main.ts).
  placeAt(x: number, y: number, facing: Facing): void {
    teleport(this.player, { x, y }, facing)
    this.checkRegion()
  }

  openEntry(entry: EntryId): void {
    this.dialog.open(getContent().entries[entry])
  }

  private talkTo(entry: EntryId): void {
    this.dialog.open(getContent().entries[entry])
    if (this.visited.has(entry)) {
      return
    }
    this.visited.add(entry)
    this.hooks.onVisit(this.visited)
  }

  update(deltaSeconds: number): void {
    this.elapsedSeconds += deltaSeconds
    if (this.dialog.isOpen()) {
      this.updateDialog(deltaSeconds)
      return
    }
    if (this.input.consumeCancel()) {
      return
    }
    if (isMoving(this.player)) {
      const hasArrived = advanceStep(this.player, deltaSeconds)
      if (hasArrived) {
        this.onArrive()
      }
      return
    }
    if (this.input.consumeAction()) {
      this.interact()
      return
    }
    const direction = this.input.getDirection()
    if (direction !== null) {
      tryStartStep(this.player, direction, this.input.isRunning(), (x, y) =>
        isSolid(this.world, x, y)
      )
    }
  }

  private updateDialog(deltaSeconds: number): void {
    this.dialog.update(deltaSeconds)
    if (this.input.consumeCancel()) {
      this.dialog.handleCancel()
      return
    }
    if (this.input.consumeAction()) {
      this.dialog.handleAction()
    }
  }

  private findFacingTalk(): Interaction | undefined {
    const target = getFacingTile(this.player)
    return this.world.talks.find(
      (item) => item.x === target.x && item.y === target.y
    )
  }

  private interact(): void {
    const talk = this.findFacingTalk()
    if (talk === undefined) {
      return
    }
    this.talkTo(talk.entry)
  }

  private canInteract(): boolean {
    return (
      !isMoving(this.player) &&
      !this.dialog.isOpen() &&
      this.findFacingTalk() !== undefined
    )
  }

  private getLabels(): Label[] {
    const { entries } = getContent()
    return BUILDINGS.map((building) => ({
      text:
        (this.visited.has(building.entry) ? VISITED_MARK : '') +
        (entries[building.entry].title.split(' · ')[0] ?? ''),
      centerX: building.x + BUILDING_WIDTH / 2,
      topY: building.top + LABEL_ROOF_OFFSET,
    }))
  }

  private onArrive(): void {
    this.checkPickup()
    this.checkWarp()
    this.checkRegion()
  }

  private checkPickup(): void {
    const pickup = this.world.pickups.find(
      (item) => item.x === this.player.tileX && item.y === this.player.tileY
    )
    if (pickup === undefined || this.collected.has(pickup.entry)) {
      return
    }
    this.collected.add(pickup.entry)
    clearDeco(this.world, pickup.x, pickup.y)
    const content = getContent()
    const entry = content.entries[pickup.entry]
    this.hooks.onToast(`${content.ui.pickedUp}: ${entry.title}`)
    this.dialog.open(entry)
  }

  private checkWarp(): void {
    const isOnWarp =
      this.player.tileX === WARP_PAD.x && this.player.tileY === WARP_PAD.y
    if (!isOnWarp) {
      return
    }
    teleport(this.player, SPAWN, SPAWN.facing)
    this.hooks.onToast(getContent().ui.warp)
  }

  private checkRegion(): void {
    const next = findRegion(this.player.tileX).id
    if (next === this.region) {
      return
    }
    this.region = next
    this.hooks.onRegionChange(next)
    const label = getContent().regions[next]
    this.hooks.onToast(`$ git checkout ${label.tag}`)
  }

  private getObjective(): Objective | undefined {
    if (this.dialog.isOpen()) {
      return undefined
    }
    const next = this.getNextLandmark()
    if (next === undefined) {
      return undefined
    }
    const title = getContent().entries[next.entry].title
    return { target: next.target, name: title.split(' · ')[0] ?? title }
  }

  render(
    ctx: CanvasRenderingContext2D,
    assets: RenderAssets,
    viewWidth: number,
    viewHeight: number
  ): void {
    const focus = getRenderPosition(this.player)
    const camera = computeCamera(this.world, focus, viewWidth, viewHeight)
    renderFrame(ctx, assets, this.world, this.player, camera, {
      labels: this.getLabels(),
      canInteract: this.canInteract(),
      objective: this.getObjective(),
      elapsedSeconds: this.elapsedSeconds,
    })
    this.hooks.onColorGrade(getColorGrade(focus.x + 0.5))
    this.updateKeysMode()
  }

  private updateKeysMode(): void {
    const mode: KeysMode = this.dialog.isOpen()
      ? 'dialog'
      : this.canInteract()
        ? 'talk'
        : 'walk'
    if (mode === this.keysMode) {
      return
    }
    this.keysMode = mode
    this.hooks.onKeysChange(mode)
  }
}
