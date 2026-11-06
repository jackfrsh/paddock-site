import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      // React changes far less often than site content, so giving it its own
      // chunk lets it stay cached across content deploys. The server build
      // (used only to prerender pages) leaves React external, so it skips this.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              react: ['react', 'react-dom/client', 'react-helmet-async'],
            },
          },
    },
  },
}))
