# 🇷🇴 Wordle în română

A polished Romanian Wordle — guess the hidden 5‑letter word in 6 tries. Rebuilt
from the original 2022 vanilla‑JS version into a fast, modern, **diacritic‑aware**
game.

## Features

- **Diacritice native** — answers use real Romanian spelling (ă â î ș ț). The
  on‑screen keyboard has a dedicated accent row, plus an iOS‑style **long‑press
  picker** (hold `A` → ă/â, `I` → î, `S` → ș, `T` → ț).
- **Cuvântul zilei** — one shared daily puzzle for everyone, with progress saved
  locally, plus an unlimited **practice mode**.
- **Statistici** — win %, current/max streak, and a guess‑distribution chart.
- **Share** — the classic emoji grid (🟩🟨⬛), copied to the clipboard or shared
  via the native share sheet.
- **Craft** — flip‑reveal, key‑press feedback, invalid‑guess shake, win bounce +
  confetti, toasts instead of `alert()`, light/dark/system themes, a
  colour‑blind high‑contrast mode, and full `prefers-reduced-motion` support.

## Development

```bash
npm install
npm run dev      # Vite dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

Built with **Vite + TypeScript**, zero UI framework. The signature animations are
CSS‑driven (keyframes/transitions) for buttery performance.

## Project structure

```
src/
  main.ts        controller — wires input, reveal, persistence, modals
  game.ts        pure game engine (state machine, hard mode)
  evaluate.ts    the Wordle coloring algorithm (correct duplicate handling)
  board.ts       the 6×5 grid and its motion (pop / flip / bounce / shake)
  keyboard.ts    keyboard + accent row + long-press accent picker
  words.ts       generated answer list (1100+ validated words)
  daily.ts       deterministic daily-word selection
  storage.ts     versioned localStorage (game, stats, settings)
  stats.ts       streaks + distribution
  share.ts       emoji-grid share text
  toast.ts       toaster
  modal.ts       modal system + atoms (switch, segmented)
  ui-modals.ts   help / stats / settings bodies
  text.ts        Romanian text normalization (NFC, comma diacritics)
  config.ts      timing + easing constants (mirrored into CSS vars)
  style.css      theme + layout + animations
```

## The word list

`src/words.ts` is **auto‑generated** and has two tiers:

- **`ANSWERS`** (~1050) — the curated daily/practice pool. The legacy ASCII list
  was re‑diacriticized, audited for orthography, lemma‑normalized, and stripped
  of weird answers (articulated "the‑X" forms, non‑infinitive conjugations,
  slang, obscure words).
- **`EXTRA_GUESSES`** (~5800) — additional accepted guesses so any real Romanian
  word can be played, not just answers. Sourced from the official Romanian
  **hunspell** spellcheck dictionary (Rospell / dexonline, via LibreOffice),
  filtered to lowercase 5‑letter words with correct diacritics — **real words
  only**. Every answer is also a valid guess.

To add or fix a word, edit `src/words.ts` using correct Romanian spelling — each
entry must be exactly five letters (a diacritic counts as one).

The original 2022 build and its word‑generation tooling are preserved in
[`legacy/`](./legacy).

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). The Vite `base`
is `/wordle/`; override with `VITE_BASE=/` for a root domain.
