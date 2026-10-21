import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Code, GitHub } from './Icons.jsx'
import { PROJECT_PAGES, projectPath } from '../pages/index.js'
import { daysSince, timeAgo } from '../lib/format.js'

const CATEGORIES = ['all', 'web', 'data', 'auto', 'embedded', 'desktop']
const LANG_COLORS = {
  Python: '#3572A5', PHP: '#4F5D95', 'C++': '#f34b7d', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  'Jupyter Notebook': '#DA5B0B', HTML: '#e34c26', Go: '#00ADD8', Dart: '#00B4AB',
}

function ProjectCard({ project: p, lang, t }) {
  // Projects with a showcase page link there; the rest go straight to GitHub.
  const page = PROJECT_PAGES[p.slug] ? projectPath(lang, p.slug) : null
  const status = (
    <span className={`status${daysSince(p.pushed_at) < 180 ? '' : ' grey'}`}>
      <i />{p.featured ? `${t('proj.featured')} · ` : ''}{t(`cat.${p.category}`)}
    </span>
  )
  const body = (
    <>
      <div className="top"><span className="ic"><Code /></span>{status}</div>
      {page
        ? <a className="name" href={page} title={p.slug}>{p.name}</a>
        : <a className="name" href={p.url} target="_blank" rel="noopener noreferrer" title={p.slug}>{p.name}</a>}
      <p>{p.description[lang]}</p>
      <div className="chips">{p.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}</div>
      <div className="stats-row">
        {p.language && <span className="lang-dot"><i style={{ background: LANG_COLORS[p.language] || '#8a93a8' }} />{p.language}</span>}
        <span style={{ marginLeft: 'auto' }}>{t('proj.updated')} {timeAgo(p.pushed_at, lang)}</span>
      </div>
      <div className="links">
        {page && <a href={page}><ArrowRight />{t('proj.detail')}</a>}
        <a href={p.url} target="_blank" rel="noopener noreferrer"><GitHub />{t('proj.repo')}</a>
        {p.homepage && <a href={p.homepage} target="_blank" rel="noopener noreferrer"><ArrowUpRight />{t('proj.demo')}</a>}
      </div>
    </>
  )

  if (p.featured) {
    return (
      <article className="proj glass featured reveal">
        <div className="pf-left">{body}</div>
        {p.metrics?.[lang] && (
          <div className="pf-right">
            {p.metrics[lang].map(([k, v]) => <div key={k} className="metric"><span>{k}</span><b>{v}</b></div>)}
          </div>
        )}
      </article>
    )
  }
  return <article className="proj glass reveal">{body}</article>
}

export default function Projects({ projects, totalRepos, githubUrl, lang, t }) {
  const [cat, setCat] = useState('all')
  const shown = projects.filter((p) => cat === 'all' || p.category === cat)
  const more = Math.max(0, totalRepos - projects.length)

  return (
    <section id="projects" className="alt">
      <div className="container">
        <div className="sec-head reveal">
          <div><span className="mono">// Open source</span><h2>{t('proj.title')}</h2><p className="lead">{t('proj.lead')}</p></div>
          <a className="btn btn-glass" href={`${githubUrl}?tab=repositories`} target="_blank" rel="noopener noreferrer">{t('proj.all')}<ArrowUpRight /></a>
        </div>
        <div className="filters reveal" role="group" aria-label="Filter">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === 'all' ? t('filter.all') : t(`cat.${c}`)}
            </button>
          ))}
        </div>
        <div className="proj-grid">
          {shown.map((p) => <ProjectCard key={p.slug} project={p} lang={lang} t={t} />)}
          {cat === 'all' && more > 0 && (
            <a className="proj glass more reveal" href={`${githubUrl}?tab=repositories`} target="_blank" rel="noopener noreferrer">
              <span className="ic"><GitHub /></span>
              <div><b>+{more}</b><p>{t('proj.more')}</p></div>
              <span className="arrow"><ArrowUpRight /></span>
            </a>
          )}
          {shown.length === 0 && <p className="lead">{t('proj.empty')}</p>}
        </div>
      </div>
    </section>
  )
}
