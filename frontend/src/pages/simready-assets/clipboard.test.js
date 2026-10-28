import { test } from 'node:test'
import assert from 'node:assert/strict'
import { copyText } from './clipboard.js'

test('resolves copied when writeText resolves', async () => {
  let got
  const nav = { clipboard: { writeText: async (t) => { got = t } } }
  assert.equal(await copyText('abc', nav), 'copied')
  assert.equal(got, 'abc')
})

test('resolves manual when the clipboard API is missing', async () => {
  assert.equal(await copyText('abc', {}), 'manual')
  assert.equal(await copyText('abc', undefined), 'manual')
})

test('resolves manual when writeText rejects', async () => {
  const nav = { clipboard: { writeText: async () => { throw new Error('denied') } } }
  assert.equal(await copyText('abc', nav), 'manual')
})

test('resolves manual when writeText throws synchronously', async () => {
  const nav = { clipboard: { writeText: () => { throw new Error('x') } } }
  assert.equal(await copyText('abc', nav), 'manual')
})
