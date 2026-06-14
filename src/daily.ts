import { ANSWERS } from './words.ts'

/** Puzzle epoch — kept at the original game's launch date for continuity. */
const EPOCH = new Date(2022, 0, 1) // Jan 1 2022, local time
const DAY_MS = 86_400_000

/** Whole days since the epoch, counted at local midnight (stable per day). */
export function dayIndex(date: Date = new Date()): number {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((today.getTime() - EPOCH.getTime()) / DAY_MS)
}

/** Human-facing puzzle number (1-based). */
export function puzzleNumber(date: Date = new Date()): number {
  return dayIndex(date) + 1
}

/** Today's answer — deterministic for everyone on the same local day. */
export function dailyAnswer(date: Date = new Date()): string {
  const i = dayIndex(date)
  const len = ANSWERS.length
  return ANSWERS[((i % len) + len) % len]
}

/** A uniformly random answer for practice mode. */
export function randomAnswer(): string {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
}

/** ms until the next local midnight — for the "next puzzle" countdown. */
export function msUntilTomorrow(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}
