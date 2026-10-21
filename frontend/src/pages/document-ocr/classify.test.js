import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyDocument } from './classify.js'

test('recognises an ID card from five of its six keywords', () => {
  const r = classifyDocument([
    'PROVINSI JAWA TIMUR', 'KABUPATEN SIDOARJO', 'NIK : 3515000000000000',
    'Tempat/Tgl Lahir : SURABAYA', 'BERLAKU HINGGA : SEUMUR HIDUP',
  ])
  assert.equal(r.type, 'ktp')
  assert.equal(r.score, 5 / 6)
})

test('recognises an invoice with every keyword', () => {
  assert.deepEqual(
    classifyDocument(['INVOICE #001', 'Qty 2', 'Subtotal 10.000', 'PPN 1.100', 'Total 11.100']),
    { type: 'invoice', score: 1 },
  )
})

test('SUBTOTAL alone does not also count as TOTAL', () => {
  assert.equal(classifyDocument(['SUBTOTAL 10.000']).type, null)
})

test('NIK inside TEKNIK is not a match', () => {
  assert.deepEqual(classifyDocument(['S1 TEKNIK INFORMATIKA']), { type: null, score: 0 })
})

test('matching ignores case', () => {
  const r = classifyDocument(['curriculum vitae', 'experience', 'education'])
  assert.equal(r.type, 'cv')
  assert.equal(r.score, 0.75)
})

test('no text gives no type', () => {
  assert.deepEqual(classifyDocument([]), { type: null, score: 0 })
})
