export default function Education({ educations, lang, t }) {
  return (
    <section id="education" className="alt">
      <div className="container">
        <div className="sec-head reveal"><div><span className="mono">// Education</span><h2>{t('edu.title')}</h2></div></div>
        <div className="edu-grid">
          {educations.map((e, i) => (
            <div key={e.institution} className={`edu glass reveal${e.featured ? ' featured' : ''}`} style={{ '--d': `${0.05 * i}s` }}>
              <span className="mono" style={e.featured ? { color: 'rgba(242,246,255,.75)' } : undefined}>{e.period}</span>
              <h3>{e.institution}</h3>
              <p style={e.featured ? { color: 'rgba(242,246,255,.85)' } : undefined}>{e.description[lang]}</p>
              {e.score && (
                <div className="score">{e.score}<small style={{ fontSize: 14, opacity: 0.65 }}> / {e.score_max}</small></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
