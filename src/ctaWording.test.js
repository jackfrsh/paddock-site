import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/* Guards the wording of every call to action on the public site.

   Paddock tracks the balances a person enters. It does not import or save the
   result of a calculator, so a button or heading that says "Save this
   projection in Paddock" describes something the product does not do
   (docs/pro-proposition-audit.md). An earlier fix reworded the result call to
   action (src/ctaCopy.js) but left the older block at the foot of six
   calculators and the tools hub, so this test scans the whole source tree. */

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const root = fileURLToPath(new URL('.', import.meta.url))

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walk(p)
    return /\.(jsx|js)$/.test(p) && !p.endsWith('.test.js') ? [p] : []
  })
}

const files = walk(root)

/* Phrases that say or imply the calculator's result is stored in Paddock. */
const UNSUPPORTED = [
  /save (this|your|the) (projection|plan|retirement plan|scenario|result|estimate|forecast)/i,
  /save (this|your|the) fire (target|number)/i,
  /save your projections/i,
  /save and track your net worth/i,
  /import (this|your) (projection|plan|result)/i,
  /decision support/i,
]

test('no call to action says a calculator result is saved in Paddock', () => {
  const hits = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const re of UNSUPPORTED) {
      const m = text.match(re)
      if (m) hits.push(`${relative(root, file)}: "${m[0]}"`)
    }
  }
  assert.deepEqual(hits, [], `unsupported wording found:\n    ${hits.join('\n    ')}`)
})

test('the scan covers the calculators and the tools hub', () => {
  const rels = files.map((f) => relative(root, f))
  for (const expected of [
    'tools/FireNumberCalculator.jsx', 'tools/RetirementBridgeCalculator.jsx', 'pages/ToolsHub.jsx',
  ]) {
    assert.ok(rels.includes(expected), `${expected} is not being scanned`)
  }
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
