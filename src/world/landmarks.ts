import { BUILDING_HEIGHT } from '../config'
import { type EntryId, type RegionId } from '../content/types'
import { BUILDINGS, SIGNS, type Facing, type Point } from './layout'
import { findRegion } from './regions'

export interface Landmark {
  entry: EntryId
  // The tile the visitor talks to (door or sign).
  target: Point
  // Where fast travel drops the visitor, facing the target.
  stand: Point
  facing: Facing
  region: RegionId
}

// Recommended walk: HEAD first (work → problem → how it was solved),
// then west into the past.
export const ROUTE: readonly EntryId[] = [
  'plaza',
  'office',
  'tower',
  'meeting',
  'forge',
  'lab',
  'techTeam',
  'overseas',
  'hospital',
  'init',
]

function findBuildingLandmark(entry: EntryId): Landmark | undefined {
  const building = BUILDINGS.find((item) => item.entry === entry)
  if (building === undefined) {
    return undefined
  }
  const target = { x: building.x + 1, y: building.top + BUILDING_HEIGHT - 1 }
  return {
    entry,
    target,
    stand: { x: target.x, y: target.y + 1 },
    facing: 'up',
    region: findRegion(target.x).id,
  }
}

function findSignLandmark(entry: EntryId): Landmark | undefined {
  const sign = SIGNS.find((item) => item.entry === entry)
  if (sign === undefined) {
    return undefined
  }
  const target = { x: sign.x, y: sign.y }
  return {
    entry,
    target,
    stand: { x: target.x, y: target.y - 1 },
    facing: 'down',
    region: findRegion(target.x).id,
  }
}

export function getLandmark(entry: EntryId): Landmark | undefined {
  return findBuildingLandmark(entry) ?? findSignLandmark(entry)
}

export function getRouteLandmarks(): Landmark[] {
  return ROUTE.map((entry) => getLandmark(entry)).filter(
    (item): item is Landmark => item !== undefined
  )
}

export function findNextLandmark(
  visited: ReadonlySet<EntryId>
): Landmark | undefined {
  return getRouteLandmarks().find((item) => !visited.has(item.entry))
}
