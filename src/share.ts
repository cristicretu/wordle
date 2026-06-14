import type { Evaluation } from './evaluate.ts'

const EMOJI: Record<'dark' | 'light', Record<Evaluation, string>> = {
  dark: { correct: '🟩', present: '🟨', absent: '⬛' },
  light: { correct: '🟩', present: '🟨', absent: '⬜' },
}

export interface ShareInput {
  puzzleNumber: number
  rows: Evaluation[][] // one row per submitted guess
  won: boolean
  hardMode: boolean
  theme: 'dark' | 'light'
}

/** Build the spoiler-free emoji grid, the signature Wordle share. */
export function buildShareText(input: ShareInput): string {
  const palette = EMOJI[input.theme]
  const score = input.won ? String(input.rows.length) : 'X'
  const star = input.hardMode ? '*' : ''
  const header = `Wordle în română #${input.puzzleNumber} ${score}/6${star}`
  const grid = input.rows.map((row) => row.map((s) => palette[s]).join('')).join('\n')
  return `${header}\n\n${grid}`
}

/** Copy text, preferring the async Clipboard API with a legacy fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/** Native share sheet when available (mobile), else null so caller copies. */
export async function nativeShare(text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ text })
      return true
    }
  } catch {
    /* user cancelled or unsupported */
  }
  return false
}
