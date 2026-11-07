import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MEASUREMENT_STATUS } from './measurementStatus.js'
import { websiteMeasurementCopy } from './privacyCopy.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}\n    ${err.message}`); failed++ }
}

const text = (status) => websiteMeasurementCopy(status)
  .flatMap((b) => (b.type === 'ul' ? b.items.map((i) => i.strong + i.text) : [b.text])).join('\n')

const off = { webAnalytics: false, eventStorage: false, appRecordsSource: false }
const all = { webAnalytics: true, eventStorage: true, appRecordsSource: true }

test('nothing is described as running while nothing is switched on', () => {
  const t = text(off)
  assert.match(t, /does not count visits/)
  assert.doesNotMatch(t, /counts page views/)
  assert.doesNotMatch(t, /small counter of anonymous events\b.*runs on our own/s)
  assert.doesNotMatch(t, /stores the page label/)
  assert.match(t, /does not store these labels yet/)
})

test('each measurement is described only when its flag is on', () => {
  assert.match(text({ ...off, webAnalytics: true }), /counts page views/)
  assert.doesNotMatch(text({ ...off, webAnalytics: true }), /anonymous events/)
  assert.match(text({ ...off, eventStorage: true }), /anonymous events/)
  assert.doesNotMatch(text({ ...off, eventStorage: true }), /counts page views/)
  assert.match(text({ ...off, eventStorage: true }), /Global Privacy Control/)
})

test('when everything is on, the page names every measurement and the source label', () => {
  const t = text(all)
  for (const phrase of ['Cloudflare Web Analytics', 'anonymous events', 'Global Privacy Control', 'stores the page label once', 'deleted with it']) {
    assert.ok(t.includes(phrase), phrase)
  }
})

test('every state says what is not used, and that Cloudflare hosts the site', () => {
  for (const status of [off, all, { ...off, webAnalytics: true }, { ...off, eventStorage: true }]) {
    const t = text(status)
    assert.match(t, /Google Analytics, advertising pixels or social media trackers/)
    assert.match(t, /hosted on Cloudflare/)
  }
})

test('the live flags are booleans and any "on" flag has a verification date', () => {
  for (const key of ['webAnalytics', 'eventStorage', 'appRecordsSource']) {
    assert.equal(typeof MEASUREMENT_STATUS[key], 'boolean', key)
  }
  if (Object.values(MEASUREMENT_STATUS).slice(0, 3).some(Boolean)) {
    assert.match(String(MEASUREMENT_STATUS.lastVerified), /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(MEASUREMENT_STATUS.lastVerified <= new Date().toISOString().slice(0, 10), 'verification date is in the future')
  }
})

test('the Privacy page uses this copy and makes no unqualified third-party sharing claim', () => {
  const page = readFileSync(new URL('./pages/Privacy.jsx', import.meta.url), 'utf8')
  assert.ok(page.includes('websiteMeasurementCopy'))
  assert.doesNotMatch(page, /not sold, shared\s+with third parties/)
  assert.doesNotMatch(page, /no data shared with third parties/i)
  for (const processor of ['Supabase', 'Railway', 'Stripe', 'Apple', 'Google']) assert.ok(page.includes(processor), processor)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
