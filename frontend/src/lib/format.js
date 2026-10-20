const locale = (lang) => (lang === 'id' ? 'id-ID' : 'en-US')
const parse = (date) => new Date(`${date}T00:00:00`)

export function formatDate(date, lang) {
  if (!date) return ''
  return parse(date).toLocaleDateString(locale(lang), { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonth(date, lang) {
  return parse(date).toLocaleDateString(locale(lang), { month: 'short', year: 'numeric' })
}

export function timeAgo(date, lang) {
  if (!date) return ''
  const days = Math.max(0, Math.round((Date.now() - parse(date)) / 864e5))
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  if (days < 7) return rtf.format(-days, 'day')
  if (days < 30) return rtf.format(-Math.round(days / 7), 'week')
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month')
  return rtf.format(-Math.round(days / 365), 'year')
}

export function daysSince(date) {
  return date ? (Date.now() - parse(date)) / 864e5 : Infinity
}

/** Renders **bold** markers from the API as <strong>. Returns an array of strings and elements. */
export function richText(text, createElement) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? createElement('strong', { key: i }, part.slice(2, -2)) : part,
  )
}
