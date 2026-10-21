import { Suspense, useCallback, useEffect, useState } from 'react'
import { api } from './lib/api.js'
import { PROJECT_PAGES, projectSlugFromPath } from './pages/index.js'
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
  // Project pages are reached by a full page load, so the URL is read once.
  const [pageSlug] = useState(projectSlugFromPath)
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
    // Sections render after the data arrives, so jump to "/id#projects"-style links here.
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    const timer = setTimeout(() => document.body.classList.remove('intro'), 2600)
    return () => clearTimeout(timer)
  }, [data])

  if (!data) return <Loader error={error} onRetry={load} t={t} />

  const { profile, projects, articles, experiences, educations, skills } = data

  if (pageSlug) {
    const Page = PROJECT_PAGES[pageSlug]
    return (
      <>
        <Nav lang={lang} setLang={setLang} t={t} home={`/${lang}`} />
        <Suspense fallback={<Loader t={t} />}>
          <Page project={projects.find((p) => p.slug === pageSlug)} lang={lang} t={t} />
        </Suspense>
        <Footer contact={profile.contact} name={profile.name} t={t} />
      </>
    )
  }

  // The hero card says "latest push on GitHub", so projects without a repo don't count.
  const latestProject = projects.filter((p) => p.url).sort((a, b) => (b.pushed_at || '').localeCompare(a.pushed_at || ''))[0]

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
