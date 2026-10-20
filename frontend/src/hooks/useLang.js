import { useCallback, useEffect, useState } from 'react'
import { LANGS, STRINGS } from '../i18n.js'

const STORAGE_KEY = 'roni-lang'
const store = {
  get: () => { try { return localStorage.getItem(STORAGE_KEY) } catch { return null } },
  set: (v) => { try { localStorage.setItem(STORAGE_KEY, v) } catch { /* storage unavailable */ } },
}

function langFromPath() {
  const m = window.location.pathname.match(/^\/(id|en)(\/|$)/)
  return m ? m[1] : null
}

function initialLang() {
  const fromPath = langFromPath()
  if (fromPath) return fromPath
  const saved = store.get()
  if (LANGS.includes(saved)) return saved
  return (navigator.language || 'id').toLowerCase().startsWith('id') ? 'id' : 'en'
}

/** Language lives in the URL (/id or /en) so each version has its own address. */
export function useLang() {
  const [lang, setLangState] = useState(initialLang)

  // Put the language in the URL on first load (e.g. "/" -> "/id").
  useEffect(() => {
    if (!langFromPath()) {
      window.history.replaceState(null, '', `/${lang}${window.location.search}${window.location.hash}`)
    }
    const onPop = () => setLangState(langFromPath() || initialLang())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = lang
    store.set(lang)
  }, [lang])

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return
    window.history.pushState(null, '', `/${next}${window.location.search}${window.location.hash}`)
    setLangState(next)
  }, [])

  const t = useCallback((key) => STRINGS[lang][key] ?? STRINGS.id[key] ?? key, [lang])

  return { lang, setLang, t }
}
