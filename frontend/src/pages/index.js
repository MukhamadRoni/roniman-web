import { lazy } from 'react'

/**
 * Projects with their own showcase page at /{lang}/projects/{slug}.
 * Each page is a separate chunk, so the landing page does not load it.
 */
export const PROJECT_PAGES = {
  topline: lazy(() => import('./topline/ToplinePage.jsx')),
  'document-ocr': lazy(() => import('./document-ocr/DocumentOcrPage.jsx')),
}

export const projectPath = (lang, slug) => `/${lang}/projects/${slug}`

/** Slug of the showcase page in the current URL, or null on the landing page. */
export function projectSlugFromPath() {
  const m = window.location.pathname.match(/^\/(?:(?:id|en)\/)?projects\/([^/]+)\/?$/)
  return m && PROJECT_PAGES[m[1]] ? m[1] : null
}
