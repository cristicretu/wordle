/* ─────────────────────────────────────────────────────────
 * BOARD  —  the 6×5 tile grid and its motion
 *
 * Reveal sequence (per submitted row), driven by TIMING:
 *      0ms   tile 0 starts flipping (rotateX 0 → −90 → 0)
 *   +flip/2  at the edge-on midpoint, the color snaps in
 *  +stagger  tile 1 begins … and so on across the row
 *   settle   promise resolves once the last tile lands
 *
 * Whole-tile rotateX flip (no inner faces needed): the color swap
 * happens while the tile is edge-on and invisible, so it reads as a
 * single clean reveal. prefers-reduced-motion paints instantly.
 * ───────────────────────────────────────────────────────── */
import { ROWS, COLS, TIMING, type TileState } from './config.ts'
import type { Evaluation } from './evaluate.ts'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export class Board {
  private tiles: HTMLDivElement[][] = []
  private rowEls: HTMLDivElement[] = []

  constructor(private root: HTMLElement) {
    this.build()
  }

  private build() {
    this.root.replaceChildren()
    this.tiles = []
    this.rowEls = []
    for (let r = 0; r < ROWS; r++) {
      const rowEl = document.createElement('div')
      rowEl.className = 'row'
      rowEl.setAttribute('role', 'row')
      const rowTiles: HTMLDivElement[] = []
      for (let c = 0; c < COLS; c++) {
        const tile = document.createElement('div')
        tile.className = 'tile'
        tile.dataset.state = 'empty'
        tile.setAttribute('role', 'cell')
        rowEl.appendChild(tile)
        rowTiles.push(tile)
      }
      this.root.appendChild(rowEl)
      this.rowEls.push(rowEl)
      this.tiles.push(rowTiles)
    }
  }

  private setTile(row: number, col: number, letter: string, state: TileState) {
    const tile = this.tiles[row]?.[col]
    if (!tile) return
    tile.textContent = letter ? letter.toUpperCase() : ''
    tile.dataset.state = state
    tile.setAttribute('aria-label', letter || 'gol')
  }

  /** Render the in-progress guess on its row, with a pop on freshly typed tiles. */
  setCurrentRow(row: number, lettersArr: string[]) {
    for (let c = 0; c < COLS; c++) {
      const tile = this.tiles[row]?.[c]
      if (!tile) continue
      const ch = lettersArr[c]
      const had = tile.textContent !== ''
      if (ch) {
        this.setTile(row, c, ch, 'tbd')
        if (!had) this.pop(tile)
      } else {
        this.setTile(row, c, '', 'empty')
      }
    }
  }

  private pop(tile: HTMLElement) {
    if (prefersReducedMotion()) return
    tile.classList.remove('pop')
    void tile.offsetWidth // restart the animation
    tile.classList.add('pop')
    tile.addEventListener('animationend', () => tile.classList.remove('pop'), { once: true })
  }

  /** Invalid guess — shake the row in place. */
  shake(row: number): Promise<void> {
    const rowEl = this.rowEls[row]
    if (!rowEl || prefersReducedMotion()) return Promise.resolve()
    return new Promise((resolve) => {
      rowEl.classList.add('shake')
      rowEl.addEventListener(
        'animationend',
        () => {
          rowEl.classList.remove('shake')
          resolve()
        },
        { once: true },
      )
    })
  }

  /** Flip-reveal a row's evaluation, resolving when the last tile lands. */
  reveal(row: number, guess: string[], evaluation: Evaluation[]): Promise<void> {
    const rowTiles = this.tiles[row]
    if (!rowTiles) return Promise.resolve()

    if (prefersReducedMotion()) {
      for (let c = 0; c < COLS; c++) this.setTile(row, c, guess[c] ?? '', evaluation[c])
      return Promise.resolve()
    }

    const half = TIMING.flipDuration / 2
    return new Promise((resolve) => {
      for (let c = 0; c < COLS; c++) {
        const tile = rowTiles[c]
        const delay = c * TIMING.flipStagger
        setTimeout(() => {
          tile.classList.add('flip')
          // swap color at the edge-on midpoint
          setTimeout(() => this.setTile(row, c, guess[c] ?? '', evaluation[c]), half)
          tile.addEventListener('animationend', () => tile.classList.remove('flip'), { once: true })
        }, delay)
      }
      const total = (COLS - 1) * TIMING.flipStagger + TIMING.flipDuration
      setTimeout(resolve, total + 20)
    })
  }

  /** Celebrate a win — staggered hop across the winning row. */
  bounce(row: number): Promise<void> {
    const rowTiles = this.tiles[row]
    if (!rowTiles || prefersReducedMotion()) return Promise.resolve()
    return new Promise((resolve) => {
      rowTiles.forEach((tile, c) => {
        tile.style.setProperty('--bounce-delay', `${c * TIMING.bounceStagger}ms`)
        tile.classList.add('bounce')
        if (c === COLS - 1) {
          tile.addEventListener(
            'animationend',
            () => {
              rowTiles.forEach((t) => t.classList.remove('bounce'))
              resolve()
            },
            { once: true },
          )
        }
      })
    })
  }

  /** Paint a historical guess instantly (no animation) — used on restore. */
  paintRow(row: number, guess: string[], evaluation: Evaluation[]) {
    for (let c = 0; c < COLS; c++) this.setTile(row, c, guess[c] ?? '', evaluation[c])
  }

  clear() {
    this.build()
  }
}
