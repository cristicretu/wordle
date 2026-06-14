import { TIMING } from './config.ts'

/* Lightweight toaster. Transitions (not keyframes) so rapid messages
 * retarget smoothly. Newest on top; auto-dismiss unless sticky. */

let root: HTMLElement | null = null
function getRoot(): HTMLElement {
  if (!root) root = document.getElementById('toaster') ?? document.body
  return root
}

export interface ToastOptions {
  duration?: number // ms visible; Infinity for sticky
  sticky?: boolean
}

export function toast(message: string, options: ToastOptions = {}): () => void {
  const el = document.createElement('div')
  el.className = 'toast'
  el.setAttribute('role', 'status')
  el.textContent = message

  const parent = getRoot()
  parent.prepend(el)

  // enter on next frame so the transition runs from the @starting-style
  requestAnimationFrame(() => el.setAttribute('data-show', ''))

  let removed = false
  const dismiss = () => {
    if (removed) return
    removed = true
    el.removeAttribute('data-show')
    el.setAttribute('data-hide', '')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    // safety net if transitionend doesn't fire
    setTimeout(() => el.remove(), TIMING.toastOut + 50)
  }

  if (!options.sticky && options.duration !== Infinity) {
    setTimeout(dismiss, options.duration ?? TIMING.toastHold)
  }

  return dismiss
}
