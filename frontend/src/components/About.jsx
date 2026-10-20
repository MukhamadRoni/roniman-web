import { createElement } from 'react'
import { richText } from '../lib/format.js'

export default function About({ about, lang }) {
  return (
    <section id="about">
      <div className="fade-top" />
      <div className="container about-grid">
        <div className="reveal">
          <div className="sec-head" style={{ marginBottom: 28 }}>
            <div><span className="mono">// About</span><h2>{about.title[lang]}</h2></div>
          </div>
          {about.paragraphs[lang].map((p, i) => <p key={i}>{richText(p, createElement)}</p>)}
        </div>
        <div className="tiles">
          {about.tiles.map((tile, i) => (
            <div key={i} className={`tile glass reveal${tile.featured ? ' featured' : ''}`} style={{ '--d': `${0.05 * (i + 1)}s` }}>
              <b>{tile.value}</b><span>{tile.label[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
