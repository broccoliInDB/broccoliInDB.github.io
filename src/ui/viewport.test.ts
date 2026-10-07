import { describe, expect, it } from 'vitest'
import { computeCanvasFit } from './viewport'

describe('computeCanvasFit', () => {
  it('upscales by whole device pixels and fills the stage', () => {
    const fit = computeCanvasFit(1400, 800, 1)
    expect(fit.scale).toBe(4)
    expect(fit.view).toEqual({ width: 320, height: 200 })
    expect(fit.view.height * fit.scale).toBe(800)
  })

  it('snaps to device pixels on high-density screens', () => {
    const fit = computeCanvasFit(390, 640, 3)
    expect(Number.isInteger(fit.scale * 3)).toBe(true)
    expect(fit.view.width * fit.scale).toBeLessThanOrEqual(390)
    expect(fit.view.height * fit.scale).toBeLessThanOrEqual(640)
  })

  it('never shows less than the base view', () => {
    const fit = computeCanvasFit(1280, 720, 1)
    expect(fit.view.width).toBeGreaterThanOrEqual(312)
    expect(fit.view.height).toBeGreaterThanOrEqual(176)
  })
})
