import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// During development, /api is proxied to the Laravel backend (php artisan serve).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: { '/api': { target: backend, changeOrigin: true } },
    },
    preview: {
      port: 4173,
      proxy: { '/api': { target: backend, changeOrigin: true } },
    },
  }
})
