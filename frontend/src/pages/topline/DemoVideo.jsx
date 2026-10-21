import { useEffect, useRef, useState } from 'react'
import { Play } from '../../components/Icons.jsx'
import { Pause } from './icons.jsx'

const reducedQuery = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(reducedQuery).matches)
  useEffect(() => {
    const mq = window.matchMedia(reducedQuery)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Muted, looping demo video that plays only while on screen.
 * `lazy` videos load nothing until they come near the viewport. With reduced motion
 * the poster stays until the viewer presses play.
 */
export default function DemoVideo({ src, poster, width, height, label, playLabel, pauseLabel, lazy = false, className = '' }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [loaded, setLoaded] = useState(!lazy)
  const [inView, setInView] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [userPlayed, setUserPlayed] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setLoaded(true)
    }, { rootMargin: '200px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const shouldPlay = loaded && inView && !userPaused && (!reduced || userPlayed)

  useEffect(() => {
    const video = ref.current
    if (shouldPlay) video.play().catch(() => setPlaying(false))
    else video.pause()
  }, [shouldPlay])

  const toggle = () => {
    if (playing) { setUserPaused(true); setUserPlayed(false) } else { setUserPaused(false); setUserPlayed(true) }
  }

  return (
    <div className={`tl-video ${className}`}>
      <video
        ref={ref}
        src={loaded ? src : undefined}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload={loaded ? 'metadata' : 'none'}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="tl-play" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
        {playing ? <Pause /> : <Play />}
      </button>
    </div>
  )
}
