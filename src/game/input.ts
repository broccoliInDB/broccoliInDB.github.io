import { type Facing } from '../world/layout'

const KEY_TO_DIRECTION: Record<string, Facing> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}

const ACTION_KEYS = new Set(['Space', 'Enter', 'KeyZ'])
const CANCEL_KEYS = new Set(['Escape', 'KeyX', 'Backspace'])
const RUN_KEYS = new Set(['ShiftLeft', 'ShiftRight'])

export class Input {
  private readonly heldDirections: Facing[] = []
  private isRunHeld = false
  private hasPendingAction = false
  private hasPendingCancel = false

  attachKeyboard(target: Window): void {
    target.addEventListener('keydown', (event) => {
      if (this.handleKey(event.code, true)) {
        event.preventDefault()
      }
    })
    target.addEventListener('keyup', (event) => {
      this.handleKey(event.code, false)
    })
    target.addEventListener('blur', () => this.releaseAll())
  }

  private handleKey(code: string, isDown: boolean): boolean {
    const direction = KEY_TO_DIRECTION[code]
    if (direction !== undefined) {
      this.setDirection(direction, isDown)
      return true
    }
    if (RUN_KEYS.has(code)) {
      this.isRunHeld = isDown
      return false
    }
    if (isDown && ACTION_KEYS.has(code)) {
      this.pressAction()
      return true
    }
    if (isDown && CANCEL_KEYS.has(code)) {
      this.pressCancel()
      return true
    }
    return false
  }

  setDirection(direction: Facing, isDown: boolean): void {
    const index = this.heldDirections.indexOf(direction)
    if (index !== -1) {
      this.heldDirections.splice(index, 1)
    }
    if (isDown) {
      this.heldDirections.push(direction)
    }
  }

  pressAction(): void {
    this.hasPendingAction = true
  }

  pressCancel(): void {
    this.hasPendingCancel = true
  }

  releaseAll(): void {
    this.heldDirections.length = 0
    this.isRunHeld = false
  }

  getDirection(): Facing | null {
    return this.heldDirections[this.heldDirections.length - 1] ?? null
  }

  isRunning(): boolean {
    return this.isRunHeld
  }

  consumeAction(): boolean {
    const hadAction = this.hasPendingAction
    this.hasPendingAction = false
    return hadAction
  }

  consumeCancel(): boolean {
    const hadCancel = this.hasPendingCancel
    this.hasPendingCancel = false
    return hadCancel
  }
}
