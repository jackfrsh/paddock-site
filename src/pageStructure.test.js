/* Two guards for the whole site's markup and copy:
   1. Every page layout has exactly one <main id="main-content"> that the skip link
      can reach, and no page nests a second <main> inside GuideShell's.
   2. No page makes an unsupported claim about how long something takes
      ("most users ... under five minutes", "setup takes under two minutes").
      Reinstate a claim like that only with timed evidence behind it. */

import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}\n    ${err.message}`); failed++ }
}

const srcDir = fileURLToPath(new URL('.', import.meta.url))
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walk(p)
    return /\.(jsx?|mjs)$/.test(p) && !p.endsWith('.test.js') ? [p] : []
  })
}
const files = walk(srcDir)
const read = (p) => readFileSync(p, 'utf8')
const rel = (p) => relative(srcDir, p)
const count = (text, re) => (text.match(re) || []).length

test('GuideShell provides the main landmark and the skip link that targets it', () => {
  const t = read(join(srcDir, 'components/GuideLayout.jsx'))
  assert.equal(count(t, /<main id="main-content" tabIndex=\{-1\}/g), 1)
  assert.match(t, /<SkipLink \/>/)
})

test('every standalone page layout has exactly one main landmark with the skip-link target', () => {
  const standalone = files.filter((f) => /<SiteFooter\b/.test(read(f)) && !f.endsWith('GuideLayout.jsx'))
  assert.ok(standalone.length >= 14, `expected the page layouts, found ${standalone.length}`)
  for (const f of standalone) {
    const t = read(f)
    assert.equal(count(t, /<main id="main-content" tabIndex=\{-1\}>/g), 1, `${rel(f)}: main with id`)
    assert.equal(count(t, /<main\b/g), count(t, /<\/main>/g), `${rel(f)}: main tags balance`)
    assert.ok(/<SkipLink \/>|<SiteHeader\b/.test(t), `${rel(f)}: no skip link (directly or through SiteHeader)`)
  }
})

test('no page nests a second <main> inside GuideShell', () => {
  for (const f of files.filter((p) => /<GuideShell\b/.test(read(p)) && !p.endsWith('GuideLayout.jsx'))) {
    assert.equal(count(read(f), /<main\b/g), 0, `${rel(f)} renders its own <main> inside GuideShell`)
  }
})

test('no unsupported claim about how long something takes', () => {
  const banned = [
    [/\bmost (users|people|members)\b[^.<>]{0,120}\bminutes\b/i, '"most users/people ... minutes"'],
    [/\bunder (two|2|five|5|ten|10) minutes\b/i, '"under N minutes"'],
    [/\b(ten|fifteen|twenty) to (fifteen|twenty|thirty) minutes\b/i, 'a minutes range claimed as typical'],
  ]
  for (const f of files) {
    const t = read(f)
    for (const [re, label] of banned) {
      assert.doesNotMatch(t, re, `${rel(f)} contains ${label}`)
    }
  }
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
