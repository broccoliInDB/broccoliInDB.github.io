// Tile indices in the Kenney "Tiny Town" packed sheet (12 columns, CC0).
export const T = {
  grass: 0,
  grassTuft: 1,
  grassFlower: 2,
  roundTree: 5,
  sprout: 17,
  smallTree: 28,
  smallOrangeTree: 27,
  mushrooms: 29,
  pathTopLeft: 12,
  pathTop: 13,
  pathTopRight: 14,
  pathLeft: 24,
  path: 25,
  pathRight: 26,
  pathBottomLeft: 36,
  pathBottom: 37,
  pathBottomRight: 38,
  stonePad: 43,
  sign: 83,
  fenceLeft: 80,
  fenceMid: 81,
  fenceRight: 82,
  well: 104,
  key: 117,
  beehive: 94,
} as const

export interface BuildingStyle {
  roofTop: readonly [number, number, number]
  roofBottom: readonly [number, number, number]
  wallTop: readonly [number, number, number]
  window: number
  door: number
}

export const BUILDING_STYLES = {
  redWood: {
    roofTop: [52, 53, 54],
    roofBottom: [64, 65, 66],
    wallTop: [72, 73, 75],
    window: 84,
    door: 85,
  },
  blueStone: {
    roofTop: [48, 49, 50],
    roofBottom: [60, 61, 62],
    wallTop: [76, 77, 79],
    window: 88,
    door: 89,
  },
  redStone: {
    roofTop: [52, 53, 54],
    roofBottom: [64, 65, 66],
    wallTop: [76, 77, 79],
    window: 88,
    door: 89,
  },
  blueWood: {
    roofTop: [48, 49, 50],
    roofBottom: [60, 61, 62],
    wallTop: [72, 73, 75],
    window: 84,
    door: 85,
  },
} as const satisfies Record<string, BuildingStyle>

export type BuildingStyleId = keyof typeof BUILDING_STYLES
