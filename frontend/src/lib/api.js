// In development, /api is proxied to Laravel by Vite (see vite.config.js).
// In production, set VITE_API_URL when the API lives on another domain.
const BASE = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`)
    error.status = res.status
    error.errors = data?.errors
    throw error
  }
  return data
}

export const api = {
  portfolio: () => request('/portfolio'),
  sendMessage: (payload) => request('/messages', { method: 'POST', body: JSON.stringify(payload) }),
}
