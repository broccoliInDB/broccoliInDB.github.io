import { type EntryId } from '../content/types'
import { type BuildingStyleId } from './tiles'

export type Facing = 'up' | 'down' | 'left' | 'right'

export interface BuildingPlacement {
  entry: EntryId
  x: number
  top: number
  style: BuildingStyleId
}

export interface PropPlacement {
  x: number
  y: number
  tile: number
  entry?: EntryId
}

export interface PickupPlacement {
  x: number
  y: number
  tile: number
  entry: EntryId
}

export interface Point {
  x: number
  y: number
}

const NORTH_ROW = 7
const SOUTH_ROW = 16

// Hand-placed world. Buildings on the north side open toward the road;
// the lab sits south of the road so visitors have a reason to wander.
export const BUILDINGS: readonly BuildingPlacement[] = [
  { entry: 'hospital', x: 16, top: NORTH_ROW, style: 'blueStone' },
  { entry: 'overseas', x: 30, top: NORTH_ROW, style: 'redStone' },
  { entry: 'techTeam', x: 48, top: NORTH_ROW, style: 'blueStone' },
  { entry: 'office', x: 84, top: NORTH_ROW, style: 'redStone' },
  { entry: 'tower', x: 91, top: NORTH_ROW, style: 'blueStone' },
  { entry: 'meeting', x: 98, top: NORTH_ROW, style: 'redWood' },
  { entry: 'forge', x: 105, top: NORTH_ROW, style: 'blueWood' },
  { entry: 'lab', x: 88, top: SOUTH_ROW, style: 'blueWood' },
]

export const SIGNS: readonly PropPlacement[] = [
  { x: 6, y: 16, tile: 83, entry: 'init' },
  { x: 96, y: 16, tile: 83, entry: 'plaza' },
]

export const DECOR: readonly PropPlacement[] = [
  { x: 24, y: 16, tile: 104 },
  { x: 36, y: 17, tile: 94 },
  { x: 55, y: 16, tile: 80 },
  { x: 56, y: 16, tile: 81 },
  { x: 57, y: 16, tile: 82 },
  { x: 102, y: 17, tile: 104 },
  { x: 81, y: 17, tile: 94 },
]

export const PICKUPS: readonly PickupPlacement[] = [
  { x: 74, y: 16, tile: 117, entry: 'trustKey' },
]

export const WARP_PAD: Point = { x: 3, y: 13 }
export const SPAWN: Point & { facing: Facing } = {
  x: 95,
  y: 13,
  facing: 'down',
}
