import test from 'node:test'
import assert from 'node:assert/strict'
import { CLIENTS, CONTENT, CATEGORIES } from './content.js'

test('every MCP config uses the pinned install spec', () => {
  const code = CLIENTS.flatMap((c) => c.blocks.map((b) => b.code)).join('\n')
  const specs = code.match(/git\+https:\/\/[^\s"]+/g)
  assert.ok(specs.length >= 4)
  assert.ok(specs.every((s) => s === 'git+https://github.com/MukhamadRoni/simready-assets@v0.1.0'))
})
test('all four clients are present, in order', () => {
  assert.deepEqual(CLIENTS.map((c) => c.id), ['claude-code', 'claude-desktop', 'cursor', 'vscode'])
})
test('JSON config blocks are valid JSON', () => {
  for (const c of CLIENTS) for (const b of c.blocks) if (b.file?.endsWith('.json')) JSON.parse(b.code)
})
test('ID and EN copy have the same keys', () => {
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]))
  assert.deepEqual(keys(CONTENT.id).sort(), keys(CONTENT.en).sort())
})
test('category counts match the catalog', () => {
  assert.deepEqual(CATEGORIES.map((c) => c.count), [131, 265, 447, 380, 220, 201])
})
test('Claude Desktop tab says the MCP does the work', () => {
  const d = CLIENTS.find((c) => c.id === 'claude-desktop')
  assert.match(d.note.en, /MCP/); assert.match(d.note.en, /guidance/i)
})
