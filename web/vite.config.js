import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // O Pyodide carrega seus próprios arquivos (wasm, stdlib); o pré-bundle do Vite quebra isso.
  optimizeDeps: { exclude: ['pyodide'] },
})
