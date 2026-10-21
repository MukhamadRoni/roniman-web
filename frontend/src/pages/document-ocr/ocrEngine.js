// In-browser OCR engine: PaddleOCR PP-OCRv6 tiny on ONNX Runtime Web (WASM).
// Nothing here is bundled with the page: the libraries are a separate chunk loaded on
// first use, the WASM comes from jsDelivr, and the models from the public model repo.

const MODEL_REPO = 'PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main'

/** Move these if the third-party model repo ever disappears (e.g. to Hugging Face). */
export const MODEL_URLS = {
  detection: `https://media.githubusercontent.com/media/${MODEL_REPO}/detection/ort/PP-OCRv6_tiny_det.ort`,
  recognition: `https://media.githubusercontent.com/media/${MODEL_REPO}/recognition/ort/PP-OCRv6_tiny_rec.ort`,
  dictionary: `https://raw.githubusercontent.com/${MODEL_REPO}/recognition/ppocrv6_tiny_dict.txt`,
}

// Used for the progress bar when a server sends no Content-Length.
const KNOWN_SIZES = { detection: 1882568, recognition: 4530048, dictionary: 80000 }

let service = null
let loading = null

/** Downloads one file, reporting bytes received so far. */
async function download(url, onBytes) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  if (!res.body) {
    const buf = await res.arrayBuffer()
    onBytes(buf.byteLength)
    return buf
  }
  const reader = res.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    onBytes(received)
  }
  const out = new Uint8Array(received)
  let offset = 0
  for (const c of chunks) { out.set(c, offset); offset += c.length }
  return out.buffer
}

async function load(onProgress) {
  const [ort, { PaddleOcrService }] = await Promise.all([import('onnxruntime-web'), import('ppu-paddle-ocr/web')])
  ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ort.env.versions.web}/dist/`
  ort.env.wasm.numThreads = 1

  const total = Object.values(KNOWN_SIZES).reduce((a, b) => a + b, 0)
  const got = { detection: 0, recognition: 0, dictionary: 0 }
  const report = (key) => (bytes) => {
    got[key] = bytes
    onProgress?.({ loaded: got.detection + got.recognition + got.dictionary, total })
  }
  const [detection, recognition, charactersDictionary] = await Promise.all(
    Object.keys(got).map((key) => download(MODEL_URLS[key], report(key))),
  )
  onProgress?.({ loaded: total, total, starting: true })

  const ocr = new PaddleOcrService({
    model: { detection, recognition, charactersDictionary },
    session: { executionProviders: ['wasm'] },
  })
  await ocr.initialize()
  service = ocr
}

/**
 * Loads the engine once; later calls share the same promise. A failed load is
 * forgotten, so calling again retries.
 * @param {(p: { loaded: number, total: number, starting?: boolean }) => void} [onProgress]
 */
export function loadEngine(onProgress) {
  if (service) return Promise.resolve()
  loading ??= load(onProgress).catch((err) => { loading = null; throw err })
  return loading
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<{ lines: { text: string, confidence: number, box: { x: number, y: number, width: number, height: number } }[], ms: number }>}
 */
export async function recognize(canvas) {
  await loadEngine()
  const t0 = performance.now()
  const result = await service.recognize(canvas, { flatten: true, noCache: true })
  const ms = performance.now() - t0
  const lines = (result.results ?? [])
    .filter((r) => r.text?.trim())
    .map(({ text, confidence, box }) => ({ text: text.trim(), confidence, box }))
  return { lines, ms }
}
