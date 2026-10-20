import { useState } from 'react'
import { ArrowRight } from './Icons.jsx'
import { api } from '../lib/api.js'

export default function Contact({ contact, lang, t }) {
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState({ status: 'idle', message: '' })
  const waNumber = contact.whatsapp
  const prettyWa = `+${waNumber.slice(0, 2)} ${waNumber.slice(2, 5)}-${waNumber.slice(5, 9)}-${waNumber.slice(9)}`

  async function onSubmit(e) {
    e.preventDefault()
    const text = body.trim()
    if (!text) return setState({ status: 'error', message: t('contact.err') })
    if (text.length < 5) return setState({ status: 'error', message: t('contact.short') })

    // Open the tab synchronously so pop-up blockers allow it, then point it at WhatsApp.
    const tab = window.open('', '_blank')
    setState({ status: 'sending', message: t('contact.sending') })
    let url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
    try {
      const res = await api.sendMessage({ body: text, lang, website })
      url = res.whatsapp_url || url
      setState({ status: 'sent', message: t('contact.sent') })
      setBody('')
    } catch (err) {
      if (err.status === 429) {
        tab?.close()
        return setState({ status: 'error', message: t('contact.limit') })
      }
      if (err.status === 422) {
        tab?.close()
        return setState({ status: 'error', message: t('contact.short') })
      }
      // Backend unreachable: still let the visitor reach WhatsApp.
      setState({ status: 'idle', message: '' })
    }
    if (tab) tab.location.href = url
    else window.location.href = url
  }

  const quick = (key) => { setBody(t(`${key}t`)); setState({ status: 'idle', message: '' }) }

  return (
    <div className="contact-wrap" id="contact">
      <div className="contact">
        <div className="bg-img contact-bg" aria-hidden="true" />
        <div className="contact-grid">
          <div className="reveal">
            <span className="mono" style={{ color: 'rgba(242,246,255,.75)' }}>// Contact</span>
            <h2 style={{ marginTop: 16 }}>{t('contact.title')}</h2>
            <p className="lead">{t('contact.lead')}</p>
            <div className="contact-chips">
              <a className="btn btn-glass" href={`mailto:${contact.email}`}>{contact.email}</a>
              <a className="btn btn-glass" href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn btn-glass" href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <form className="prompt glass on-blue reveal" onSubmit={onSubmit} noValidate>
            <span className="tab mono">WhatsApp · {prettyWa}</span>
            <label htmlFor="msg" className="sr-only">{t('contact.label')}</label>
            <textarea
              id="msg"
              value={body}
              maxLength={2000}
              placeholder={t('contact.ph')}
              onChange={(e) => { setBody(e.target.value); if (state.status === 'error') setState({ status: 'idle', message: '' }) }}
            />
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <div className="bar"><span>{t('contact.reply')}</span><span className="mono" style={{ fontSize: 11 }}>ID / EN</span></div>
            <div className="tools">
              <div className="left">
                <button type="button" className="chip" onClick={() => quick('contact.q1')}>{t('contact.q1')}</button>
                <button type="button" className="chip" onClick={() => quick('contact.q2')}>{t('contact.q2')}</button>
              </div>
              <button type="submit" className="send" aria-label={t('aria.send')} disabled={state.status === 'sending'}><ArrowRight /></button>
            </div>
            <div className={state.status === 'error' ? 'err' : 'ok-msg'} role={state.status === 'error' ? 'alert' : 'status'}>{state.message}</div>
          </form>
        </div>
      </div>
    </div>
  )
}
