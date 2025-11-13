import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta 2025: inclusiva, deportiva y con buen contraste
        primary: '#0EA5E9',     // azul deportivo
        accent: '#F97316',      // naranja energía
        leaf: '#22C55E',        // bienestar
        ink: '#0F172A',         // texto principal (slate-900)
        soft: '#94A3B8',        // texto secundario
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glass: '0 8px 30px rgba(2, 6, 23, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config
