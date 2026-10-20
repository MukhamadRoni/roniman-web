import { Logo } from './Icons.jsx'

export default function Loader({ error, onRetry, t }) {
  return (
    <div className="loader" role={error ? 'alert' : 'status'}>
      <div>
        <div className="dots"><Logo /></div>
        <p>{error ? t('error') : t('loading')}</p>
        {error && <button type="button" className="btn btn-primary" onClick={onRetry}>{t('retry')}</button>}
      </div>
    </div>
  )
}
