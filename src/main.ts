import './style.css'
import confetti from 'canvas-confetti'

import { applyMotionVars, COLS, type Mode } from './config.ts'
import { Board } from './board.ts'
import { Keyboard } from './keyboard.ts'
import { betterState, evaluate, type Evaluation } from './evaluate.ts'
import {
  addLetter,
  createGame,
  deleteLetter,
  submit,
  type GameState,
} from './game.ts'
import { letters } from './text.ts'
import {
  dailyAnswer,
  dayIndex as currentDayIndex,
  msUntilTomorrow,
  puzzleNumber,
  randomAnswer,
} from './daily.ts'
import {
  loadGame,
  loadSettings,
  loadStats,
  saveGame,
  saveSettings,
  type SavedGame,
  type Settings,
} from './storage.ts'
import { recordDaily } from './stats.ts'
import { buildShareText, copyText, nativeShare } from './share.ts'
import { toast } from './toast.ts'
import { closeModal, openModal } from './modal.ts'
import { buildHelp, buildPracticeResult, buildSettings, buildStats } from './ui-modals.ts'

/* ── app state ─────────────────────────────────────────────── */

let settings: Settings = loadSettings()
let mode: Mode = 'daily'
let game: GameState
let board: Board
let keyboard: Keyboard
let busy = false //  true while a row is revealing — ignore input
const keyStates = new Map<string, Evaluation>()

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const reduceConfetti = () => prefersReducedMotion()

const WIN_MESSAGES = ['Incredibil!', 'Genial!', 'Impresionant!', 'Super!', 'Bine jucat!', 'Uf, la limită!']

/* ── theme ─────────────────────────────────────────────────── */

const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

function resolvedTheme(): 'dark' | 'light' {
  if (settings.theme === 'system') return systemDark.matches ? 'dark' : 'light'
  return settings.theme
}

function applyTheme() {
  const theme = resolvedTheme()
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal'
}

systemDark.addEventListener('change', () => {
  if (settings.theme === 'system') applyTheme()
})

/* ── keyboard color state ──────────────────────────────────── */

function ingestEvaluation(guess: string[], evaluation: Evaluation[]) {
  for (let i = 0; i < COLS; i++) {
    const l = guess[i]
    keyStates.set(l, betterState(keyStates.get(l), evaluation[i]))
  }
  keyboard.applyStates(keyStates)
}

/* ── game lifecycle ────────────────────────────────────────── */

function startDaily() {
  mode = 'daily'
  const di = currentDayIndex()
  const answer = dailyAnswer()
  const saved = loadGame(di)
  if (saved && saved.answer === answer) {
    game = hydrate(saved)
  } else {
    game = createGame('daily', answer, di)
  }
  resetView()
  restoreView()
  syncSubhead()
}

function startPractice(fresh = true) {
  mode = 'practice'
  if (fresh) {
    game = createGame('practice', randomAnswer(), -1)
  } else {
    const saved = loadGame(-1)
    game = saved ? hydrate(saved) : createGame('practice', randomAnswer(), -1)
  }
  resetView()
  restoreView()
  syncSubhead()
}

function hydrate(saved: SavedGame): GameState {
  const g = createGame(saved.dayIndex < 0 ? 'practice' : 'daily', saved.answer, saved.dayIndex)
  g.guesses = [...saved.guesses]
  g.status = saved.status
  return g
}

function resetView() {
  board.clear()
  keyboard.reset()
  keyStates.clear()
}

/** Re-render saved guesses, keyboard, and end-state without animation. */
function restoreView() {
  game.guesses.forEach((guessStr, row) => {
    const guess = letters(guessStr)
    const ev = evaluate(guess, game.answer)
    board.paintRow(row, guess, ev)
    ingestEvaluation(guess, ev)
  })
  syncOverState()
}

let overBanner: HTMLElement

/** Toggle the game-over visuals: locked board + a persistent answer banner on loss. */
function syncOverState() {
  document.getElementById('app')?.classList.toggle('is-over', game.status !== 'playing')
  overBanner.replaceChildren()
  if (game.status === 'lost') {
    const label = document.createElement('span')
    label.className = 'over-banner-label'
    label.textContent = 'Cuvântul era'
    const word = document.createElement('span')
    word.className = 'over-banner-word'
    word.textContent = game.answerStr.toUpperCase()
    overBanner.append(label, word)
    overBanner.hidden = false
  } else {
    overBanner.hidden = true
  }
}

function persist() {
  saveGame({
    v: 2,
    answer: game.answerStr,
    dayIndex: game.dayIndex,
    guesses: game.guesses,
    status: game.status,
  })
}

/* ── input ─────────────────────────────────────────────────── */

function onLetter(letter: string) {
  if (busy) return
  if (addLetter(game, letter)) board.setCurrentRow(game.guesses.length, game.current)
}

function onDelete() {
  if (busy) return
  if (deleteLetter(game)) board.setCurrentRow(game.guesses.length, game.current)
}

async function onEnter() {
  if (busy) return
  const row = game.guesses.length
  const result = submit(game, { hardMode: settings.hardMode })

  if (!result.ok) {
    const messages: Record<string, string> = {
      short: 'Prea puține litere',
      'not-in-list': 'Cuvântul nu este în listă',
    }
    const msg = result.reason === 'hard-mode' ? result.message : messages[result.reason]
    toast(msg)
    board.shake(row)
    return
  }

  busy = true
  await board.reveal(row, result.guess, result.evaluation)
  ingestEvaluation(result.guess, result.evaluation)
  persist()

  if (result.won) {
    await board.bounce(row)
    celebrate(row + 1)
    finishGame(true, row + 1)
  } else if (result.lost) {
    toast(`Cuvântul era ${game.answerStr.toUpperCase()}`, { duration: 2400 })
    finishGame(false, 0)
  }
  busy = false
}

/* ── end of game ───────────────────────────────────────────── */

function celebrate(rowsUsed: number) {
  toast(WIN_MESSAGES[Math.min(rowsUsed, 6) - 1])
  if (reduceConfetti()) return
  const burst = (originX: number) =>
    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 42,
      origin: { x: originX, y: 0.32 },
      colors: ['#6aaa64', '#c9b458', '#ffffff', '#85c0f9'],
      disableForReducedMotion: true,
    })
  burst(0.35)
  setTimeout(() => burst(0.65), 140)
}

function finishGame(won: boolean, rowsUsed: number) {
  syncOverState()
  syncSubhead()
  const delay = won ? 1500 : 1100 // let the celebration breathe

  // Practice games don't touch daily stats — show a light result card instead.
  if (mode === 'practice') {
    setTimeout(() => openPracticeResult(won, rowsUsed), delay)
    return
  }

  recordDaily({ dayIndex: game.dayIndex, won, rowsUsed })
  const highlightRow = won ? rowsUsed : null
  setTimeout(() => openStats(highlightRow), delay)
}

function openPracticeResult(won: boolean, rowsUsed: number) {
  openModal({
    title: 'Exercițiu',
    body: buildPracticeResult({
      won,
      rowsUsed,
      answer: game.answerStr,
      onNewWord: () => {
        closeModal()
        startPractice(true)
      },
    }),
  })
}

/* ── modals ────────────────────────────────────────────────── */

function openHelp() {
  openModal({ title: 'Cum se joacă', body: buildHelp() })
}

function openStats(highlightRow: number | null = null) {
  const stats = loadStats()
  const dailyOver = mode === 'daily' && game.status !== 'playing'
  let countdownTimer: number | undefined

  const body = buildStats({
    stats,
    highlightRow,
    showShare: dailyOver,
    lostAnswer: game.status === 'lost' ? game.answerStr : null,
    onShare: shareResult,
    onPractice: game.status === 'playing' || mode === 'practice' ? undefined : () => {
      closeModal()
      startPractice(true)
    },
  })

  openModal({
    title: 'Statistici',
    body,
    onClose: () => window.clearInterval(countdownTimer),
  })

  if (dailyOver) {
    const cd = document.querySelector<HTMLElement>('.js-countdown')
    const tick = () => {
      if (cd) cd.textContent = formatCountdown(msUntilTomorrow())
    }
    tick()
    countdownTimer = window.setInterval(tick, 1000)
  }
}

function openSettings() {
  openModal({
    title: 'Setări',
    body: buildSettings({
      settings,
      hardModeLocked: game.guesses.length > 0,
      onChange: (patch) => {
        settings = { ...settings, ...patch }
        saveSettings(settings)
        applyTheme()
      },
    }),
  })
}

async function shareResult() {
  const rows = game.guesses.map((g) => evaluate(letters(g), game.answer))
  const text = buildShareText({
    puzzleNumber: puzzleNumber(),
    rows,
    won: game.status === 'won',
    hardMode: settings.hardMode,
    theme: resolvedTheme(),
  })
  if (await nativeShare(text)) return
  toast((await copyText(text)) ? 'Copiat în clipboard' : 'Nu am putut copia')
}

function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

/* ── subhead (mode switch + puzzle number) ─────────────────── */

let subheadEl: HTMLElement

function buildSubhead() {
  subheadEl = document.createElement('div')
  subheadEl.className = 'subhead'

  const seg = document.createElement('div')
  seg.className = 'segmented segmented--sm'
  ;([
    ['daily', 'Zilnic'],
    ['practice', 'Exercițiu'],
  ] as const).forEach(([value, label]) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'seg-btn'
    b.dataset.mode = value
    b.textContent = label
    b.addEventListener('click', () => {
      if (mode === value) return
      value === 'daily' ? startDaily() : startPractice(false)
    })
    seg.appendChild(b)
  })

  const right = document.createElement('div')
  right.className = 'subhead-right'
  const newBtn = document.createElement('button')
  newBtn.type = 'button'
  newBtn.className = 'text-btn js-newword'
  newBtn.textContent = 'Cuvânt nou'
  newBtn.addEventListener('click', () => startPractice(true))
  right.appendChild(newBtn)

  subheadEl.append(seg, right)
  const gameEl = document.getElementById('game')!
  gameEl.insertBefore(subheadEl, gameEl.firstChild)
}

function syncSubhead() {
  subheadEl.querySelectorAll<HTMLElement>('.seg-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.mode === mode)
  })
  const newBtn = subheadEl.querySelector<HTMLElement>('.js-newword')
  if (newBtn) newBtn.style.visibility = mode === 'practice' ? 'visible' : 'hidden'
  const num = puzzleNumber()
  subheadEl.querySelector<HTMLElement>('.seg-btn[data-mode="daily"]')?.setAttribute('title', `Wordle #${num}`)
}

/* ── boot ──────────────────────────────────────────────────── */

function boot() {
  applyMotionVars()
  applyTheme()

  board = new Board(document.getElementById('board')!)
  keyboard = new Keyboard(document.getElementById('keyboard')!, {
    onLetter,
    onEnter,
    onDelete,
  })
  buildSubhead()

  overBanner = document.createElement('div')
  overBanner.className = 'over-banner'
  overBanner.hidden = true
  const gameEl = document.getElementById('game')!
  gameEl.insertBefore(overBanner, gameEl.querySelector('.board-wrap'))

  document.getElementById('help-btn')!.addEventListener('click', openHelp)
  document.getElementById('stats-btn')!.addEventListener('click', () => openStats(null))
  document.getElementById('settings-btn')!.addEventListener('click', openSettings)

  document.addEventListener('keydown', onPhysicalKey)

  startDaily()

  // First-time players get the rules.
  const stats = loadStats()
  if (stats.played === 0 && game.guesses.length === 0) {
    setTimeout(openHelp, 250)
  }
}

function modalOpen(): boolean {
  const root = document.getElementById('modal-root')
  if (!root) return false
  // A modal animating out (data-hide) no longer captures input.
  return Array.from(root.children).some((c) => !c.hasAttribute('data-hide'))
}

function onPhysicalKey(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (modalOpen()) return
  const key = e.key
  if (key === 'Enter') {
    e.preventDefault()
    onEnter()
  } else if (key === 'Backspace') {
    e.preventDefault()
    onDelete()
  } else if (key.length === 1) {
    const norm = key.toLowerCase()
    if (/^[a-zăâîșțşţ]$/u.test(norm)) {
      onLetter(norm)
      keyboard.flash(norm.replace('ş', 'ș').replace('ţ', 'ț'))
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
