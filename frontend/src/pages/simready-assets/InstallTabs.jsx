import { useEffect, useRef, useState } from 'react'
import { copyText } from './clipboard.js'
import './simready.css'

function CodeBlock({ block, lang, c }) {
  const [state, setState] = useState('idle')
  const codeRef = useRef(null)
  const timer = useRef(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(timer.current) }
  }, [])

  const onCopy = async () => {
    const r = await copyText(block.code)
    if (!mounted.current) return
    if (r === 'manual' && codeRef.current) {
      try {
        const sel = window.getSelection()
        if (sel) {
          const range = document.createRange()
          range.selectNodeContents(codeRef.current)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } catch { /* hint label still shows */ }
    }
    setState(r)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  const label = state === 'copied' ? c.copied : state === 'manual' ? c.manual : c.copy
  return (
    <div className="sr-block">
      <div className="sr-block-head">
        <span className="sr-block-title">{block.title[lang]}</span>
        {block.file && <span className="sr-block-file">{block.file}</span>}
        <button type="button" className="sr-copy" data-state={state} onClick={onCopy}>{label}</button>
      </div>
      <div className="sr-code-wrap">
        <pre className="sr-pre"><code ref={codeRef}>{block.code}</code></pre>
        <span className="sr-sr-only" role="status" aria-live="polite">{state === 'idle' ? '' : label}</span>
      </div>
    </div>
  )
}

export default function InstallTabs({ lang, c, clients }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])

  const onKeyDown = (e) => {
    const n = clients.length
    let next = null
    if (e.key === 'ArrowRight') next = (active + 1) % n
    else if (e.key === 'ArrowLeft') next = (active - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const client = clients[active]
  return (
    <div className="sr-tabs">
      <div className="sr-tablist" role="tablist" aria-label={c.tabsLabel} onKeyDown={onKeyDown}>
        {clients.map((cl, i) => (
          <button
            key={cl.id}
            ref={(el) => { tabRefs.current[i] = el }}
            type="button"
            role="tab"
            id={`sr-tab-${cl.id}`}
            aria-selected={i === active}
            aria-controls={`sr-panel-${cl.id}`}
            tabIndex={i === active ? 0 : -1}
            className="sr-tab"
            onClick={() => setActive(i)}
          >
            {cl.label}
          </button>
        ))}
      </div>
      <div
        className="sr-panel"
        role="tabpanel"
        id={`sr-panel-${client.id}`}
        aria-labelledby={`sr-tab-${client.id}`}
        key={client.id}
      >
        {client.blocks.map((b, i) => (
          <CodeBlock key={i} block={b} lang={lang} c={c} />
        ))}
        {client.note && <p className="sr-note">{client.note[lang]}</p>}
      </div>
    </div>
  )
}
