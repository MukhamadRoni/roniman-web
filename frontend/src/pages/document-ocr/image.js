/** Size that fits inside maxSide on the longest side, keeping the aspect ratio. Never upscales. */
export function scaleToFit(width, height, maxSide = 1600) {
  const k = Math.min(1, maxSide / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * k)), height: Math.max(1, Math.round(height * k)) }
}
