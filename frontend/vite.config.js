import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx') || id.includes('jspdf') || id.includes('html2canvas')) {
              return; // Let Rollup split them as dynamic chunks
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('redux') || id.includes('redux-persist')) {
              return 'redux-vendor';
            }
            if (id.includes('bootstrap') || id.includes('dom-helpers') || id.includes('classnames')) {
              return 'bootstrap-vendor';
            }
            if (id.includes('recharts') || id.includes('d3') || id.includes('victory') || id.includes('lodash')) {
              return 'charts-vendor';
            }
            if (id.includes('motion') || id.includes('framer-motion') || id.includes('style-value-types')) {
              return 'motion-vendor';
            }
            if (id.includes('yup') || id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'forms-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
