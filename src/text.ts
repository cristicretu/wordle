/* Romanian text helpers — normalization keeps every diacritic a single
 * code point so 5-letter words index cleanly and comparisons are exact. */

/** Cedilla forms (ş ţ, U+015F/U+0163) → standard comma-below (ș ț). */
const CEDILLA_FIX: Record<string, string> = {
  'ş': 'ș', // ş → ș
  'ţ': 'ț', // ţ → ț
  'Ş': 'Ș', // Ş → Ș
  'Ţ': 'Ț', // Ţ → Ț
}

/** Canonicalize a word: lowercase, NFC, comma-diacritics. */
export function normalize(input: string): string {
  let s = input.normalize('NFC').toLowerCase()
  s = s.replace(/[şţŞŢ]/g, (m) => CEDILLA_FIX[m] ?? m)
  return s.normalize('NFC')
}

/** Split into an array of letters (code points). */
export function letters(word: string): string[] {
  return [...normalize(word)]
}

/** Strip diacritics down to ASCII base (for fuzzy/compat checks only). */
export function deburr(word: string): string {
  return normalize(word)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
}

/** Is this a single Romanian game letter (a–z or ă â î ș ț)? */
export function isGameLetter(ch: string): boolean {
  return /^[a-zăâîșț]$/u.test(normalize(ch))
}
