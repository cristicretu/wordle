import { defineConfig } from 'vite'

// Relative base so assets resolve whether the app is served from a domain
// root (Vercel) or a subpath (GitHub Pages project site). Override with
// VITE_BASE if you need an absolute base.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  build: {
    target: 'es2020',
  },
})
