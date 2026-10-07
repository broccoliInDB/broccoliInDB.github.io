export function createElement(
  tag: keyof HTMLElementTagNameMap,
  text?: string,
  className?: string
): HTMLElement {
  const el = document.createElement(tag)
  if (text !== undefined) {
    el.textContent = text
  }
  if (className !== undefined) {
    el.className = className
  }
  return el
}

export function createButton(
  text: string,
  className: string,
  onClick: () => void
): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = className
  button.textContent = text
  button.addEventListener('click', onClick)
  return button
}
