import { loadStats, saveStats, type Stats } from './storage.ts'

/**
 * Fold a finished DAILY game into the stats. Practice games never touch
 * stats. Idempotent per day: recording the same dayIndex twice is a no-op,
 * so a re-open or reload can't inflate the numbers.
 */
export function recordDaily(opts: {
  dayIndex: number
  won: boolean
  rowsUsed: number // 1..6
}): Stats {
  const stats = loadStats()
  if (opts.dayIndex <= stats.lastDayCompleted) return stats // already counted

  const consecutive = opts.dayIndex === stats.lastDayCompleted + 1 || stats.lastDayCompleted === -2

  stats.played += 1
  if (opts.won) {
    stats.wins += 1
    stats.currentStreak = consecutive ? stats.currentStreak + 1 : 1
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
    const idx = Math.min(Math.max(opts.rowsUsed, 1), 6) - 1
    stats.distribution[idx] += 1
  } else {
    stats.currentStreak = 0
  }
  stats.lastDayCompleted = opts.dayIndex

  saveStats(stats)
  return stats
}

export function winRate(stats: Stats): number {
  return stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100)
}
