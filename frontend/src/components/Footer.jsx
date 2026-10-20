export default function Footer({ contact, name, t }) {
  return (
    <footer>
      <div className="container">
        <span>© {new Date().getFullYear()} {name}</span>
        <span className="mono">Connectivity: online</span>
        <div className="links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="#top">{t('footer.top')}</a>
        </div>
      </div>
    </footer>
  )
}
