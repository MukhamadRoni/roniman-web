import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SKILL_ICONS } from './Icons.jsx'
import avatar from '../assets/avatar.webp'

// Grid slots around the central node (desktop): top-left, top-right, mid-left, mid-right, bottom.
const SLOTS = ['c-tl', 'c-tr', 'c-ml', 'c-mr', 'c-b']

/** Builds connector paths from the core node to each skill card, using layout offsets (not transforms). */
function computePaths(core, nodes) {
  const box = (el) => ({ l: el.offsetLeft, t: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
  const c = box(core)
  const cx = c.l + c.w / 2
  const cy = c.t + c.h / 2
  return nodes.filter(Boolean).map((node) => {
    const r = box(node)
    const y = r.t + r.h / 2
    if (r.t > c.t + c.h) {
      return { d: `M${cx} ${c.t + c.h} L${cx} ${r.t}`, end: [cx, r.t] }
    }
    const left = r.l + r.w / 2 < cx
    const ex = left ? r.l + r.w : r.l
    const sx = left ? c.l + 6 : c.l + c.w - 6
    const mx = (ex + sx) / 2
    const rr = Math.min(12, Math.abs(y - cy) / 2)
    const dy = y > cy ? 1 : -1
    const hx = left ? -1 : 1
    const d = Math.abs(y - cy) < 2
      ? `M${sx} ${cy} L${ex} ${y}`
      : `M${sx} ${cy} L${mx - hx * rr} ${cy} Q${mx} ${cy} ${mx} ${cy + dy * rr} L${mx} ${y - dy * rr} Q${mx} ${y} ${mx + hx * rr} ${y} L${ex} ${y}`
    return { d, end: [ex, y] }
  })
}

export default function Skills({ skills, name, t }) {
  const wrap = useRef(null)
  const core = useRef(null)
  const nodes = useRef([])
  const svg = useRef(null)
  const [paths, setPaths] = useState([])
  const [drawn, setDrawn] = useState(false)

  useLayoutEffect(() => {
    const update = () => {
      if (!svg.current || getComputedStyle(svg.current).display === 'none') return setPaths([])
      setPaths(computePaths(core.current, nodes.current))
    }
    update()
    window.addEventListener('resize', update)
    document.fonts?.ready.then(update)
    return () => window.removeEventListener('resize', update)
  }, [skills])

  // Measure path lengths so the stroke-dash "draw" animation knows how far to travel.
  useLayoutEffect(() => {
    svg.current?.querySelectorAll('path').forEach((p) => p.style.setProperty('--len', Math.ceil(p.getTotalLength())))
  }, [paths])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect() } }, { threshold: 0.3 })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="skills">
      <div className="container">
        <div className="sec-head reveal"><div><span className="mono">// Stack</span><h2>{t('skills.title')}</h2></div></div>
        <div className={`skills${drawn ? ' drawn' : ''}`} ref={wrap}>
          <svg className="lines" ref={svg} aria-hidden="true">
            {paths.map((p, i) => (
              <g key={i}><path d={p.d} /><circle cx={p.end[0]} cy={p.end[1]} r="3" /></g>
            ))}
          </svg>
          {skills.slice(0, 5).map((group, i) => {
            const Icon = SKILL_ICONS[group.icon] || SKILL_ICONS.code
            return (
              <div key={group.key} className={`cluster glass reveal ${SLOTS[i]}`} ref={(el) => { nodes.current[i] = el }}>
                <h3><span className="ic"><Icon /></span>{group.name}</h3>
                <div className="chips">{group.items.map((item) => <span key={item} className="chip">{item}</span>)}</div>
              </div>
            )
          })}
          <div className="core glass featured reveal" ref={core}>
            <img src={avatar} alt="" />
            <b>{name}</b><span className="mono">Core node</span>
          </div>
        </div>
      </div>
    </section>
  )
}
