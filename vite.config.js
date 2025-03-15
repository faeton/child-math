import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Function to copy files to dist folder during build with version updates
const copyToDistPlugin = () => {
  return {
    name: 'copy-files-to-dist',
    writeBundle() {
      const sourceFiles = ['_headers', '_redirects']
      const distDir = 'dist'
      
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir)
      }
      
      // Copy standard files
      sourceFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, path.join(distDir, file))
          console.log(`Copied ${file} to ${distDir}`)
        }
      })
      
      // Update _routes.json with new build ID before copying
      if (fs.existsSync('_routes.json')) {
        const routesData = JSON.parse(fs.readFileSync('_routes.json', 'utf8'))
        
        // Update the build_id with current timestamp
        const now = new Date()
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getTime()}`
        
        routesData.build_id = timestamp
        routesData.version = (routesData.version || 0) + 1
        
        // Write the updated file directly to dist
        fs.writeFileSync(
          path.join(distDir, '_routes.json'), 
          JSON.stringify(routesData, null, 2)
        )
        console.log(`Updated and copied _routes.json to ${distDir} with build ID: ${timestamp}`)
      }
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
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
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