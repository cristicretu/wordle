import { defineConfig } from 'vite'

// GitHub Pages serves project sites from /<repo>/ — set base accordingly for prod.
// Override with VITE_BASE=/ when deploying to a root domain.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/wordle/',
  build: {
    target: 'es2020',
  },
})
