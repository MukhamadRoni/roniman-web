import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Close, Logo, Menu } from './Icons.jsx'
import avatar from '../assets/avatar.webp'

const LINKS = [
  ['about', 'nav.about'],
  ['projects', 'nav.projects'],
  ['articles', 'nav.articles'],
  ['experience', 'nav.experience'],
  ['contact', 'nav.contact'],
]
// Sections without their own menu item highlight the closest one.
const SPY = { about: 'about', projects: 'projects', articles: 'articles', experience: 'experience', skills: 'experience', education: 'experience', contact: 'contact' }

function LangToggle({ lang, setLang, t }) {
  return (
    <div className="lang" role="group" aria-label={t('aria.lang')}>
      {['id', 'en'].map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

export default function Nav({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(false)
  const [pill, setPill] = useState({ x: 0, w: 0, visible: false })
  const linkRefs = useRef({})

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      if (window.scrollY < 200) setActive(null)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting && window.scrollY >= 200) setActive(SPY[e.target.id]) }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    Object.keys(SPY).forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el) })
    return () => spy.disconnect()
  }, [])

  // Slide the highlight pill under the active link (also after a language switch changes widths).
  useLayoutEffect(() => {
    const place = () => {
      const el = active && linkRefs.current[active]
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth, visible: true } : (p) => ({ ...p, visible: false }))
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active, lang])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="brand" aria-label="Mukhamad Roni"><Logo />Roni</a>
          <nav className="menu" aria-label={t('aria.mainMenu')}>
            <span className="pill" style={{ opacity: pill.visible ? 1 : 0, width: pill.w, transform: `translateX(${pill.x}px)` }} />
            {LINKS.map(([id, key]) => (
              <a key={id} href={`#${id}`} ref={(el) => { linkRefs.current[id] = el }} className={active === id ? 'active' : undefined}>{t(key)}</a>
            ))}
          </nav>
          <div className="nav-right">
            <LangToggle lang={lang} setLang={setLang} t={t} />
            <img className="avatar" src={avatar} alt="" width="36" height="36" />
            <a href="#contact" className="btn btn-primary">{t('cta.primary')}<ArrowUpRight /></a>
            <button className="burger" type="button" aria-label={t('aria.openMenu')} aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>

      <div className={`mobile-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="top">
          <span className="brand"><Logo />Roni</span>
          <button className="burger" style={{ display: 'inline-flex' }} type="button" aria-label={t('aria.closeMenu')} onClick={() => setOpen(false)}><Close /></button>
        </div>
        <nav>
          {LINKS.map(([id, key]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t(key)}</a>)}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 24 }}>
          <LangToggle lang={lang} setLang={setLang} t={t} />
          <a href="#contact" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: 52 }} onClick={() => setOpen(false)}>{t('cta.primary')}</a>
        </div>
      </div>
    </>
  )
}
