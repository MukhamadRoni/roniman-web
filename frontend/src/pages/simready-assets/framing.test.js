import { test } from 'node:test'
import assert from 'node:assert/strict'
import { frameCamera } from './framing.js'

const SIZE = [2.1, 1.17, 2.07]
const radius = (s) => Math.hypot(...s) / 2
const rad = (d) => (d * Math.PI) / 180

test('whole bounding sphere fits at 16:9', () => {
  const r = radius(SIZE)
  const { distance } = frameCamera(SIZE, 40, 16 / 9)
  assert.ok(distance >= r / Math.sin(rad(40) / 2))
})

test('portrait uses the horizontal fov as limiting', () => {
  const r = radius(SIZE)
  const aspect = 0.5
  const hfov = 2 * Math.atan(Math.tan(rad(40) / 2) * aspect)
  const { distance } = frameCamera(SIZE, 40, aspect)
  assert.ok(distance >= r / Math.sin(hfov / 2))
})

test('min < distance < max', () => {
  const { distance, minDistance, maxDistance } = frameCamera(SIZE, 40, 16 / 9)
  assert.ok(minDistance < distance && distance < maxDistance)
})

test('portrait distance is larger than 16:9', () => {
  assert.ok(frameCamera(SIZE, 40, 0.5).distance > frameCamera(SIZE, 40, 16 / 9).distance)
})
