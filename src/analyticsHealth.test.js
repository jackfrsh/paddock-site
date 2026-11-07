import test from 'node:test'
import assert from 'node:assert/strict'

import { evaluate } from './analyticsHealth.js'

const configured = { status: 200, body: { ok: true, storage: 'configured', schema: 1 } }
const missing = { status: 503, body: { ok: false, storage: 'missing', schema: 1 } }
const withBeacon = '<html><script defer src="https://static.cloudflareinsights.com/beacon.min.js"></script></html>'
const without = '<html><body>Paddock</body></html>'
const off = { webAnalytics: false, eventStorage: false, appRecordsSource: false }
const on = { webAnalytics: true, eventStorage: true, appRecordsSource: true }

const levels = (r) => Object.fromEntries(r.findings.map((f) => [f.check, f.level]))

test('nothing set up and nothing claimed: warns, does not fail', () => {
  const r = evaluate({ storage: missing, homepage: without, status: off })
  assert.deepEqual(levels(r), { 'event-storage': 'warning', 'web-analytics': 'warning' })
  assert.equal(r.failed, false)
})

test('everything set up and verified: all ok', () => {
  const r = evaluate({ storage: configured, homepage: withBeacon, status: on })
  assert.deepEqual(levels(r), { 'event-storage': 'ok', 'web-analytics': 'ok' })
  assert.equal(r.failed, false)
})

test('working but not yet recorded as verified: reminder notices', () => {
  const r = evaluate({ storage: configured, homepage: withBeacon, status: off })
  assert.deepEqual(levels(r), { 'event-storage': 'notice', 'web-analytics': 'notice' })
  assert.equal(r.failed, false)
})

test('a verified piece that stops working fails the check', () => {
  const lostStorage = evaluate({ storage: missing, homepage: withBeacon, status: on })
  assert.equal(levels(lostStorage)['event-storage'], 'error')
  assert.equal(lostStorage.failed, true)

  const lostBeacon = evaluate({ storage: configured, homepage: without, status: on })
  assert.equal(levels(lostBeacon)['web-analytics'], 'error')
  assert.equal(lostBeacon.failed, true)
})

test('an unreachable site is reported, and only fails what was claimed', () => {
  const unclaimed = evaluate({ storage: null, homepage: null, status: off })
  assert.equal(unclaimed.failed, false)
  assert.match(unclaimed.findings[0].message, /could not be reached/)
  assert.match(unclaimed.findings[1].message, /could not be fetched/)

  const claimed = evaluate({ storage: null, homepage: null, status: on })
  assert.equal(claimed.failed, true)
})

test('an unexpected answer is not treated as configured', () => {
  for (const storage of [
    { status: 200, body: null },
    { status: 200, body: { storage: 'missing' } },
    { status: 500, body: { storage: 'configured' } },
  ]) {
    assert.equal(levels(evaluate({ storage, homepage: withBeacon, status: on }))['event-storage'], 'error')
  }
})
