import { REGION_FADE_TILES } from '../config'
import { type RegionId } from '../content/types'

export interface Region {
  id: RegionId
  startX: number
  endX: number
  grayscale: number
  sepia: number
}

// Ordered west (past) → east (present). Color drains as you walk into the past.
export const REGIONS: readonly Region[] = [
  { id: 'init', startX: 0, endX: 11, grayscale: 1, sepia: 0.15 },
  { id: 'v01', startX: 12, endX: 39, grayscale: 0.95, sepia: 0.1 },
  { id: 'v15', startX: 40, endX: 61, grayscale: 0.7, sepia: 0.25 },
  { id: 'v19', startX: 62, endX: 79, grayscale: 0.2, sepia: 0.55 },
  { id: 'head', startX: 80, endX: 111, grayscale: 0, sepia: 0 },
]

export function findRegion(tileX: number): Region {
  const region = REGIONS.find((r) => tileX >= r.startX && tileX <= r.endX)
  return region ?? REGIONS[REGIONS.length - 1]!
}

function lerp(from: number, to: number, ratio: number): number {
  return from + (to - from) * ratio
}

export interface ColorGrade {
  grayscale: number
  sepia: number
}

// Blends the grade of neighbouring regions near a boundary so the
// transition feels like walking back in time rather than a hard cut.
export function getColorGrade(worldTileX: number): ColorGrade {
  const region = findRegion(Math.floor(worldTileX))
  const index = REGIONS.indexOf(region)
  const next = REGIONS[index + 1]
  if (next === undefined) {
    return { grayscale: region.grayscale, sepia: region.sepia }
  }
  const fadeStart = region.endX + 1 - REGION_FADE_TILES
  if (worldTileX < fadeStart) {
    return { grayscale: region.grayscale, sepia: region.sepia }
  }
  const ratio = Math.min(1, (worldTileX - fadeStart) / REGION_FADE_TILES)
  return {
    grayscale: lerp(region.grayscale, next.grayscale, ratio),
    sepia: lerp(region.sepia, next.sepia, ratio),
  }
}
