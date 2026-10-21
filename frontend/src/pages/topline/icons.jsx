// Feature icons for the Topline page, drawn in the same stroke style as components/Icons.jsx.
const thin = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const Music = () => <svg viewBox="0 0 24 24" {...thin}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>
const Lyrics = () => <svg viewBox="0 0 24 24" {...thin}><path d="M4 6h10M4 12h16M4 18h8" /><path d="M18 4v6" opacity=".55" /></svg>
const Focus = () => <svg viewBox="0 0 24 24" {...thin}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></svg>
const Water = () => <svg viewBox="0 0 24 24" {...thin}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9 15a3 3 0 0 0 3 3" /></svg>
const Todo = () => <svg viewBox="0 0 24 24" {...thin}><rect x="3" y="4" width="18" height="16" rx="4" /><path d="m8 12 3 3 5-6" /></svg>
const Launcher = () => <svg viewBox="0 0 24 24" {...thin}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>
const Prayer = () => <svg viewBox="0 0 24 24" {...thin}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
const Clipboard = () => <svg viewBox="0 0 24 24" {...thin}><rect x="5" y="4" width="14" height="17" rx="3" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></svg>
const Peek = () => <svg viewBox="0 0 24 24" {...thin}><rect x="3" y="8" width="18" height="8" rx="4" /><circle cx="7.5" cy="12" r="1.2" fill="currentColor" /><path d="M11 12h6" /></svg>
const Eyes = () => <svg viewBox="0 0 24 24" {...thin}><rect x="6" y="7" width="4" height="10" rx="2" /><rect x="14" y="7" width="4" height="10" rx="2" /></svg>
const Settings = () => <svg viewBox="0 0 24 24" {...thin}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>

export const FEATURE_ICONS = { music: Music, lyrics: Lyrics, focus: Focus, water: Water, todo: Todo, launcher: Launcher, prayer: Prayer, clipboard: Clipboard, peek: Peek, eyes: Eyes, settings: Settings }

export const Download = () => <svg viewBox="0 0 24 24" {...thin} strokeWidth="2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
export const Check = () => <svg viewBox="0 0 24 24" {...thin} strokeWidth="2"><path d="m5 12 4.5 4.5L19 7" /></svg>
export const ArrowLeft = () => <svg viewBox="0 0 24 24" {...thin} strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
export const Pause = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
