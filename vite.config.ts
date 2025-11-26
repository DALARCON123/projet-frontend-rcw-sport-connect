import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, 
    open: true, 
    cors: true,
    proxy: {
     
      '/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    
      '/sports': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
    
      '/reco': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
    
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
