import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scaleToFit } from './image.js'

test('scales a landscape photo down to 1600 px wide', () => {
  assert.deepEqual(scaleToFit(4000, 3000), { width: 1600, height: 1200 })
})

test('scales a portrait photo down to 1600 px tall', () => {
  assert.deepEqual(scaleToFit(3000, 4000), { width: 1200, height: 1600 })
})

test('leaves small images as they are', () => {
  assert.deepEqual(scaleToFit(800, 600), { width: 800, height: 600 })
})

test('never rounds a side down to zero', () => {
  assert.equal(scaleToFit(1601, 1).height, 1)
})
