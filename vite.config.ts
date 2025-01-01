import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'copy-files',
    writeBundle() {
      // Copy manifest.json
      copyFileSync('manifest.json', 'dist/manifest.json')
      
      // Copy background script
      copyFileSync('public/background.js', 'dist/background.js')
      
      // Copy icons
      copyFileSync('src/assets/icon.png', 'dist/icon.png')
      copyFileSync('src/assets/favicon-32x32.png', 'dist/favicon-32x32.png')
    }
  }],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
  },
})
