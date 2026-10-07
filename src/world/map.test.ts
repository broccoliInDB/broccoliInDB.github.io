import { describe, expect, it } from 'vitest'
import { SPAWN, WARP_PAD, type Point } from './layout'
import { buildWorld, isSolid, type World } from './map'
import { findRegion, getColorGrade, REGIONS } from './regions'

const NEIGHBOURS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

function findReachable(world: World, start: Point): Set<string> {
  const key = (p: Point): string => `${p.x},${p.y}`
  const seen = new Set<string>([key(start)])
  const queue: Point[] = [start]
  while (queue.length > 0) {
    const current = queue.shift()
    if (current === undefined) {
      break
    }
    NEIGHBOURS.forEach((step) => {
      const next = { x: current.x + step.x, y: current.y + step.y }
      if (isSolid(world, next.x, next.y) || seen.has(key(next))) {
        return
      }
      seen.add(key(next))
      queue.push(next)
    })
  }
  return seen
}

describe('world', () => {
  const world = buildWorld()
  const reachable = findReachable(world, SPAWN)

  it('spawns the player on a walkable tile', () => {
    expect(isSolid(world, SPAWN.x, SPAWN.y)).toBe(false)
  })

  it('lets the player stand next to every talkable thing', () => {
    world.talks.forEach((talk) => {
      const hasStandingSpot = NEIGHBOURS.some((step) =>
        reachable.has(`${talk.x + step.x},${talk.y + step.y}`)
      )
      expect(hasStandingSpot, `${talk.entry} is unreachable`).toBe(true)
    })
  })

  it('makes every pickup and the warp pad reachable', () => {
    world.pickups.forEach((pickup) => {
      expect(reachable.has(`${pickup.x},${pickup.y}`)).toBe(true)
    })
    expect(reachable.has(`${WARP_PAD.x},${WARP_PAD.y}`)).toBe(true)
  })

  it('is deterministic', () => {
    expect(buildWorld().ground).toEqual(world.ground)
  })
})

describe('regions', () => {
  it('covers every column without gaps, ending at HEAD', () => {
    REGIONS.slice(1).forEach((region, index) => {
      expect(region.startX).toBe((REGIONS[index]?.endX ?? -1) + 1)
    })
    expect(findRegion(SPAWN.x).id).toBe('head')
  })

  it('drains color toward the past', () => {
    expect(getColorGrade(SPAWN.x).grayscale).toBe(0)
    expect(getColorGrade(5).grayscale).toBe(1)
  })
})
