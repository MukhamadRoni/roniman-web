const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const thin = { ...stroke, strokeWidth: 1.8 }

export const ArrowUpRight = () => <svg viewBox="0 0 24 24" {...stroke}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const ArrowRight = () => <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const Menu = () => <svg viewBox="0 0 24 24" {...stroke}><path d="M4 8h16M4 16h16" /></svg>
export const Close = () => <svg viewBox="0 0 24 24" {...stroke}><path d="M6 6l12 12M18 6 6 18" /></svg>
export const Play = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
export const Code = () => <svg viewBox="0 0 24 24" {...thin}><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></svg>
export const Chart = () => <svg viewBox="0 0 24 24" {...thin}><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /></svg>
export const Mobile = () => <svg viewBox="0 0 24 24" {...thin}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 17h2" /></svg>
export const Spark = () => <svg viewBox="0 0 24 24" {...thin}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" /><circle cx="12" cy="12" r="3" /></svg>
export const Chip = () => <svg viewBox="0 0 24 24" {...thin}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>
export const GitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
)
export const Logo = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <g fill="#F2F6FF">
      <circle cx="12" cy="3" r="1.6" /><circle cx="12" cy="21" r="1.6" /><circle cx="3" cy="12" r="1.6" /><circle cx="21" cy="12" r="1.6" />
      <circle cx="5.6" cy="5.6" r="1.3" opacity=".7" /><circle cx="18.4" cy="18.4" r="1.3" opacity=".7" />
      <circle cx="18.4" cy="5.6" r="1.3" opacity=".7" /><circle cx="5.6" cy="18.4" r="1.3" opacity=".7" />
    </g>
  </svg>
)

export const SKILL_ICONS = { code: Code, chart: Chart, mobile: Mobile, spark: Spark, chip: Chip }
