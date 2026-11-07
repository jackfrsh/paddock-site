import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  COMPARISON_CHECKED_ON, EMMA_PRICES, MONEYHUB_APP_END_DATE, VENDOR_NAMES, VENDOR_SOURCES,
  WEALTHVIEW_PREMIUM_PRICE,
} from './comparisonFacts.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const root = fileURLToPath(new URL('..', import.meta.url))
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walk(p)
    return /\.(jsx?|md)$/.test(p) ? [p] : []
  })
}

test('check date is a real ISO date', () => {
  assert.match(COMPARISON_CHECKED_ON, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(!Number.isNaN(Date.parse(COMPARISON_CHECKED_ON)))
})

test('every vendor named on the comparison pages has https sources', () => {
  for (const key of Object.keys(VENDOR_NAMES)) {
    const sources = VENDOR_SOURCES[key]
    assert.ok(sources && sources.length >= 2, `${key} needs at least two sources`)
    for (const s of sources) {
      assert.match(s.url, /^https:\/\//, `${key}: ${s.url}`)
      assert.ok(s.label.length > 10, `${key}: label too short`)
    }
  }
})

test('every vendor has at least one source from the vendor itself or the vendor\'s store listing', () => {
  const firstParty = {
    emma: /emma-app\.com|apps\.apple\.com/,
    wealthr: /wealthr\.co\.uk/,
    wealthview: /wealthview\.co\.uk|apps\.apple\.com|play\.google\.com/,
    moneyhub: /moneyhub\.com/,
  }
  for (const [key, re] of Object.entries(firstParty)) {
    assert.ok(VENDOR_SOURCES[key].some((s) => re.test(s.url)), `${key} has no first-party source`)
  }
})

test('prices match what the vendors showed on the check date', () => {
  assert.equal(EMMA_PRICES.plusMonthly, 4.99)
  assert.equal(EMMA_PRICES.proMonthly, 9.99)
  assert.equal(EMMA_PRICES.proAnnual, 83.99)
  assert.equal(EMMA_PRICES.ultimateMonthly, 14.99)
  assert.equal(WEALTHVIEW_PREMIUM_PRICE, 7.99)
  assert.equal(MONEYHUB_APP_END_DATE, '2026-08-14')
})

/* Claims we found to be wrong or unverifiable on 7 November 2026. They must not
   return to the comparison pages without a new, sourced check. */
test('retired competitor claims have not come back', () => {
  const banned = [
    [/Self-hosted option/i, 'WealthR self-hosting was not found on its site'],
    [/Completely free\./, 'WealthR has a free tier and a paid Pro tier'],
    [/Large, active team/i, 'unverifiable'],
    [/version 3 rollout|v3 attracted/i, 'unverified complaint claim about Emma'],
    [/iCloud sync only/i, 'WealthView sync method was not verified'],
    [/No meaningful projections/i, 'WealthView has a retirement modeller'],
    [/Open banking required/, 'Emma offers manual accounts on paid plans'],
    [/Moneyhub has closed/i, 'closure completion is not confirmed by Moneyhub'],
    [/consumer app closed in August 2026/i, 'closure completion is not confirmed by Moneyhub'],
    [/nothing is shared — you enter/i, 'Paddock stores balances in its own account'],
    [/Open banking tools require you to share credentials/i, 'open banking is approved at the bank'],
    [/well-\s*reviewed/i, 'unverifiable review claim'],
  ]
  const hits = []
  for (const file of walk(join(root, 'src'))) {
    if (file.endsWith('.test.js')) continue
    const text = readFileSync(file, 'utf8')
    for (const [re, why] of banned) if (re.test(text)) hits.push(`${file.replace(root, '')}: ${why}`)
  }
  assert.deepEqual(hits, [])
})

test('both comparison pages show the sources block', () => {
  for (const f of ['src/pages/BestNetWorthAppsUK.jsx', 'src/pages/MoneyHubAlternative.jsx']) {
    assert.match(readFileSync(join(root, f), 'utf8'), /<ComparisonSources /, f)
  }
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
