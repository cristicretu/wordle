/* ─────────────────────────────────────────────────────────
 * GAME + MOTION CONFIG  —  single source of truth
 *
 * Every timing value lives here. The matching CSS custom
 * properties are written to :root at boot (see applyMotionVars),
 * so CSS animations and JS sequencing never drift apart.
 * ───────────────────────────────────────────────────────── */

export const ROWS = 6
export const COLS = 5

/* All durations in ms. Read like a storyboard, top to bottom. */
export const TIMING = {
  pop: 100, //  tile bumps up when a letter is typed
  flipDuration: 400, //  one tile's full flip (hide → reveal color → show)
  flipStagger: 115, //  delay between consecutive tiles revealing in a row (snappy, ~860ms total)
  shake: 520, //  invalid-guess row shake
  bounceDuration: 820, //  winning-row tile hop
  bounceStagger: 95, //  delay between winning tiles hopping
  toastIn: 160, //  toast enter
  toastHold: 1300, //  toast visible before auto-dismiss
  toastOut: 220, //  toast exit
  modalIn: 240, //  modal/backdrop enter
  modalOut: 180, //  modal exit
} as const

/* Strong custom easing curves (built-in CSS easings are too weak). */
export const EASE = {
  out: 'cubic-bezier(0.23, 1, 0.32, 1)', //  responsive enter/exit
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)', //  on-screen movement
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)', //  iOS-like
} as const

/** Mirror TIMING + EASE into CSS variables so stylesheet stays in sync. */
export function applyMotionVars(root: HTMLElement = document.documentElement) {
  const set = (k: string, v: string) => root.style.setProperty(k, v)
  set('--t-pop', `${TIMING.pop}ms`)
  set('--t-flip', `${TIMING.flipDuration}ms`)
  set('--t-flip-stagger', `${TIMING.flipStagger}ms`)
  set('--t-shake', `${TIMING.shake}ms`)
  set('--t-bounce', `${TIMING.bounceDuration}ms`)
  set('--t-bounce-stagger', `${TIMING.bounceStagger}ms`)
  set('--ease-out', EASE.out)
  set('--ease-in-out', EASE.inOut)
  set('--ease-drawer', EASE.drawer)
}

export type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
export type GameStatus = 'playing' | 'won' | 'lost'
export type Mode = 'daily' | 'practice'

/** The five extra Romanian letters, in keyboard order. */
export const DIACRITICS = ['ă', 'â', 'î', 'ș', 'ț'] as const
