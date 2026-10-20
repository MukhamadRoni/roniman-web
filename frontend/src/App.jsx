import { useCallback, useEffect, useState } from 'react'
import { api } from './lib/api.js'
import { useLang } from './hooks/useLang.js'
import { useReveal } from './hooks/useReveal.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Articles from './components/Articles.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'

export default function App() {
  const { lang, setLang, t } = useLang()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setError(null)
    api.portfolio().then(setData).catch(setError)
  }, [])

  useEffect(() => { load() }, [load])
  useReveal(Boolean(data))

  // Intro animation classes are only needed for the first render of the page.
  useEffect(() => {
    if (!data) return
    const timer = setTimeout(() => document.body.classList.remove('intro'), 2600)
    return () => clearTimeout(timer)
  }, [data])

  if (!data) return <Loader error={error} onRetry={load} t={t} />

  const { profile, projects, articles, experiences, educations, skills } = data
  const latestProject = [...projects].sort((a, b) => (b.pushed_at || '').localeCompare(a.pushed_at || ''))[0]

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <main id="top">
        <Hero profile={profile} latestProject={latestProject} latestArticle={articles[0]} lang={lang} t={t} />
        <About about={profile.about} lang={lang} />
        <Projects projects={projects} totalRepos={profile.stats.public_repos} githubUrl={profile.contact.github} lang={lang} t={t} />
        <Articles articles={articles} lang={lang} t={t} />
        <Experience experiences={experiences} lang={lang} t={t} />
        <Skills skills={skills} name={profile.name} t={t} />
        <Education educations={educations} lang={lang} t={t} />
        <Contact contact={profile.contact} lang={lang} t={t} />
      </main>
      <Footer contact={profile.contact} name={profile.name} t={t} />
    </>
  )
}
