import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          // Keep React in the main bundle to avoid "useState of undefined" errors
          if (id.includes('react') || id.includes('scheduler')) {
            return undefined
          }

          if (id.includes('@react-three')) {
            return 'r3f-vendor'
          }

          if (id.includes('/three/')) {
            return 'three-core'
          }

          if (
            id.includes('framer-motion') ||
            id.includes('react-draggable') ||
            id.includes('react-hot-toast') ||
            id.includes('react-icons')
          ) {
            return 'ui-vendor'
          }

          if (
            id.includes('tsparticles') ||
            id.includes('@tsparticles')
          ) {
            return 'particles-vendor'
          }

          if (id.includes('jspdf')) {
            return 'pdf-vendor'
          }

          if (
            id.includes('html2canvas') ||
            id.includes('dompurify')
          ) {
            return 'capture-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
})
