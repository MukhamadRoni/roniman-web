import { useMemo } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js'
import { projectPath } from '../index.js'
import { ArrowLeft, Check } from '../topline/icons.jsx'
import { ScanText } from './icons.jsx'
import { ASSETS, CONTENT } from './content.js'
import './document-ocr.css'

function SecHead({ label, title, lead, id }) {
  return (
    <div className="sec-head reveal">
      <div>
        <span className="mono">{label}</span>
        <h2 id={id}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </div>
  )
}

export default function DocumentOcrPage({ lang }) {
  const c = CONTENT[lang]

  const meta = useMemo(() => ({
    title: c.meta.title,
    description: c.meta.description,
    path: projectPath(lang, 'document-ocr'),
    image: { src: ASSETS.ogImage, width: 1280, height: 640, alt: c.alt.og },
  }), [c, lang])
  useDocumentMeta(meta)

  return (
    <main id="top" className="do">
      {/* ---------- hero ---------- */}
      <div className="do-hero-wrap">
        <section className="do-hero" aria-labelledby="do-title">
          <div className="container do-hero-head">
            <a className="do-back" href={`/${lang}#projects`}><ArrowLeft />{c.back}</a>
            <span className="do-logo"><ScanText /></span>
            <span className="mono do-eyebrow">{c.eyebrow}</span>
            <h1 id="do-title">Document OCR</h1>
            <p className="do-tagline">{c.tagline}</p>
            <p className="do-desc">{c.desc}</p>
            <div className="do-cta">
              <a className="btn btn-primary" href="#demo">{c.cta}</a>
            </div>
            <ul className="do-chips">
              {c.chips.map((chip) => <li key={chip} className="chip">{chip}</li>)}
            </ul>
          </div>
        </section>
      </div>

      {/* ---------- live demo ---------- */}
      <section id="demo" aria-labelledby="do-demo">
        <div className="container">
          <SecHead id="do-demo" label={c.demo.label} title={c.demo.title} />
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="alt" aria-labelledby="do-how">
        <div className="container">
          <SecHead id="do-how" {...c.how} />
          <ol className="do-steps">
            {c.how.steps.map(([title, text], i) => (
              <li key={title} className="glass reveal" style={{ '--d': `${i * 0.06}s` }}>
                <span className="do-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- performance ---------- */}
      <section aria-labelledby="do-perf">
        <div className="container">
          <SecHead id="do-perf" {...c.perf} />
          <dl className="do-stats">
            {c.perf.stats.map(([value, label], i) => (
              <div key={label} className={`do-stat glass reveal${i === 0 ? ' featured' : ''}`} style={{ '--d': `${i * 0.06}s` }}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="do-stack glass reveal">
            <h3>{c.perf.stackTitle}</h3>
            <ul className="do-chiplist">{c.perf.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
            <p>{c.perf.arch}</p>
          </div>
        </div>
      </section>

      {/* ---------- privacy ---------- */}
      <section className="alt" aria-labelledby="do-privacy">
        <div className="container">
          <SecHead id="do-privacy" label={c.privacy.label} title={c.privacy.title} />
          <ul className="do-checks">
            {c.privacy.items.map(([title, text]) => (
              <li key={title} className="reveal">
                <span className="do-check"><Check /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
