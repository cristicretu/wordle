import { ROWS, COLS, type GameStatus, type Mode } from './config.ts'
import { evaluate, type Evaluation } from './evaluate.ts'
import { letters, normalize } from './text.ts'
import { VALID_GUESSES } from './words.ts'

export interface GameState {
  mode: Mode
  answer: string[] //  answer as letters
  answerStr: string //  normalized answer string
  dayIndex: number //  -1 for practice
  guesses: string[] //  submitted guesses (normalized strings)
  current: string[] //  in-progress row letters
  status: GameStatus
}

export type SubmitFailure =
  | { ok: false; reason: 'short' }
  | { ok: false; reason: 'not-in-list' }
  | { ok: false; reason: 'hard-mode'; message: string }

export type SubmitResult =
  | {
      ok: true
      row: number //  the row index just submitted
      guess: string[] //  letters submitted
      evaluation: Evaluation[]
      won: boolean
      lost: boolean
    }
  | SubmitFailure

export function createGame(mode: Mode, answerStr: string, dayIndex: number): GameState {
  const answer = letters(answerStr)
  return {
    mode,
    answer,
    answerStr: normalize(answerStr),
    dayIndex,
    guesses: [],
    current: [],
    status: 'playing',
  }
}

export function addLetter(state: GameState, letter: string): boolean {
  if (state.status !== 'playing') return false
  if (state.current.length >= COLS) return false
  state.current.push(normalize(letter))
  return true
}

export function deleteLetter(state: GameState): boolean {
  if (state.status !== 'playing') return false
  if (state.current.length === 0) return false
  state.current.pop()
  return true
}

export const remainingRows = (state: GameState) => ROWS - state.guesses.length

/** Validate the in-progress guess; on success, fold it into the state. */
export function submit(state: GameState, opts: { hardMode: boolean }): SubmitResult {
  if (state.status !== 'playing') return { ok: false, reason: 'short' }

  if (state.current.length < COLS) return { ok: false, reason: 'short' }

  const guessStr = state.current.join('')
  if (!VALID_GUESSES.has(guessStr)) return { ok: false, reason: 'not-in-list' }

  if (opts.hardMode) {
    const violation = hardModeViolation(state)
    if (violation) return { ok: false, reason: 'hard-mode', message: violation }
  }

  const guess = [...state.current]
  const evaluation = evaluate(guess, state.answer)
  const won = evaluation.every((e) => e === 'correct')

  state.guesses.push(guessStr)
  state.current = []
  const lost = !won && state.guesses.length >= ROWS
  if (won) state.status = 'won'
  else if (lost) state.status = 'lost'

  return { ok: true, row: state.guesses.length - 1, guess, evaluation, won, lost }
}

const ORDINAL_RO = ['1-a', '2-a', '3-a', '4-a', '5-a']

/** Returns a Romanian message for the first hard-mode rule the guess breaks. */
function hardModeViolation(state: GameState): string | null {
  const guess = state.current
  // Aggregate constraints from every prior guess.
  const greens = new Array<string | null>(COLS).fill(null)
  const requiredPresent = new Set<string>()

  for (const g of state.guesses) {
    const gl = letters(g)
    const ev = evaluate(gl, state.answer)
    for (let i = 0; i < COLS; i++) {
      if (ev[i] === 'correct') greens[i] = gl[i]
      else if (ev[i] === 'present') requiredPresent.add(gl[i])
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (greens[i] && guess[i] !== greens[i]) {
      return `Litera a ${ORDINAL_RO[i]} trebuie să fie ${greens[i]!.toUpperCase()}`
    }
  }
  for (const ch of requiredPresent) {
    if (!guess.includes(ch)) {
      return `Cuvântul trebuie să conțină ${ch.toUpperCase()}`
    }
  }
  return null
}
