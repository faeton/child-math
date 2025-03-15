import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Function to copy files to dist folder during build
const copyToDistPlugin = () => {
  return {
    name: 'copy-files-to-dist',
    writeBundle() {
      const sourceFiles = ['_headers', '_redirects', '_routes.json']
      const distDir = 'dist'
      
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir)
      }
      
      sourceFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, path.join(distDir, file))
          console.log(`Copied ${file} to ${distDir}`)
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Math Equations Game',
        short_name: 'MathGame',
        description: 'A fun math game for children to practice equations',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    copyToDistPlugin()
  ],
  build: {
    // Ensure sourcemaps are generated for better debugging
    sourcemap: true,
    // Output files to dist folder
    outDir: 'dist',
    // Clean the output directory before build
    emptyOutDir: true,
    // Rollup options
    rollupOptions: {
      output: {
        // Use hashed filenames for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})