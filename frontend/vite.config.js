import { defaultClientConditions, defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// During development, /api is proxied to the Laravel backend (php artisan serve).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    // onnxruntime-web: use the WASM-only build (the OCR page runs on the wasm backend only,
    // and it is ~2.4 MB smaller to download than the WebGPU one), and the variant that loads
    // its .wasm from ort.env.wasm.wasmPaths (jsDelivr) at runtime instead of copying it into dist.
    resolve: {
      alias: [{ find: /^onnxruntime-web$/, replacement: 'onnxruntime-web/wasm' }],
      conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions],
    },
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
