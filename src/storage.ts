import type { GameStatus } from './config.ts'

/* Versioned, namespaced localStorage. Everything is wrapped so a private-mode
 * browser (which throws on setItem) degrades to a non-persistent session
 * instead of crashing the game. */

const NS = 'wordle-ro'
const VERSION = 2

export interface SavedGame {
  v: number
  answer: string //  normalized answer
  dayIndex: number //  -1 for practice
  guesses: string[] //  submitted guesses (normalized)
  status: GameStatus
}

export interface Stats {
  played: number
  wins: number
  currentStreak: number
  maxStreak: number
  distribution: number[] //  index 0..5 → games won in N+1 guesses
  lastDayCompleted: number //  dayIndex of last finished daily (-2 = none)
}

export interface Settings {
  theme: 'dark' | 'light' | 'system'
  hardMode: boolean
  highContrast: boolean
}

export const DEFAULT_STATS: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
  lastDayCompleted: -2,
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  hardMode: false,
  highContrast: false,
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value))
  } catch {
    /* storage unavailable — session-only */
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(`${NS}:${key}`)
  } catch {
    /* ignore */
  }
}

const gameKey = (dayIndex: number) => (dayIndex < 0 ? 'game:practice' : `game:daily:${dayIndex}`)

export function loadGame(dayIndex: number): SavedGame | null {
  const saved = read<SavedGame | null>(gameKey(dayIndex), null)
  if (!saved || saved.v !== VERSION) return null
  return saved
}

export function saveGame(game: SavedGame): void {
  write(gameKey(game.dayIndex), game)
}

export function clearGame(dayIndex: number): void {
  remove(gameKey(dayIndex))
}

export function loadStats(): Stats {
  const s = read<Stats>('stats', DEFAULT_STATS)
  // Guard against partial/old shapes
  return { ...DEFAULT_STATS, ...s, distribution: s.distribution?.length === 6 ? s.distribution : [...DEFAULT_STATS.distribution] }
}

export function saveStats(stats: Stats): void {
  write('stats', stats)
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>('settings', {}) }
}

export function saveSettings(settings: Settings): void {
  write('settings', settings)
}
