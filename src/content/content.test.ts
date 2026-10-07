import { describe, expect, it } from 'vitest'
import { FRAMES, PALETTE, SPRITE_SIZE } from '../sprites/broccoli'
import { computeViewSize } from '../ui/viewport'
import { BUILDINGS } from '../world/layout'
import { en } from './en'
import { ko } from './ko'

describe('content', () => {
  it('has the same entries in Korean and English', () => {
    expect(Object.keys(en.entries).sort()).toEqual(
      Object.keys(ko.entries).sort()
    )
    Object.entries(ko.entries).forEach(([id, entry]) => {
      const english = en.entries[id as keyof typeof en.entries]
      expect(english.more.length, id).toBe(entry.more.length)
      expect(english.cards?.length, id).toBe(entry.cards?.length)
    })
  })

  it('has the same detail tabs and diagrams in Korean and English', () => {
    const shape = (content: typeof ko): unknown =>
      Object.values(content.entries).map((entry) =>
        entry.tabs?.map((tab) =>
          [...tab.items, ...(tab.more ?? [])].map((item) => [
            item.flow?.kind,
            item.flow?.kind === 'compare'
              ? [item.flow.before.length, item.flow.after.length]
              : item.flow?.steps.length,
            item.situation === undefined,
            item.decision === undefined,
            item.result === undefined,
            item.body === undefined,
          ])
        )
      )
    expect(shape(en)).toEqual(shape(ko))
  })

  it('has the same coach steps in Korean and English', () => {
    expect(en.ui.coach.map((step) => step.target)).toEqual(
      ko.ui.coach.map((step) => step.target)
    )
  })

  it('keeps building labels short enough to sit on a roof', () => {
    const maxLabelChars = 14
    ;[ko, en].forEach((content) => {
      BUILDINGS.forEach((building) => {
        const label = content.entries[building.entry].title.split(' · ')[0]
        expect(label?.length ?? 0, label).toBeLessThanOrEqual(maxLabelChars)
      })
    })
  })

  // Employers the owner chose to name (홈쇼핑모아, 이지케어텍) are allowed;
  // the operating company and hospital clients stay unnamed.
  it('does not name unapproved companies or clients', () => {
    const banned = ['버즈니', 'Buzzni', 'Aurora', '서울대']
    const text = JSON.stringify([ko, en])
    banned.forEach((word) => expect(text).not.toContain(word))
  })
})

describe('sprites', () => {
  it('draws every frame as a full 16×16 grid with known colors', () => {
    Object.values(FRAMES)
      .flat()
      .forEach((frame) => {
        expect(frame).toHaveLength(SPRITE_SIZE)
        frame.forEach((row) => {
          expect(row).toHaveLength(SPRITE_SIZE)
          ;[...row].forEach((char) => {
            expect(char === '.' || char in PALETTE, char).toBe(true)
          })
        })
      })
  })
})

describe('viewport', () => {
  it('widens on landscape and grows taller on portrait', () => {
    expect(computeViewSize(1280, 720)).toEqual({ width: 312, height: 176 })
    expect(computeViewSize(390, 640).width).toBe(160)
    expect(computeViewSize(390, 640).height).toBeGreaterThan(176)
  })
})
