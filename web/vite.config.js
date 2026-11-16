import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // O Pyodide carrega seus próprios arquivos (wasm, stdlib); o pré-bundle do Vite quebra isso.
  optimizeDeps: { exclude: ['pyodide'] },
  // In `npm run dev` there is no Vercel, so /api/status is forwarded straight to the Metrô page.
  // In production, web/api/status.js answers the same URL.
  server: {
    proxy: {
      '/api/status': {
        target: 'https://www.metro.sp.gov.br',
        changeOrigin: true,
        rewrite: () => '/wp-content/themes/metrosp/direto-metro.php?embed=1',
      },
    },
  },
})
