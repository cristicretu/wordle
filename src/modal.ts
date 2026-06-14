import { TIMING } from './config.ts'

/* Generic modal: backdrop + centered panel, scale-in from center (modals
 * are not anchored to a trigger, so center origin is correct). Closes on
 * Esc, backdrop click, or the × button. One modal at a time. */

let current: { backdrop: HTMLElement; cleanup: () => void } | null = null

export interface ModalOptions {
  title: string
  body: Node
  onClose?: () => void
}

export function closeModal() {
  if (!current) return
  const { backdrop, cleanup } = current
  current = null
  cleanup()
  backdrop.removeAttribute('data-show')
  backdrop.setAttribute('data-hide', '')
  const done = () => backdrop.remove()
  backdrop.addEventListener('transitionend', done, { once: true })
  setTimeout(done, TIMING.modalOut + 60)
}

export function openModal(opts: ModalOptions) {
  if (current) closeModal()
  const root = document.getElementById('modal-root') ?? document.body

  const backdrop = document.createElement('div')
  backdrop.className = 'modal-backdrop'

  const panel = document.createElement('div')
  panel.className = 'modal'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-modal', 'true')
  panel.setAttribute('aria-label', opts.title)

  const header = document.createElement('div')
  header.className = 'modal-header'
  const h = document.createElement('h2')
  h.className = 'modal-title'
  h.textContent = opts.title
  const close = document.createElement('button')
  close.className = 'icon-btn modal-close'
  close.setAttribute('aria-label', 'Închide')
  close.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"/></svg>'
  header.append(h, close)

  const content = document.createElement('div')
  content.className = 'modal-content'
  content.appendChild(opts.body)

  panel.append(header, content)
  backdrop.appendChild(panel)
  root.appendChild(backdrop)

  const onBackdrop = (e: MouseEvent) => {
    if (e.target === backdrop) closeModal()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  close.addEventListener('click', closeModal)
  backdrop.addEventListener('click', onBackdrop)
  document.addEventListener('keydown', onKey)

  current = {
    backdrop,
    cleanup: () => {
      document.removeEventListener('keydown', onKey)
      opts.onClose?.()
    },
  }

  requestAnimationFrame(() => {
    backdrop.setAttribute('data-show', '')
    close.focus()
  })
}

/* ── small UI atoms used by the modal bodies ─────────────────── */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

export function toggleRow(opts: {
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}): HTMLElement {
  const row = el('div', 'setting-row')
  const text = el('div', 'setting-text')
  text.appendChild(el('div', 'setting-label', opts.label))
  if (opts.description) text.appendChild(el('div', 'setting-desc', opts.description))

  const btn = el('button', 'switch')
  btn.type = 'button'
  btn.setAttribute('role', 'switch')
  btn.setAttribute('aria-checked', String(opts.checked))
  btn.setAttribute('aria-label', opts.label)
  if (opts.disabled) btn.setAttribute('disabled', '')
  btn.appendChild(el('span', 'switch-thumb'))
  btn.addEventListener('click', () => {
    if (opts.disabled) return
    const next = btn.getAttribute('aria-checked') !== 'true'
    btn.setAttribute('aria-checked', String(next))
    opts.onChange(next)
  })

  row.append(text, btn)
  return row
}
