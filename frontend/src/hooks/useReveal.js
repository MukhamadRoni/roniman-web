import { useEffect } from 'react'

/**
 * Fades in every element with the .reveal class when it scrolls into view.
 * A MutationObserver picks up elements rendered later (filters, language switch).
 */
export function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [enabled])
}
