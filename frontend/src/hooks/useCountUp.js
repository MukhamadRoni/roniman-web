import { useEffect, useState } from 'react'

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useCountUp(target, { delay = 900, duration = 1200 } = {}) {
  const [value, setValue] = useState(reduceMotion() ? target : 0)

  useEffect(() => {
    if (reduceMotion()) { setValue(target); return }
    let frame
    const timer = setTimeout(() => {
      const start = performance.now()
      const step = (now) => {
        const k = Math.min(1, (now - start) / duration)
        setValue(Math.round(target * (1 - Math.pow(1 - k, 3))))
        if (k < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(frame) }
  }, [target, delay, duration])

  return value
}
