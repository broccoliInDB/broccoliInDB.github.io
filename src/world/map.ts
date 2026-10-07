import {
  BUILDING_HEIGHT,
  BUILDING_WIDTH,
  MAP_SEED,
  PATH_BOTTOM_ROW,
  PATH_TOP_ROW,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../config'
import { type EntryId } from '../content/types'
import {
  BUILDINGS,
  DECOR,
  PICKUPS,
  SIGNS,
  WARP_PAD,
  type BuildingPlacement,
} from './layout'
import { BUILDING_STYLES, T } from './tiles'

const EMPTY = -1
const BORDER_DEPTH = 3
const PATH_START_X = 1
const TUFT_CHANCE = 0.08
const FLOWER_CHANCE = 0.03

export interface Interaction {
  x: number
  y: number
  entry: EntryId
}

export interface World {
  width: number
  height: number
  ground: number[]
  deco: number[]
  solid: boolean[]
  talks: Interaction[]
  pickups: Interaction[]
}

function createRandom(seed: number): () => number {
  let state = seed
  return (): number => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function toIndex(x: number, y: number): number {
  return y * WORLD_WIDTH + x
}

function isInside(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < WORLD_WIDTH && y < WORLD_HEIGHT
}

function getPathTile(x: number, y: number): number {
  const isLeftEdge = x === PATH_START_X
  if (y === PATH_TOP_ROW) {
    return isLeftEdge ? T.pathTopLeft : T.pathTop
  }
  if (y === PATH_BOTTOM_ROW) {
    return isLeftEdge ? T.pathBottomLeft : T.pathBottom
  }
  return isLeftEdge ? T.pathLeft : T.path
}

function paintGround(world: World, random: () => number): void {
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const isPath =
        y >= PATH_TOP_ROW && y <= PATH_BOTTOM_ROW && x >= PATH_START_X
      if (isPath) {
        world.ground[toIndex(x, y)] = getPathTile(x, y)
        continue
      }
      const roll = random()
      const tile =
        roll < FLOWER_CHANCE
          ? T.grassFlower
          : roll < FLOWER_CHANCE + TUFT_CHANCE
            ? T.grassTuft
            : T.grass
      world.ground[toIndex(x, y)] = tile
    }
  }
}

function placeSolid(world: World, x: number, y: number, tile: number): void {
  if (!isInside(x, y)) {
    return
  }
  world.deco[toIndex(x, y)] = tile
  world.solid[toIndex(x, y)] = true
}

function plantBorder(world: World, random: () => number): void {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let depth = 0; depth < BORDER_DEPTH; depth++) {
      const pick = (): number => (random() < 0.5 ? T.smallTree : T.roundTree)
      placeSolid(world, x, depth, pick())
      placeSolid(world, x, WORLD_HEIGHT - 1 - depth, pick())
    }
  }
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    placeSolid(world, 0, y, T.smallTree)
    placeSolid(world, WORLD_WIDTH - 1, y, T.smallTree)
  }
}

function stampBuilding(world: World, building: BuildingPlacement): void {
  const style = BUILDING_STYLES[building.style]
  const rows = [style.roofTop, style.roofBottom, style.wallTop]
  rows.forEach(([left, mid, right], rowOffset) => {
    for (let col = 0; col < BUILDING_WIDTH; col++) {
      const tile = col === 0 ? left : col === BUILDING_WIDTH - 1 ? right : mid
      placeSolid(world, building.x + col, building.top + rowOffset, tile)
    }
  })
  const bottomRow = building.top + BUILDING_HEIGHT - 1
  for (let col = 0; col < BUILDING_WIDTH; col++) {
    const isDoor = col === 1
    placeSolid(
      world,
      building.x + col,
      bottomRow,
      isDoor ? style.door : style.window
    )
  }
  world.talks.push({ x: building.x + 1, y: bottomRow, entry: building.entry })
}

export function getBuildingDoor(building: BuildingPlacement): {
  x: number
  y: number
} {
  return { x: building.x + 1, y: building.top + BUILDING_HEIGHT - 1 }
}

export function buildWorld(): World {
  const size = WORLD_WIDTH * WORLD_HEIGHT
  const world: World = {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    ground: new Array<number>(size).fill(T.grass),
    deco: new Array<number>(size).fill(EMPTY),
    solid: new Array<boolean>(size).fill(false),
    talks: [],
    pickups: [],
  }
  const random = createRandom(MAP_SEED)
  paintGround(world, random)
  plantBorder(world, random)
  BUILDINGS.forEach((building) => stampBuilding(world, building))
  SIGNS.forEach((sign) => {
    placeSolid(world, sign.x, sign.y, sign.tile)
    if (sign.entry !== undefined) {
      world.talks.push({ x: sign.x, y: sign.y, entry: sign.entry })
    }
  })
  DECOR.forEach((prop) => placeSolid(world, prop.x, prop.y, prop.tile))
  PICKUPS.forEach((pickup) => {
    world.deco[toIndex(pickup.x, pickup.y)] = pickup.tile
    world.pickups.push({ x: pickup.x, y: pickup.y, entry: pickup.entry })
  })
  world.ground[toIndex(WARP_PAD.x, WARP_PAD.y)] = T.stonePad
  return world
}

export function isSolid(world: World, x: number, y: number): boolean {
  if (!isInside(x, y)) {
    return true
  }
  return world.solid[toIndex(x, y)] === true
}

export function getTile(layer: number[], x: number, y: number): number {
  return layer[toIndex(x, y)] ?? EMPTY
}

export function clearDeco(world: World, x: number, y: number): void {
  world.deco[toIndex(x, y)] = EMPTY
}

export { EMPTY }
