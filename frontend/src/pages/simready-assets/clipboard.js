// Copy text to the clipboard. Never throws: resolves 'manual' when the
// Clipboard API is missing or refused, so the caller can fall back to
// selecting the text for Ctrl+C.
export async function copyText(text, nav = typeof navigator === 'undefined' ? undefined : navigator) {
  try {
    if (!nav || !nav.clipboard || typeof nav.clipboard.writeText !== 'function') return 'manual'
    await nav.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'manual'
  }
}
