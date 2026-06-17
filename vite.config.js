// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({

  plugins: [
    vue(),
    // VueI18nPlugin({
    //   // if you want to use named components in <i18n> blocks
    //   include: [path.resolve(__dirname, './src/locales/**')],
    // }),
    VueI18nPlugin({
      // This is important for SFC i18n blocks:
      include: [path.resolve(__dirname, './src/locales/**')], 
      // DISABLE STRICT MESSAGE COMPILATION (This fixes your error)
      strictMessage: false, 
      // Ensure HTML is allowed
      escapeHtml: false,
      // Ensures the compiler doesn't trip over HTML-like characters
      fullInstall: true,
      compositionOnly: true    
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png' ],
        devOptions: {
          enabled: false 
        },
        manifest: {
        id: '/',
        name: 'GC Tools: Geocaching Toolkit',
        short_name: 'GC Tools',
        description: 'The ultimate toolkit for geocaching',
        theme_color: '#55721c',
        background_color: '#eeeeee',
        display: 'standalone',
        icons: [
          {
            src: 'icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // Vital for Android
          },
          {
            src: 'icons/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Vital for Android
          }
        ],
        screenshots: [
          {
            src: 'screenshots/desktop.png',
            sizes: '1280x724',
            type: 'image/png',
            form_factor: 'wide',
            label: 'GC Tools for Desktop'
          },
          {
            src: 'screenshots/mobile.png',
            sizes: '750x992',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'GC Tools for Mobile'
          }
        ]
      },
      workbox: {
        // 1. Tell Workbox NOT to pre-cache these files
        globIgnores: ['**/dicts/*.js'], 

        // 2. Define Runtime Caching for these specific files
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/dicts/'),
            handler: 'CacheFirst', // Look in cache first, then network
            options: {
              cacheName: 'dictionary-cache',
              expiration: {
                maxEntries: 3, // Max number of languages to store
                maxAgeSeconds: 60 * 60 * 24 * 31, // Cache for one month
              },
              cacheableResponse: {
                statuses: [0, 200], // Only cache successful responses
              },
            },
          },
        ],
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

 preview: {
    port: 8080,
    host: true
  },

  server: {
    host: true,
    port: 8080,
  },
  
  // Needed because of mathjs
  optimizeDeps: { 
    esbuildOptions: {
      supported: { 
        bigint: true 
      },
    }
  }, 

})