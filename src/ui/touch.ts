import { type Input } from '../game/input'
import { type Facing } from '../world/layout'

function isFacing(value: string | undefined): value is Facing {
  return (
    value === 'up' || value === 'down' || value === 'left' || value === 'right'
  )
}

// Pointer events cover touch, pen and mouse alike, so the on-screen pad
// also works for anyone who prefers clicking.
export function bindTouchControls(root: HTMLElement, input: Input): void {
  root.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach((button) => {
    const direction = button.dataset.dir
    if (!isFacing(direction)) {
      return
    }
    const release = (): void => input.setDirection(direction, false)
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      button.setPointerCapture(event.pointerId)
      input.setDirection(direction, true)
    })
    button.addEventListener('pointerup', release)
    button.addEventListener('pointercancel', release)
    button.addEventListener('lostpointercapture', release)
  })

  root.querySelectorAll<HTMLButtonElement>('[data-btn]').forEach((button) => {
    const isAction = button.dataset.btn === 'a'
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      if (isAction) {
        input.pressAction()
        return
      }
      input.pressCancel()
    })
  })
}
