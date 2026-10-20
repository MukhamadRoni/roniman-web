import { formatMonth } from '../lib/format.js'

function Job({ job, lang, t, delay }) {
  const period = `${formatMonth(job.started_at, lang)} – ${job.ended_at ? formatMonth(job.ended_at, lang) : t('exp.present')}`
  return (
    <article className={`job glass reveal${job.featured ? ' featured' : ''}`} style={delay ? { '--d': delay } : undefined}>
      <div className="job-head">
        <div><h3>{job.company[lang]}</h3><div className="role">{job.role[lang]}</div></div>
        <span className={`status${job.ended_at ? ' grey' : ''}`}><i />{period}</span>
      </div>
      <ul>{job.highlights[lang].map((h, i) => <li key={i}>{h}</li>)}</ul>
      {job.tags.length > 0 && <div className="chips">{job.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}</div>}
    </article>
  )
}

export default function Experience({ experiences, lang, t }) {
  // The first two entries get full width, the rest sit in a two-column grid.
  const [first, second, ...rest] = experiences
  return (
    <section id="experience" className="alt">
      <div className="container">
        <div className="sec-head reveal"><div><span className="mono">// Experience</span><h2>{t('exp.title')}</h2></div></div>
        <div className="timeline">
          {first && <Job job={first} lang={lang} t={t} />}
          {second && <Job job={second} lang={lang} t={t} />}
          {rest.length > 0 && (
            <div className="job-sm">
              {rest.map((job, i) => <Job key={i} job={job} lang={lang} t={t} delay={i % 2 ? '.08s' : undefined} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
