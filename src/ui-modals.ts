import { el, toggleRow } from './modal.ts'
import type { Evaluation } from './evaluate.ts'
import type { Settings, Stats } from './storage.ts'
import { winRate } from './stats.ts'

/* ── Help ─────────────────────────────────────────────────── */

function exampleRow(word: string, states: (Evaluation | 'empty')[], highlight: number): HTMLElement {
  const row = el('div', 'mini-row')
  ;[...word].forEach((ch, i) => {
    const tile = el('div', 'tile mini-tile', ch.toUpperCase())
    tile.dataset.state = i === highlight ? states[i] : 'tbd'
    row.appendChild(tile)
  })
  return row
}

export function buildHelp(): Node {
  const frag = document.createDocumentFragment()
  const intro = el('div', 'modal-section')
  intro.appendChild(el('p', 'lede', 'Ghicește cuvântul ascuns în 6 încercări.'))
  const ul = el('ul', 'help-list')
  ;['Fiecare încercare trebuie să fie un cuvânt real de 5 litere.',
    'După fiecare încercare, culoarea plăcuțelor arată cât de aproape ai fost.',
  ].forEach((t) => ul.appendChild(el('li', undefined, t)))
  intro.appendChild(ul)
  frag.appendChild(intro)

  const examples = el('div', 'modal-section')
  examples.appendChild(el('h3', 'modal-subtitle', 'Exemple'))

  const e1 = el('div', 'example')
  e1.appendChild(exampleRow('vorbă', ['correct', 'absent', 'absent', 'absent', 'absent'], 0))
  e1.appendChild(el('p', undefined, 'V este în cuvânt și pe poziția corectă.'))
  examples.appendChild(e1)

  const e2 = el('div', 'example')
  e2.appendChild(exampleRow('latră', ['absent', 'present', 'absent', 'absent', 'absent'], 1))
  e2.appendChild(el('p', undefined, 'A este în cuvânt, dar pe altă poziție.'))
  examples.appendChild(e2)

  const e3 = el('div', 'example')
  e3.appendChild(exampleRow('punte', ['absent', 'absent', 'absent', 'absent', 'absent'], 3))
  e3.appendChild(el('p', undefined, 'T nu se află în cuvânt.'))
  examples.appendChild(e3)
  frag.appendChild(examples)

  const note = el('div', 'modal-section')
  note.appendChild(
    el('p', 'note', 'Cuvintele folosesc diacritice (ă â î ș ț). Apasă tastele dedicate din rândul de sus al tastaturii.'),
  )
  note.appendChild(
    el('p', 'note', 'Sfat: ține apăsat A, I, S sau T pentru variantele cu diacritice (ă â, î, ș, ț).'),
  )
  note.appendChild(el('p', 'note strong', 'Un cuvânt nou apare în fiecare zi.'))
  frag.appendChild(note)

  return frag
}

/* ── Stats ────────────────────────────────────────────────── */

export interface StatsModalOptions {
  stats: Stats
  highlightRow: number | null //  rows used to win the just-finished daily (1..6), else null
  showShare: boolean
  onShare: () => void
  onPractice?: () => void
  lostAnswer?: string | null //  shown when the game was lost
}

export function buildStats(opts: StatsModalOptions): Node {
  const { stats } = opts
  const frag = document.createDocumentFragment()

  if (opts.lostAnswer) {
    const banner = el('div', 'answer-banner')
    banner.appendChild(el('span', 'answer-banner-label', 'Cuvântul era'))
    banner.appendChild(el('span', 'answer-banner-word', opts.lostAnswer.toUpperCase()))
    frag.appendChild(banner)
  }

  const grid = el('div', 'stats-grid')
  const cell = (value: string | number, label: string) => {
    const c = el('div', 'stat-cell')
    c.appendChild(el('div', 'stat-value', String(value)))
    c.appendChild(el('div', 'stat-label', label))
    return c
  }
  grid.append(
    cell(stats.played, 'Jucate'),
    cell(winRate(stats), '% Victorii'),
    cell(stats.currentStreak, 'Serie'),
    cell(stats.maxStreak, 'Serie max.'),
  )
  frag.appendChild(grid)

  frag.appendChild(el('h3', 'modal-subtitle', 'Distribuția încercărilor'))
  const totalWins = stats.distribution.reduce((a, b) => a + b, 0)
  if (totalWins === 0) {
    frag.appendChild(
      el(
        'p',
        'dist-empty',
        stats.played === 0
          ? 'Joacă pentru a-ți construi distribuția.'
          : 'Încă nicio victorie — distribuția apare după prima reușită.',
      ),
    )
  } else {
    const dist = el('div', 'dist')
    const max = Math.max(1, ...stats.distribution)
    stats.distribution.forEach((count, i) => {
      const row = el('div', 'dist-row')
      row.appendChild(el('div', 'dist-index', String(i + 1)))
      // faint full-width track so empty rows read as a baseline, not stubs
      const track = el('div', 'dist-track')
      const bar = el('div', 'dist-bar', String(count))
      bar.style.width = `${Math.max((count / max) * 100, count > 0 ? 12 : 0)}%`
      if (opts.highlightRow === i + 1) bar.classList.add('dist-bar--current')
      if (count === 0) bar.classList.add('dist-bar--empty')
      track.appendChild(bar)
      row.appendChild(track)
      dist.appendChild(row)
    })
    frag.appendChild(dist)
  }

  if (opts.showShare) {
    const footer = el('div', 'stats-footer')
    const countdownBox = el('div', 'countdown-box')
    countdownBox.appendChild(el('div', 'countdown-label', 'Următorul cuvânt'))
    countdownBox.appendChild(el('div', 'countdown js-countdown', '--:--:--'))

    const shareBtn = el('button', 'btn btn--primary')
    shareBtn.type = 'button'
    shareBtn.innerHTML =
      'Distribuie <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11Z"/></svg>'
    shareBtn.addEventListener('click', opts.onShare)

    footer.append(countdownBox, el('div', 'stats-divider'), shareBtn)
    frag.appendChild(footer)
  } else if (opts.onPractice) {
    const footer = el('div', 'stats-footer stats-footer--single')
    const practiceBtn = el('button', 'btn btn--ghost', 'Joacă în mod exercițiu')
    practiceBtn.type = 'button'
    practiceBtn.addEventListener('click', opts.onPractice)
    footer.appendChild(practiceBtn)
    frag.appendChild(footer)
  }

  return frag
}

/* ── Settings ─────────────────────────────────────────────── */

export interface SettingsModalOptions {
  settings: Settings
  hardModeLocked: boolean //  true once the daily game is in progress / finished
  onChange: (patch: Partial<Settings>) => void
}

export function buildSettings(opts: SettingsModalOptions): Node {
  const frag = document.createDocumentFragment()
  const { settings } = opts

  // Theme — 3-way segmented control
  const themeRow = el('div', 'setting-row')
  const themeText = el('div', 'setting-text')
  themeText.appendChild(el('div', 'setting-label', 'Temă'))
  const seg = el('div', 'segmented')
  ;([
    ['system', 'Sistem'],
    ['dark', 'Întunecat'],
    ['light', 'Luminos'],
  ] as const).forEach(([value, label]) => {
    const b = el('button', 'seg-btn', label)
    b.type = 'button'
    b.dataset.value = value
    if (settings.theme === value) b.classList.add('is-active')
    b.addEventListener('click', () => {
      seg.querySelectorAll('.seg-btn').forEach((x) => x.classList.remove('is-active'))
      b.classList.add('is-active')
      opts.onChange({ theme: value })
    })
    seg.appendChild(b)
  })
  themeRow.append(themeText, seg)
  frag.appendChild(themeRow)

  frag.appendChild(
    toggleRow({
      label: 'Mod dificil',
      description: 'Indiciile descoperite trebuie folosite în încercările următoare.',
      checked: settings.hardMode,
      disabled: opts.hardModeLocked && !settings.hardMode,
      onChange: (checked) => opts.onChange({ hardMode: checked }),
    }),
  )

  frag.appendChild(
    toggleRow({
      label: 'Contrast ridicat',
      description: 'Culori prietenoase pentru daltonism (portocaliu și albastru).',
      checked: settings.highContrast,
      onChange: (checked) => opts.onChange({ highContrast: checked }),
    }),
  )

  const footer = el('div', 'settings-footer')
  footer.appendChild(el('span', undefined, 'Wordle în română'))
  const link = el('a', undefined, 'Cod sursă') as HTMLAnchorElement
  link.href = 'https://github.com/cristicretu/wordle'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  footer.appendChild(link)
  frag.appendChild(footer)

  return frag
}
