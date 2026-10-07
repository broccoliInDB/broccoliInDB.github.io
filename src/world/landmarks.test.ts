import { describe, expect, it } from 'vitest'
import { buildWorld, isSolid } from './map'
import {
  findNextLandmark,
  getLandmark,
  getRouteLandmarks,
  ROUTE,
} from './landmarks'

describe('landmarks', () => {
  const world = buildWorld()

  it('gives every route stop a place to stand', () => {
    expect(getRouteLandmarks()).toHaveLength(ROUTE.length)
  })

  it('drops fast travel on a walkable tile facing something to talk to', () => {
    getRouteLandmarks().forEach((landmark) => {
      expect(isSolid(world, landmark.stand.x, landmark.stand.y)).toBe(false)
      const step = landmark.facing === 'up' ? -1 : 1
      const faced = { x: landmark.stand.x, y: landmark.stand.y + step }
      const talk = world.talks.find(
        (item) => item.x === faced.x && item.y === faced.y
      )
      expect(talk?.entry, landmark.entry).toBe(landmark.entry)
    })
  })

  it('starts at HEAD and walks the route in order', () => {
    expect(findNextLandmark(new Set())?.entry).toBe('plaza')
    expect(findNextLandmark(new Set(['plaza']))?.entry).toBe(ROUTE[1])
    expect(findNextLandmark(new Set(ROUTE))).toBeUndefined()
    expect(getLandmark('trustKey')).toBeUndefined()
  })
})
