import {
  VIEW_HEIGHT_PX,
  VIEW_MAX_HEIGHT_PX,
  VIEW_MAX_WIDTH_PX,
  VIEW_MIN_WIDTH_PX,
} from '../config'

export interface ViewSize {
  width: number
  height: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function toEven(value: number): number {
  return Math.round(value / 2) * 2
}

// Picks an internal pixel resolution that matches the stage's shape:
// wide screens see more road, tall phones see more of the town.
export function computeViewSize(
  stageWidth: number,
  stageHeight: number
): ViewSize {
  const aspect = stageWidth / Math.max(1, stageHeight)
  if (aspect >= 1) {
    return {
      width: toEven(
        clamp(VIEW_HEIGHT_PX * aspect, VIEW_MIN_WIDTH_PX, VIEW_MAX_WIDTH_PX)
      ),
      height: VIEW_HEIGHT_PX,
    }
  }
  return {
    width: VIEW_MIN_WIDTH_PX,
    height: toEven(
      clamp(VIEW_MIN_WIDTH_PX / aspect, VIEW_HEIGHT_PX, VIEW_MAX_HEIGHT_PX)
    ),
  }
}

function toEvenFloor(value: number): number {
  return Math.floor(value / 2) * 2
}

export interface CanvasFit {
  view: ViewSize
  // CSS pixels per canvas pixel; scale * devicePixelRatio is a whole number
  scale: number
}

// Snaps the upscale to whole device pixels so every art pixel (and every
// font pixel on the canvas) is drawn the same size, then grows the view
// to fill the stage at that scale instead of letterboxing.
export function computeCanvasFit(
  stageWidth: number,
  stageHeight: number,
  devicePixelRatio: number
): CanvasFit {
  const base = computeViewSize(stageWidth, stageHeight)
  const rawScale = Math.min(stageWidth / base.width, stageHeight / base.height)
  const deviceScale = Math.max(1, Math.floor(rawScale * devicePixelRatio))
  const scale = deviceScale / devicePixelRatio
  return {
    view: {
      width: clamp(
        toEvenFloor(stageWidth / scale),
        base.width,
        VIEW_MAX_WIDTH_PX
      ),
      height: clamp(
        toEvenFloor(stageHeight / scale),
        base.height,
        Math.max(base.height, VIEW_MAX_HEIGHT_PX)
      ),
    },
    scale,
  }
}

export function fitCanvas(
  canvas: HTMLCanvasElement,
  stage: HTMLElement
): ViewSize {
  const rect = stage.getBoundingClientRect()
  const { view, scale } = computeCanvasFit(
    rect.width,
    rect.height,
    window.devicePixelRatio
  )
  canvas.width = view.width
  canvas.height = view.height
  canvas.style.width = `${view.width * scale}px`
  canvas.style.height = `${view.height * scale}px`
  return view
}
