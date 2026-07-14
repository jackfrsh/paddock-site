import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React changes far less often than site content, so giving it its own
        // chunk lets it stay cached across content deploys.
        manualChunks: {
          react: ['react', 'react-dom/client', 'react-helmet-async'],
        },
      },
    },
  },
})
