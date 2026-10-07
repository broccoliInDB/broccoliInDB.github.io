// broccoli — the only hand-drawn sprite. 16×16, one char per pixel.
export const SPRITE_SIZE = 16

export const PALETTE: Record<string, string> = {
  k: '#2b1d2e',
  l: '#a5dd6b',
  g: '#5fb34a',
  G: '#2f7d3a',
  s: '#f6cfa6',
  m: '#d9796b',
  b: '#3f6fd1',
  w: '#e8eefc',
  p: '#3a3550',
}

const CROWN = [
  '....kkk..kkk....',
  '...kgglkkgglk...',
  '..kgglggggglgk..',
  '.kggGgggGgggGgk.',
  '.kgGggGgggGggGk.',
  '.kGGgGGGgGGGgGk.',
  '..kkGGkkkkGGkk..',
]

const BODY = ['...kbbbbbbbbk...', '..kbbbbwwbbbbk..', '..ksbbbbbbbbsk..']

const LEGS_STAND = ['...kppppppppk...', '...kkk....kkk...']
const LEGS_STEP_A = ['...kppk..kppk...', '..kkk.....kk....']
const LEGS_STEP_B = ['...kppk..kppk...', '....kk.....kkk..']

const FACE_FRONT = [
  '...kssssssssk...',
  '...kskssssksk...',
  '...ksssmmsssk...',
  '....kssssssk....',
]

const FACE_BACK = [
  '...kGGGGGGGGk...',
  '...kssssssssk...',
  '...kssssssssk...',
  '....kssssssk....',
]

const FACE_SIDE = [
  '...kssssssssk...',
  '...kssssskssk...',
  '...kssssssmsk...',
  '....kssssssk....',
]

function compose(face: string[], legs: string[]): string[] {
  return [...CROWN, ...face, ...BODY, ...legs]
}

export type SpriteDirection = 'down' | 'up' | 'side'

export const FRAMES: Record<SpriteDirection, string[][]> = {
  down: [
    compose(FACE_FRONT, LEGS_STAND),
    compose(FACE_FRONT, LEGS_STEP_A),
    compose(FACE_FRONT, LEGS_STAND),
    compose(FACE_FRONT, LEGS_STEP_B),
  ],
  up: [
    compose(FACE_BACK, LEGS_STAND),
    compose(FACE_BACK, LEGS_STEP_A),
    compose(FACE_BACK, LEGS_STAND),
    compose(FACE_BACK, LEGS_STEP_B),
  ],
  side: [
    compose(FACE_SIDE, LEGS_STAND),
    compose(FACE_SIDE, LEGS_STEP_A),
    compose(FACE_SIDE, LEGS_STAND),
    compose(FACE_SIDE, LEGS_STEP_B),
  ],
}
