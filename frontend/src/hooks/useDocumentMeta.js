import { useEffect } from 'react'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Title, description, canonical URL, and Open Graph tags for a page.
 * Paths are made absolute against the current origin, as Open Graph requires.
 */
export function useDocumentMeta({ title, description, path, image, video }) {
  useEffect(() => {
    const abs = (p) => new URL(p, window.location.origin).href
    document.title = title
    setMeta('name', 'description', description)
    setCanonical(abs(path))
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', abs(path))
    if (image) {
      setMeta('property', 'og:image', abs(image.src))
      setMeta('property', 'og:image:width', String(image.width))
      setMeta('property', 'og:image:height', String(image.height))
      setMeta('property', 'og:image:alt', image.alt)
      setMeta('name', 'twitter:card', 'summary_large_image')
    }
    if (video) {
      setMeta('property', 'og:video', abs(video.src))
      setMeta('property', 'og:video:type', video.type)
      setMeta('property', 'og:video:width', String(video.width))
      setMeta('property', 'og:video:height', String(video.height))
    }
  }, [title, description, path, image, video])
}
