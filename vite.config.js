import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emit a manifest so the prerender step can resolve hashed asset
    // filenames (used to preload the LCP hero image).
    manifest: true,
  },
})
