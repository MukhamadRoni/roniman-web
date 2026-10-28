// Pure camera framing math (no three import) so it can be unit-tested in node.
export function frameCamera(size, fovDeg, aspect) {
  const radius = Math.hypot(size[0], size[1], size[2]) / 2
  const vHalf = (fovDeg * Math.PI) / 180 / 2
  const hHalf = Math.atan(Math.tan(vHalf) * aspect)
  const limiting = Math.min(vHalf, hHalf)
  const distance = (radius / Math.sin(limiting)) * 1.08
  return { distance, minDistance: radius * 0.6, maxDistance: distance * 2.5 }
}
