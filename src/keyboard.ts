import type { Evaluation } from './evaluate.ts'

export interface KeyboardCallbacks {
  onLetter: (letter: string) => void
  onEnter: () => void
  onDelete: () => void
}

const ACCENTS = ['ă', 'â', 'î', 'ș', 'ț']
const ROW1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

/* Base letters that carry diacritic variants — held to reveal a picker. */
const ACCENT_VARIANTS: Record<string, string[]> = {
  a: ['ă', 'â'],
  i: ['î'],
  s: ['ș'],
  t: ['ț'],
}

const HOLD_MS = 260

const ENTER_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 10v4a1 1 0 0 0 1 1h7v3l4-4-4-4v3h-6v-3a1 1 0 0 0-2 0Z"/></svg>'
const DEL_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 6a2 2 0 0 0-2-2H9a2 2 0 0 0-1.5.7l-5 6a2 2 0 0 0 0 2.6l5 6A2 2 0 0 0 9 20h11a2 2 0 0 0 2-2V6Zm-4.3 9.3a1 1 0 0 1-1.4 1.4L14 14.4l-2.3 2.3a1 1 0 0 1-1.4-1.4l2.3-2.3-2.3-2.3a1 1 0 0 1 1.4-1.4l2.3 2.3 2.3-2.3a1 1 0 0 1 1.4 1.4L15.4 13l2.3 2.3Z"/></svg>'

export class Keyboard {
  private keyEls = new Map<string, HTMLButtonElement>()

  // long-press picker state
  private holdTimer: number | undefined
  private pop: HTMLDivElement | null = null
  private popOptions: HTMLButtonElement[] = []
  private popActiveIndex = 0
  private suppressClick = false

  constructor(private root: HTMLElement, private cb: KeyboardCallbacks) {
    this.build()
  }

  private build() {
    this.root.replaceChildren()
    this.keyEls.clear()
    this.addRow(ACCENTS, 'accents')
    this.addRow(ROW1)
    this.addRow(ROW2)
    this.addRow(['enter', ...ROW3, 'backspace'])
  }

  private addRow(keys: string[], extraClass = '') {
    const rowEl = document.createElement('div')
    rowEl.className = `kb-row${extraClass ? ' kb-row--' + extraClass : ''}`
    for (const key of keys) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'key'
      btn.dataset.key = key

      if (key === 'enter') {
        btn.classList.add('key--wide', 'key--action')
        btn.innerHTML = ENTER_SVG
        btn.setAttribute('aria-label', 'Verifică')
        btn.addEventListener('click', () => this.cb.onEnter())
      } else if (key === 'backspace') {
        btn.classList.add('key--wide', 'key--action')
        btn.innerHTML = DEL_SVG
        btn.setAttribute('aria-label', 'Șterge')
        btn.addEventListener('click', () => this.cb.onDelete())
      } else {
        btn.textContent = key.toUpperCase()
        btn.setAttribute('aria-label', key)
        if (extraClass === 'accents') btn.classList.add('key--accent')
        if (ACCENT_VARIANTS[key]) {
          btn.classList.add('key--has-accent')
          btn.addEventListener('pointerdown', (e) => this.startHold(e, key))
        }
        btn.addEventListener('click', () => {
          if (this.suppressClick) {
            this.suppressClick = false
            return
          }
          this.cb.onLetter(key)
        })
      }

      // Immediate press feedback on every key (touch + mouse), driven by
      // pointerdown so it lands the instant the finger touches — not :active,
      // which iOS can clip on release.
      btn.addEventListener('pointerdown', () => btn.classList.add('pressed'))
      const release = () => btn.classList.remove('pressed')
      btn.addEventListener('pointerup', release)
      btn.addEventListener('pointercancel', release)
      btn.addEventListener('pointerleave', release)

      rowEl.appendChild(btn)
      this.keyEls.set(key, btn)
    }
    this.root.appendChild(rowEl)
  }

  /* ── long-press accent picker (iOS-style) ─────────────────── */

  private startHold(e: PointerEvent, baseKey: string) {
    const variants = ACCENT_VARIANTS[baseKey]
    if (!variants) return
    const anchor = this.keyEls.get(baseKey)
    if (!anchor) return

    this.clearHold()
    this.holdTimer = window.setTimeout(() => {
      // Only accents in the picker — a quick tap already types the base letter,
      // so a deliberate hold should never resolve back to it.
      this.openPicker(anchor, variants)
    }, HOLD_MS)

    const onMove = (ev: PointerEvent) => this.highlightAt(ev.clientX)
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      this.commitHold()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    // Note: no preventDefault here — it can cancel the follow-up click on
    // some browsers, which would break a quick tap. The picker swallows the
    // post-selection click via suppressClick instead.
    void e
  }

  private openPicker(anchor: HTMLElement, options: string[]) {
    const rect = anchor.getBoundingClientRect()
    const pop = document.createElement('div')
    pop.className = 'accent-pop'
    this.popOptions = options.map((ch, i) => {
      const opt = document.createElement('button')
      opt.type = 'button'
      opt.className = 'accent-opt'
      opt.textContent = ch.toUpperCase()
      if (i === 0) opt.classList.add('is-active')
      pop.appendChild(opt)
      return opt
    })
    this.popActiveIndex = 0
    document.body.appendChild(pop)

    // center above the anchor key, clamped to viewport
    const popRect = pop.getBoundingClientRect()
    let left = rect.left + rect.width / 2 - popRect.width / 2
    left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8))
    pop.style.left = `${left}px`
    pop.style.top = `${rect.top - popRect.height - 8}px`
    requestAnimationFrame(() => pop.setAttribute('data-show', ''))
    this.pop = pop
    if (navigator.vibrate) navigator.vibrate(8)
  }

  private highlightAt(clientX: number) {
    if (!this.pop) return
    let best = 0
    let bestDist = Infinity
    this.popOptions.forEach((opt, i) => {
      const r = opt.getBoundingClientRect()
      const d = Math.abs(clientX - (r.left + r.width / 2))
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    if (best !== this.popActiveIndex) {
      this.popOptions[this.popActiveIndex]?.classList.remove('is-active')
      this.popOptions[best]?.classList.add('is-active')
      this.popActiveIndex = best
    }
  }

  private commitHold() {
    window.clearTimeout(this.holdTimer)
    if (this.pop) {
      const chosen = this.popOptions[this.popActiveIndex]?.textContent?.toLowerCase()
      this.closePicker()
      this.suppressClick = true // swallow the click that follows pointerup
      if (chosen) this.cb.onLetter(chosen)
    }
  }

  private clearHold() {
    window.clearTimeout(this.holdTimer)
    this.closePicker()
  }

  private closePicker() {
    if (!this.pop) return
    const pop = this.pop
    this.pop = null
    this.popOptions = []
    pop.removeAttribute('data-show')
    pop.addEventListener('transitionend', () => pop.remove(), { once: true })
    setTimeout(() => pop.remove(), 200)
  }

  /* ── public API ───────────────────────────────────────────── */

  applyStates(states: Map<string, Evaluation>) {
    for (const [letter, state] of states) {
      const el = this.keyEls.get(letter)
      if (el) el.dataset.state = state
    }
  }

  flash(key: string) {
    const el = this.keyEls.get(key)
    if (!el) return
    el.classList.add('pressed')
    setTimeout(() => el.classList.remove('pressed'), 120)
  }

  reset() {
    for (const el of this.keyEls.values()) delete el.dataset.state
  }
}
