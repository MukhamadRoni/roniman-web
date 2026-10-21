import { useRef, useState } from 'react'
import { classifyDocument } from './classify.js'
import { scaleToFit } from './image.js'
import { Shield, Upload } from './icons.jsx'

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']
const BOX = '#3DD6C0'

/** Draws numbered boxes over the image; the overlay has the image's pixel size, so CSS scaling keeps them aligned. */
function drawBoxes(canvas, lines) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const lw = Math.max(2, Math.round(canvas.width / 400))
  const size = Math.max(14, lw * 7)
  ctx.lineWidth = lw
  ctx.font = `600 ${Math.round(size * 0.72)}px ui-monospace, monospace`
  ctx.textBaseline = 'middle'
  lines.forEach(({ box }, i) => {
    ctx.strokeStyle = BOX
    ctx.strokeRect(box.x, box.y, box.width, box.height)
    const label = String(i + 1)
    const w = Math.max(size, ctx.measureText(label).width + 8)
    const y = Math.max(0, box.y - size)
    ctx.fillStyle = BOX
    ctx.fillRect(box.x, y, w, size)
    ctx.fillStyle = '#05070F'
    ctx.fillText(label, box.x + 4, y + size / 2)
  })
}

export default function OcrDemo({ lang, c, samples }) {
  const [status, setStatus] = useState('idle') // idle | loading | processing | done | error
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null) // key of c.errors
  const [result, setResult] = useState(null)
  const [hasImage, setHasImage] = useState(false)
  const [dragging, setDragging] = useState(false)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const inputRef = useRef(null)
  const runRef = useRef(0)
  const busyRef = useRef(false)
  const lastRef = useRef(null)

  const busy = status === 'loading' || status === 'processing'
  const fmt = new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 1 })

  async function run(source) {
    // A ref, not state: two clicks in the same frame must not start two runs.
    if (busyRef.current) return
    busyRef.current = true
    try { await start(source) } finally { busyRef.current = false }
  }

  async function start(source) {
    const id = ++runRef.current
    lastRef.current = source
    // Leave the previous error/result state at once, so no stale message shows meanwhile.
    setStatus('loading')
    setError(null)
    setResult(null)

    let bitmap
    try {
      // A sample that fails to load is a network problem, not a format problem.
      let blob = source
      if (typeof source === 'string') {
        const res = await fetch(source).catch(() => null)
        if (!res?.ok) throw Object.assign(new Error('sample fetch failed'), { key: 'download' })
        blob = await res.blob()
      }
      if (!ACCEPT.includes(blob.type)) throw Object.assign(new Error('unsupported'), { key: 'unsupported' })
      bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
    } catch (err) {
      setStatus('error')
      setError(err.key || 'unsupported')
      return
    }

    const { width, height } = scaleToFit(bitmap.width, bitmap.height)
    for (const canvas of [imageRef.current, overlayRef.current]) {
      canvas.width = width
      canvas.height = height
    }
    imageRef.current.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    setHasImage(true)

    let recognize
    try {
      const engine = await import('./ocrEngine.js')
      recognize = engine.recognize
      await engine.loadEngine((p) => id === runRef.current && setProgress(p))
    } catch (err) {
      console.error(err)
      if (id !== runRef.current) return
      setStatus('error')
      setError('download')
      return
    }

    setStatus('processing')
    // Let the "processing" state paint before the WASM work blocks the thread.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    try {
      const { lines, ms } = await recognize(imageRef.current)
      if (id !== runRef.current) return
      drawBoxes(overlayRef.current, lines)
      setResult({ lines, ms, ...classifyDocument(lines.map((l) => l.text)) })
      setStatus('done')
    } catch (err) {
      console.error(err)
      if (id !== runRef.current) return
      setStatus('error')
      setError('generic')
    }
  }

  const onFile = (file) => file && run(file)

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (!busy) onFile(e.dataTransfer.files?.[0])
  }

  const pct = progress ? Math.round((progress.loaded / progress.total) * 100) : 0
  const mb = (bytes) => fmt.format(bytes / 1e6)

  return (
    <div className="do-demo" data-status={status}>
      <p className="do-privacy-note"><Shield />{c.privacy}</p>

      <div className="do-demo-grid">
        <div
          className={`do-stage glass${dragging ? ' dragging' : ''}${hasImage ? ' has-image' : ''}`}
          onDragOver={(e) => { e.preventDefault(); if (!busy) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="do-canvas" hidden={!hasImage}>
            <canvas ref={imageRef} />
            <canvas ref={overlayRef} className="do-overlay" aria-hidden="true" />
            {busy && (
              <div className="do-busy" role="status">
                <span className="do-spinner" aria-hidden="true" />
                {status === 'loading'
                  ? (progress?.starting ? c.starting : `${c.loading} · ${mb(progress?.loaded ?? 0)} / ${mb(progress?.total ?? 0)} MB`)
                  : c.processing}
                {status === 'loading' && !progress?.starting && (
                  <span className="do-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
                )}
              </div>
            )}
          </div>

          {!hasImage && (
            <div className="do-drop">
              <span className="do-drop-ic"><Upload /></span>
              <p>{c.drop}</p>
              <p className="do-hint">{c.firstLoad}</p>
            </div>
          )}

          <div className="do-actions">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => inputRef.current?.click()}>
              <Upload />{hasImage ? c.again : c.upload}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(',')}
              hidden
              onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }}
            />
          </div>

          <div className="do-samples">
            <span>{c.samples}</span>
            <ul>
              {samples.map((s) => (
                <li key={s.id}>
                  <button type="button" disabled={busy} onClick={() => run(s.src)} aria-label={s.alt[lang]}>
                    <img src={s.src} alt="" width="96" height="64" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="do-results glass" aria-live="polite">
          {status === 'error' && (
            <div className="do-error">
              <p>{c.errors[error] || c.errors.generic}</p>
              {error !== 'unsupported' && lastRef.current && (
                <button type="button" className="btn btn-glass" onClick={() => run(lastRef.current)}>{c.retry}</button>
              )}
            </div>
          )}

          {result && (
            <>
              <div className="do-type">
                <span className="mono">{c.type}</span>
                <b>{c.types[result.type || 'unknown']}</b>
                <div className="do-conf">
                  <span>{c.confidence}</span>
                  <span className="do-bar"><i style={{ width: `${Math.round(result.score * 100)}%` }} /></span>
                  <span>{Math.round(result.score * 100)}%</span>
                </div>
              </div>
              <div className="do-meta">
                <span>{result.lines.length} {c.lines}</span>
                <span>{c.elapsed} {fmt.format(result.ms / 1000)} s</span>
              </div>
              {result.lines.length === 0
                ? <p className="do-empty">{c.noText}</p>
                : (
                  <ol className="do-lines">
                    {result.lines.map((l, i) => (
                      <li key={i}>
                        <span className="do-n">{i + 1}</span>
                        <span className="do-text">{l.text}</span>
                        <span className="do-pct">{Math.round(l.confidence * 100)}%</span>
                      </li>
                    ))}
                  </ol>
                )}
            </>
          )}

          {!result && status !== 'error' && (
            <div className="do-placeholder">
              <span className="mono">{c.results}</span>
              <p>{busy ? (status === 'loading' ? c.loading : c.processing) + '…' : c.drop}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
