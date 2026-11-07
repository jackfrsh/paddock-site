import assert from 'node:assert/strict'
import { buildQuery, buildReport, summarise } from '../scripts/acquisition-report.mjs'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const row = (event, page, n, extra = {}) => ({ event, page, channel: 'search', location: '', target: '', variant: 'none', n, ...extra })
const rows = [
  row('calculator_started', 'tools_retirement_age', 200),
  row('calculator_completed', 'tools_retirement_age', 150),
  row('cta_displayed', 'tools_retirement_age', 100, { location: 'result', target: 'signup' }),
  row('cta_clicked', 'tools_retirement_age', 12, { location: 'result', target: 'signup' }),
  row('cta_clicked', 'landing', 40, { location: 'hero', target: 'signup' }),
  row('cta_clicked', 'landing', 9, { location: 'hero', target: 'app_store' }),
  row('calculator_started', 'tools_phased_drawdown', 10, { channel: 'direct' }),
]

test('query is a fixed aggregate over the documented columns', () => {
  const q = buildQuery('paddock_events', 7)
  assert.match(q, /^SELECT blob1 AS event, blob2 AS page, blob3 AS channel, blob4 AS location, blob5 AS target, blob6 AS variant, SUM\(_sample_interval\) AS n FROM paddock_events WHERE timestamp > NOW\(\) - INTERVAL '7' DAY GROUP BY /)
  assert.ok(!/\bSELECT \*/.test(q))
})

test('query rejects an unsafe dataset name and clamps the period', () => {
  assert.throws(() => buildQuery('x; DROP TABLE y', 7))
  assert.match(buildQuery('paddock_events', 9999), /INTERVAL '7' DAY/)
  assert.match(buildQuery('paddock_events', 30), /INTERVAL '30' DAY/)
})

test('summary counts started, completed, CTA and sign-up clicks per page', () => {
  const s = summarise(rows)
  const p = s.by.tools_retirement_age
  assert.equal(p.started, 200)
  assert.equal(p.completed, 150)
  assert.equal(p.displayed, 100)
  assert.equal(p.clicked, 12)
  assert.equal(s.signupByPage.landing, 40)
  assert.equal(s.signupByPage.tools_retirement_age, 12)
  assert.equal(s.channels.search, 200)
  assert.equal(s.channels.direct, 10)
})

test('report shows rates, marks live calculators and flags low volume', () => {
  const md = buildReport(rows, { days: 7, generatedAt: new Date('2026-11-07T00:00:00Z') })
  assert.match(md, /\| tools_retirement_age \| 200 \| 150 \| 75\.0% \| 100 \| 12 \| 12\.0% \|/)
  assert.match(md, /tools_phased_drawdown \| 10 \| 0 \| live/)
  assert.match(md, /\| landing \| 40 \|/)
  assert.match(buildReport([], {}), /No sign-up clicks recorded/)
  assert.match(md, /low volume/)
})

test('app store clicks are not counted as sign-up clicks', () => {
  assert.equal(summarise(rows).signupByPage.landing, 40)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
