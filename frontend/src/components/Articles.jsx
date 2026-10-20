import { useState } from 'react'
import { ArrowUpRight } from './Icons.jsx'
import { formatDate } from '../lib/format.js'

const HUES = ['', 'hue-rotate(-12deg)', 'hue-rotate(10deg) saturate(1.1)', 'hue-rotate(-24deg)']

function Cover({ article, index, small }) {
  return (
    <div className={small ? 'thumb' : 'cover'} style={{ background: 'var(--grad-hero)', filter: HUES[index % HUES.length] || undefined }}>
      {small ? (
        <span className="ring" style={{ width: 110, height: 110, right: -40, bottom: -50, borderWidth: 16 }} />
      ) : (
        <>
          <span className="ring" style={{ width: 520, height: 520, right: -180, bottom: -280 }} />
          <span className="ring" style={{ width: 220, height: 220, right: '22%', top: -120, borderWidth: 24 }} />
          {article.cover_code && <code>{article.cover_code}</code>}
        </>
      )}
    </div>
  )
}

function Meta({ article, lang, t }) {
  return (
    <div className="art-meta mono">
      <span className="lbadge">{article.lang.toUpperCase()}</span>
      <span>{article.platform}</span><span>·</span>
      <span>{formatDate(article.published_at, lang)}</span><span>·</span>
      <span>{article.read_minutes} {t('art.min')}</span>
    </div>
  )
}

// Articles without a URL yet (samples) render as non-navigating cards.
const linkProps = (a) => (a.url ? { href: a.url, target: '_blank', rel: 'noopener noreferrer' } : { href: '#articles' })

export default function Articles({ articles, lang, t }) {
  const [filter, setFilter] = useState('all')
  const list = articles.filter((a) => filter === 'all' || a.lang === filter)
  const [big, ...rest] = list
  const hasSamples = articles.some((a) => a.sample)

  return (
    <section id="articles">
      <div className="container">
        <div className="sec-head reveal">
          <div><span className="mono">// Writing</span><h2>{t('art.title')}</h2><p className="lead">{t('art.lead')}</p></div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {hasSamples && <span className="badge-dummy">{t('dummy')}</span>}
            <div className="filters art-filter" role="group" aria-label="Language filter" style={{ margin: 0 }}>
              {['all', 'id', 'en'].map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f === 'all' ? t('filter.all') : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        {!big ? (
          <p className="lead">{t('art.empty')}</p>
        ) : (
          <div className="art-grid">
            <a className="art-big glass reveal" {...linkProps(big)}>
              <Cover article={big} index={0} />
              <div className="body">
                <Meta article={big} lang={lang} t={t} />
                <h3>{big.title}</h3>
                {big.excerpt && <p>{big.excerpt}</p>}
                <div className="chips" style={{ display: 'flex', gap: 6 }}>{big.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}</div>
              </div>
            </a>
            <div className="art-list">
              {rest.map((a, i) => (
                <a key={a.id} className="art-row glass reveal" {...linkProps(a)}>
                  <Cover article={a} index={i + 1} small />
                  <div><h4>{a.title}</h4><Meta article={a} lang={lang} t={t} /></div>
                  <span className="arrow"><ArrowUpRight /></span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
