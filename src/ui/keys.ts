export type KeysMode = 'walk' | 'talk' | 'dialog'

export interface KeyLabels {
  action: string
  cancel: string
}

const KEYBOARD_KEYS: KeyLabels = { action: 'Space', cancel: 'Esc' }
const PAD_KEYS: KeyLabels = { action: 'A', cancel: 'B' }

export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}

// Key names follow the device: keyboard players see Space/Esc, touch players
// see the on-screen pad's A/B buttons.
export function getKeyLabels(): KeyLabels {
  return isTouchDevice() ? PAD_KEYS : KEYBOARD_KEYS
}
