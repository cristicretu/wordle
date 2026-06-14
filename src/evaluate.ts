import type { TileState } from './config.ts'
import { letters } from './text.ts'

export type Evaluation = Exclude<TileState, 'empty' | 'tbd'> // 'correct' | 'present' | 'absent'

/**
 * The canonical Wordle coloring, with correct duplicate-letter handling.
 * Two passes: greens first (and consume those letters from the answer's
 * pool), then yellows only while unconsumed copies remain. Operates on
 * arrays of letters so multi-byte diacritics (ă â î ș ț) count as one.
 */
export function evaluate(guess: string[], answer: string[]): Evaluation[] {
  const n = answer.length
  const result: Evaluation[] = new Array(n).fill('absent')
  const pool: Record<string, number> = {}

  for (const ch of answer) pool[ch] = (pool[ch] ?? 0) + 1

  // Pass 1 — exact matches
  for (let i = 0; i < n; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct'
      pool[guess[i]]--
    }
  }

  // Pass 2 — present elsewhere, while copies remain
  for (let i = 0; i < n; i++) {
    if (result[i] === 'correct') continue
    const ch = guess[i]
    if (ch !== undefined && pool[ch] > 0) {
      result[i] = 'present'
      pool[ch]--
    }
  }

  return result
}

/** Convenience for string inputs. */
export function evaluateWords(guess: string, answer: string): Evaluation[] {
  return evaluate(letters(guess), letters(answer))
}

/** Best (most informative) state for a keyboard key: correct > present > absent. */
const RANK: Record<Evaluation, number> = { absent: 0, present: 1, correct: 2 }
export function betterState(a: Evaluation | undefined, b: Evaluation): Evaluation {
  if (a === undefined) return b
  return RANK[b] > RANK[a] ? b : a
}
