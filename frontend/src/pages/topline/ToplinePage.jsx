import { useMemo } from 'react'
import { ArrowUpRight, GitHub } from '../../components/Icons.jsx'
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js'
import { projectPath } from '../index.js'
import DemoVideo from './DemoVideo.jsx'
import { ArrowLeft, Check, Download, FEATURE_ICONS } from './icons.jsx'
import { ASSETS, CONTENT, DOWNLOAD_URL, RELEASES_URL, REPO_URL } from './content.js'
import './topline.css'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

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

function Keys({ keys }) {
  return (
    <span className="tl-keys">
      {keys.map((k, i) => <span key={k}>{i > 0 && <span aria-hidden="true">+</span>}<kbd>{k}</kbd></span>)}
    </span>
  )
}

export default function ToplinePage({ project, lang }) {
  const c = CONTENT[lang]
  const repoUrl = project?.url || REPO_URL

  const meta = useMemo(() => ({
    title: c.meta.title,
    description: c.meta.description,
    path: projectPath(lang, 'topline'),
    image: { src: ASSETS.ogImage, width: 1280, height: 640, alt: `Topline · ${c.tagline}` },
    video: { src: ASSETS.video, type: 'video/mp4', width: 1920, height: 1080 },
  }), [c, lang])
  useDocumentMeta(meta)

  const videoLabels = { playLabel: c.play, pauseLabel: c.pause }

  return (
    <main id="top" className="tl">
      {/* ---------- hero ---------- */}
      <div className="tl-hero-wrap">
        <section className="tl-hero" aria-labelledby="tl-title">
          <div className="container tl-hero-head">
            <a className="tl-back" href={`/${lang}#projects`}><ArrowLeft />{c.back}</a>
            <img className="tl-logo" src={ASSETS.icon} alt={c.alt.logo} width="88" height="88" />
            <span className="mono tl-eyebrow">{c.eyebrow}</span>
            <h1 id="tl-title">Topline</h1>
            <p className="tl-tagline">{c.tagline}</p>
            <p className="tl-desc">{c.desc}</p>
            <div className="tl-cta">
              <a className="btn btn-primary" href={DOWNLOAD_URL}><Download />{c.download}</a>
              <a className="btn btn-glass" href={repoUrl} {...ext}><GitHub />{c.github}</a>
            </div>
            <ul className="tl-chips">
              {c.chips.map((chip) => <li key={chip} className="chip">{chip}</li>)}
            </ul>
          </div>
          <div className="container">
            <div className="tl-screen glass on-blue">
              <DemoVideo src={ASSETS.video} poster={ASSETS.poster} width="1920" height="1080" label={c.alt.video} {...videoLabels} />
            </div>
          </div>
        </section>
      </div>

      {/* ---------- features ---------- */}
      <section aria-labelledby="tl-features">
        <div className="container">
          <SecHead id="tl-features" {...c.features} />
          <ul className="tl-features">
            {c.features.items.map(([icon, title, text], i) => {
              const Icon = FEATURE_ICONS[icon]
              return (
                <li key={icon} className="tl-feature glass reveal" style={{ '--d': `${(i % 3) * 0.06}s` }}>
                  <span className="ic"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---------- vertical demo ---------- */}
      <section className="alt" aria-labelledby="tl-vertical">
        <div className="container tl-vertical">
          <div className="tl-phone reveal">
            <DemoVideo lazy src={ASSETS.videoVertical} poster={ASSETS.posterVertical} width="1080" height="1920" label={c.alt.videoVertical} {...videoLabels} />
          </div>
          <div className="tl-vertical-text">
            <SecHead id="tl-vertical" {...c.vertical} />
            <ol className="tl-steps">
              {c.vertical.steps.map(([title, text], i) => (
                <li key={title} className="reveal" style={{ '--d': `${i * 0.06}s` }}>
                  <span className="tl-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- performance ---------- */}
      <section aria-labelledby="tl-perf">
        <div className="container">
          <SecHead id="tl-perf" {...c.perf} />
          <dl className="tl-stats">
            {c.perf.stats.map(([value, label], i) => (
              <div key={label} className={`tl-stat glass reveal${i === 0 ? ' featured' : ''}`} style={{ '--d': `${i * 0.06}s` }}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="tl-tech">
            <div className="tl-how glass reveal">
              <h3>{c.perf.howTitle}</h3>
              <ul>
                {c.perf.how.map(([title, text]) => <li key={title}><b>{title}.</b> {text}</li>)}
              </ul>
            </div>
            <div className="tl-stack glass reveal">
              <h3>{c.perf.stackTitle}</h3>
              <ul className="tl-chiplist">{c.perf.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
              <p>{c.perf.arch}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- privacy ---------- */}
      <section className="alt" aria-labelledby="tl-privacy">
        <div className="container">
          <SecHead id="tl-privacy" label={c.privacy.label} title={c.privacy.title} />
          <div className="tl-privacy">
            <ul className="tl-checks">
              {c.privacy.items.map(([title, text]) => (
                <li key={title} className="reveal">
                  <span className="tl-check"><Check /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ul>
            <div className="tl-path glass reveal">
              <span className="mono">{c.privacy.pathLabel}</span>
              <code>%LOCALAPPDATA%\Topline\data.json</code>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- install ---------- */}
      <section aria-labelledby="tl-install">
        <div className="container">
          <SecHead id="tl-install" label={c.install.label} title={c.install.title} />
          <div className="tl-install">
            <ol className="tl-install-steps">
              {c.install.steps.map(([title, text], i) => (
                <li key={title} className="glass reveal" style={{ '--d': `${i * 0.06}s` }}>
                  <span className="tl-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <aside className="tl-install-side glass reveal" aria-label={c.install.reqTitle}>
              <h3>{c.install.reqTitle}</h3>
              <p>{c.install.req}</p>
              <h3>{c.install.keysTitle}</h3>
              <ul className="tl-shortcuts">
                {c.install.keys.map(([keys, label]) => <li key={label}><Keys keys={keys} /><span>{label}</span></li>)}
              </ul>
              <div className="tl-cta">
                <a className="btn btn-primary" href={DOWNLOAD_URL}><Download />{c.install.cta}</a>
                <a className="btn btn-glass" href={RELEASES_URL} {...ext}>{c.install.releases}<ArrowUpRight /></a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- roadmap + contribute ---------- */}
      <section className="alt" aria-labelledby="tl-roadmap">
        <div className="container">
          <SecHead id="tl-roadmap" label={c.roadmap.label} title={c.roadmap.title} />
          <div className="tl-roadmap">
            {c.roadmap.cols.map(([title, state, items], i) => (
              <div key={state} className={`tl-col glass reveal ${state}`} style={{ '--d': `${i * 0.06}s` }}>
                <h3><i aria-hidden="true" />{title}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="tl-contrib reveal">
            <div>
              <h3>{c.roadmap.contribTitle}</h3>
              <p>{c.roadmap.contrib}</p>
              <p className="mono tl-license">{c.roadmap.license}</p>
            </div>
            <a className="btn btn-primary" href={repoUrl} {...ext}><GitHub />{c.roadmap.contribCta}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
