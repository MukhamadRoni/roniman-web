import { useMemo } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js'
import { projectPath } from '../index.js'
import { ArrowLeft, Check } from '../topline/icons.jsx'
import { Cube } from './icons.jsx'
import { ASSETS, CATEGORIES, CLIENTS, CONTENT, REPO_URL, RELEASE_ZIP_URL, STATS } from './content.js'
import InstallTabs from './InstallTabs.jsx'
import ConveyorViewer from './ConveyorViewer.jsx'
import './simready.css'

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

export default function SimreadyPage({ lang }) {
  const c = CONTENT[lang]

  const meta = useMemo(() => ({
    title: c.meta.title,
    description: c.meta.description,
    path: projectPath(lang, 'simready-assets'),
    image: { src: ASSETS.ogImage, width: 1280, height: 640, alt: c.alt.og },
  }), [c, lang])
  useDocumentMeta(meta)

  return (
    <main id="top" className="sr">
      {/* ---------- hero ---------- */}
      <div className="sr-hero-wrap">
        <section className="sr-hero" aria-labelledby="sr-title">
          <div className="container sr-hero-head">
            <a className="sr-back" href={`/${lang}#projects`}><ArrowLeft />{c.back}</a>
            <span className="sr-logo"><Cube /></span>
            <span className="mono sr-eyebrow">{c.eyebrow}</span>
            <h1 id="sr-title">SimReady Assets</h1>
            <p className="sr-tagline">{c.tagline}</p>
            <p className="sr-desc">{c.desc}</p>
            <div className="sr-cta">
              <a className="btn btn-primary" href="#install">{c.ctaInstall}</a>
              <a className="btn btn-glass" href="#demo">{c.ctaDemo}</a>
            </div>
            <ul className="sr-chips">
              {c.chips.map((chip) => <li key={chip} className="chip">{chip}</li>)}
            </ul>
          </div>
        </section>
      </div>

      {/* ---------- live demo ---------- */}
      <section id="demo" aria-labelledby="sr-demo">
        <div className="container">
          <SecHead id="sr-demo" label={c.demo.label} title={c.demo.title} lead={c.demo.lead} />
          <div className="sr-demo-grid">
            <div className="sr-demo-main">
              <ConveyorViewer src={ASSETS.glb} poster={ASSETS.poster} c={c.demo} alt={c.alt.poster} />
              <p className="sr-credit">{c.demo.credit}</p>
            </div>
            <aside className="sr-stats glass reveal" aria-labelledby="sr-stats-title">
              <h3 id="sr-stats-title">{c.demo.statsTitle}</h3>
              <dl>
                {STATS.map((s) => (
                  <div key={s.key} className="sr-stat">
                    <dt>{s.label[lang]}</dt>
                    <dd>{s.value[lang]}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- install ---------- */}
      <section id="install" className="alt" aria-labelledby="sr-install">
        <div className="container">
          <SecHead id="sr-install" label={c.install.label} title={c.install.title} lead={c.install.lead} />
          <InstallTabs lang={lang} c={c.install} clients={CLIENTS} />
          <p className="sr-tested">{c.install.tested}</p>
          <div className="sr-links">
            <a className="btn btn-glass" href={REPO_URL} target="_blank" rel="noopener noreferrer">{c.install.repo}</a>
            <a className="btn btn-glass" href={RELEASE_ZIP_URL} rel="noopener noreferrer">{c.install.zip}</a>
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section aria-labelledby="sr-cats">
        <div className="container">
          <SecHead id="sr-cats" label={c.categories.label} title={c.categories.title} />
          <ul className="sr-cats">
            {CATEGORIES.map((cat, i) => (
              <li key={cat.group} className="glass reveal" style={{ '--d': `${i * 0.06}s` }}>
                <b>{cat.count.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</b>
                <span className="sr-cat-unit mono">{c.categories.assets}</span>
                <h3>{cat.label[lang]}</h3>
              </li>
            ))}
          </ul>
          <p className="sr-note sr-more">{c.categories.more}</p>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="alt" aria-labelledby="sr-how">
        <div className="container">
          <SecHead id="sr-how" label={c.how.label} title={c.how.title} />
          <ol className="sr-steps">
            {c.how.steps.map((s, i) => (
              <li key={s.title} className="glass reveal" style={{ '--d': `${i * 0.06}s` }}>
                <span className="sr-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="sr-how-grid">
            <div className="glass reveal sr-tools">
              <h3>{c.how.toolsTitle}</h3>
              <ul>
                {c.how.tools.map((t) => (
                  <li key={t.name}><code>{t.name}</code><span>{t.desc}</span></li>
                ))}
              </ul>
            </div>
            <div className="glass reveal sr-prompts">
              <h3>{c.how.promptsTitle}</h3>
              <ul>
                {c.how.prompts.map((p) => (
                  <li key={p}><span className="sr-check"><Check /></span><q>{p}</q></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- licence ---------- */}
      <section aria-labelledby="sr-license">
        <div className="container">
          <SecHead id="sr-license" label={c.license.label} title={c.license.title} />
          <div className="glass reveal sr-license">
            <p>{c.license.code}</p>
            <p>{c.license.assets}</p>
            <p className="sr-credit-label">{c.license.credit}</p>
            <blockquote>{c.license.creditLine}</blockquote>
            <p className="sr-credit-note">{c.license.creditNote}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
