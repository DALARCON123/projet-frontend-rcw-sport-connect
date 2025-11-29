import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {

      // 🔐 SERVICE AUTHENTIFICATION
      '/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },

      // 🏋️ SERVICE SPORTS
      '/sports': {
        target: 'http://localhost:8004',
        changeOrigin: true,
      },

      // 🤖 SERVICE RECOMMANDATION
      '/reco': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },

      // 💬 SERVICE CHATBOT
      '/chat': {
        target: 'http://localhost:8010',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
