// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

export default defineConfig({

  plugins: [
    vue()
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },

  preview: {
    port: 8080,
    host: true
  },

  server: {
    host: true,
    port: 8080,
    // https: true
  },

  // Suppress warning voor depreciation of JS API of Sass
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
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