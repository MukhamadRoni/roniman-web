import { useEffect, useRef } from 'react'
import { Play } from './Icons.jsx'
import { useCountUp } from '../hooks/useCountUp.js'
import { formatDate } from '../lib/format.js'
import photo from '../assets/photo.webp'

function Stat({ value, suffix = '', label }) {
  const n = useCountUp(value)
  return <div className="stat"><b>{n}{suffix}</b><span className="lbl">{label}</span></div>
}

/** Subtle parallax on pointer move (desktop only, respects reduced motion). */
function useParallax() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = root.querySelectorAll('[data-par]')
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      els.forEach((el) => { const k = +el.dataset.par; el.style.translate = `${x * k}px ${y * k}px` })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return ref
}

export default function Hero({ profile, latestProject, latestArticle, lang, t }) {
  const ref = useParallax()
  return (
    <div className="hero-wrap" ref={ref}>
      <div className="hero">
        <div className="bg-img" data-par="16" aria-hidden="true" />
        <div className="hero-grid">
          <div>
            <div className="mono eyebrow">// {profile.role} · {profile.location}</div>
            <h1>
              {profile.hero.title[lang]}{' '}
              <a href="#projects" className="play">
                <span className="play-dot"><Play /></span>
                <span className="play-label">{t('cta.projects')}</span>
              </a>
            </h1>
            <p className="sub">{profile.hero.subtitle[lang]}</p>
            <div className="stats">
              <Stat value={profile.stats.years} suffix="+" label={t('stat.years')} />
              <Stat value={profile.stats.model_accuracy} suffix="%" label={t('stat.acc')} />
              <Stat value={profile.stats.public_repos} label={t('stat.repos')} />
            </div>
          </div>

          <div className="profile" data-par="-10">
            <div className="glass on-blue card">
              <div className="photo">
                <img src={photo} alt={t('alt.photo')} width="640" height="800" />
                {profile.available && <span className="status"><i />{t('status.available')}</span>}
                <div className="mono hud">BIO-STATUS: STABLE<br />CONNECTIVITY: ONLINE</div>
                <div className="meta"><b>{profile.name}</b><span>{profile.role} @ {profile.company}</span></div>
              </div>
            </div>
            {latestProject && (
              <a className="white-card wc1" href={latestProject.url} target="_blank" rel="noopener noreferrer">
                <div className="k"><i style={{ background: '#0B1660' }}>⌥</i>{t('hero.lastPush')}</div>
                <div className="v">
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 18 }}>{latestProject.name}</span>
                  <svg viewBox="0 0 64 24" fill="none" aria-hidden="true"><path d="M1 20 9 16l7 3 8-8 8 4 9-9 8 5 7-6 7 2" stroke="#43BA95" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="k" style={{ marginTop: 2 }}>{formatDate(latestProject.pushed_at, lang)}</div>
              </a>
            )}
            {latestArticle && (
              <a href="#articles" className="white-card wc2">
                <div className="k"><i style={{ background: '#2271E9' }}>✎</i>{t('hero.latest')}</div>
                <div className="t">{latestArticle.title}</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
