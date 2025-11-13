import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ====================================================
// ⚙️ Configuración Vite + Proxy para microservicios
// ====================================================

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // Puedes cambiarlo si ya lo usa otro
    open: true, // abre automáticamente el navegador
    cors: true,
    proxy: {
      // 🔐 Servicio de autenticación Flask
      '/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      // ⚽ Servicio de deportes
      '/sports': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      // 💡 Servicio de recomendaciones
      '/reco': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
      // 🤖 Servicio de chatbot
      '/chat': {
        target: 'http://localhost:8010',
        changeOrigin: true,
      },
    },
  },

  // ====================================================
  // 🧩 Compatibilidad para React + TS + Tailwind
  // ====================================================
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
