import assert from 'node:assert/strict'
import {
  BLOB_COLUMNS, CHANNELS, EVENTS, EVENT_NAMES, LOCATIONS, PAGES, SCHEMA_VERSION, TARGETS, VARIANTS,
  parseEvent, toDataPoint,
} from './analyticsSchema.js'
import { classifyReferrer, isOptedOut, trackEvent } from './analytics.js'
import { onRequest, onRequestPost } from '../functions/api/e.js'

let passed = 0
let failed = 0
async function test(name, fn) {
  try { await fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const good = { event: 'calculator_completed', page: 'tools_fire_number', channel: 'search' }

await test('a well-formed calculator event is accepted', () => {
  const r = parseEvent(good)
  assert.equal(r.ok, true)
  assert.deepEqual(r.event, good)
})

await test('what the client sends is accepted again by the server schema, for every event', () => {
  const samples = [
    { event: 'calculator_started', page: 'tools_fire_number', channel: 'direct' },
    { event: 'calculator_completed', page: 'tools_fire_number', channel: 'direct' },
    { event: 'cta_displayed', page: 'tools_fire_number', channel: 'direct', location: 'result', target: 'signup' },
    { event: 'cta_clicked', page: 'guide_isa_allowance_uk', channel: 'search', location: 'bottom', target: 'signup' },
  ]
  for (const sample of samples) {
    const first = parseEvent(sample)
    assert.equal(first.ok, true, `${sample.event} rejected on the client`)
    const second = parseEvent(JSON.parse(JSON.stringify(first.event)))
    assert.equal(second.ok, true, `${sample.event} rejected on the server: ${second.reason}`)
  }
})

await test('a well-formed cta event is accepted', () => {
  const r = parseEvent({
    event: 'cta_clicked', page: 'tools_retirement_age', channel: 'direct',
    location: 'result', target: 'signup', variant: 'a',
  })
  assert.equal(r.ok, true)
})

await test('calculator events only accept calculator pages', () => {
  assert.equal(parseEvent({ ...good, page: 'landing' }).ok, false)
  assert.equal(parseEvent({ ...good, page: 'privacy' }).ok, false)
  assert.equal(parseEvent({ ...good, page: 'tools_hub' }).ok, false)
})

/* The central privacy guarantee: nothing a visitor typed can be sent. */
await test('values, balances, ages and free text are rejected, not stripped', () => {
  const smuggled = [
    { ...good, value: 250000 },
    { ...good, balance: '250000' },
    { ...good, retirementAge: 55 },
    { ...good, withdrawalRate: 0.04 },
    { ...good, currency: 'GBP' },
    { ...good, url: 'https://getpaddock.com/tools?pot=250000' },
    { ...good, note: 'my pension is 400000' },
    { ...good, userId: 'abc' },
  ]
  for (const payload of smuggled) {
    const r = parseEvent(payload)
    assert.equal(r.ok, false, JSON.stringify(payload))
    assert.match(r.reason, /^unexpected_field:/)
  }
})

await test('field values must come from the closed lists', () => {
  assert.equal(parseEvent({ ...good, channel: 'twitter-ad-1234' }).ok, false)
  assert.equal(parseEvent({ ...good, page: '/tools/fire-number-calculator?pot=100000' }).ok, false)
  assert.equal(parseEvent({ ...good, page: 5 }).ok, false)
  assert.equal(parseEvent({ event: 'cta_clicked', page: 'landing', channel: 'direct', location: 'x', target: 'signup' }).ok, false)
  assert.equal(parseEvent({ event: 'cta_clicked', page: 'landing', channel: 'direct', location: 'hero', target: 'https://evil.example' }).ok, false)
})

await test('unknown events and malformed payloads are rejected', () => {
  for (const bad of [null, undefined, 'x', 7, [], { event: 'page_view' }, { event: 'constructor' }, { event: '__proto__' }, {}]) {
    assert.equal(parseEvent(bad).ok, false)
  }
  assert.equal(parseEvent({ event: 'cta_clicked', page: 'landing', channel: 'direct' }).ok, false) // missing fields
})

await test('every enumerated value is a short lowercase token', () => {
  for (const list of [CHANNELS, LOCATIONS, TARGETS, VARIANTS, PAGES]) {
    for (const v of list) assert.match(v, /^[a-z0-9_]{1,40}$/)
  }
})

await test('data point layout matches the documented column order', () => {
  const dp = toDataPoint(parseEvent({
    event: 'cta_clicked', page: 'guide_how_much_retire_uk', channel: 'search',
    location: 'inline', target: 'signup',
  }).event)
  assert.deepEqual(BLOB_COLUMNS, ['event', 'page', 'channel', 'location', 'target', 'variant', 'schema_version'])
  assert.deepEqual(dp.blobs, ['cta_clicked', 'guide_how_much_retire_uk', 'search', 'inline', 'signup', 'none', String(SCHEMA_VERSION)])
  assert.deepEqual(dp.indexes, ['cta_clicked'])
  assert.deepEqual(dp.doubles, [1])
  assert.ok(Buffer.byteLength(dp.indexes[0]) <= 96)
})

await test('event catalogue is the documented four', () => {
  assert.deepEqual([...EVENT_NAMES].sort(), ['calculator_completed', 'calculator_started', 'cta_clicked', 'cta_displayed'])
  assert.ok(Object.values(EVENTS).every((spec) => spec.required.includes('page')))
})

await test('referrers are reduced to a class using the host only', () => {
  assert.equal(classifyReferrer(''), 'direct')
  assert.equal(classifyReferrer('https://www.google.com/search?q=my+pension+is+400000'), 'search')
  assert.equal(classifyReferrer('https://www.google.co.uk/'), 'search')
  assert.equal(classifyReferrer('https://duckduckgo.com/'), 'search')
  assert.equal(classifyReferrer('https://getpaddock.com/tools'), 'internal')
  assert.equal(classifyReferrer('https://app.getpaddock.com/home'), 'internal')
  assert.equal(classifyReferrer('https://www.reddit.com/r/UKPersonalFinance/'), 'social')
  assert.equal(classifyReferrer('https://t.co/abc'), 'social')
  assert.equal(classifyReferrer('https://example.org/blog'), 'other')
  assert.equal(classifyReferrer('not a url'), 'other')
})

await test('Global Privacy Control and Do Not Track are honoured', () => {
  assert.equal(isOptedOut({ globalPrivacyControl: true }), true)
  assert.equal(isOptedOut({ doNotTrack: '1' }), true)
  assert.equal(isOptedOut({ msDoNotTrack: '1' }), true)
  assert.equal(isOptedOut({ doNotTrack: '0' }), false)
  assert.equal(isOptedOut({}), false)
})

await test('the client sends nothing outside a browser on the production host', () => {
  assert.equal(trackEvent('calculator_completed', { page: 'tools_fire_number' }), false) // no window in Node
})

/* ── the Pages Function ─────────────────────────────────────────────────── */
function post(body, headers = {}) {
  return new Request('https://getpaddock.com/api/e', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'content-type': 'text/plain', Origin: 'https://getpaddock.com', ...headers },
  })
}
function fakeEnv() {
  const written = []
  return { written, env: { PADDOCK_EVENTS: { writeDataPoint: (dp) => written.push(dp) } } }
}

await test('function writes one aggregate data point for a valid event', async () => {
  const { written, env } = fakeEnv()
  const res = await onRequestPost({ request: post(good), env })
  assert.equal(res.status, 204)
  assert.equal(written.length, 1)
  assert.deepEqual(written[0].blobs.slice(0, 3), ['calculator_completed', 'tools_fire_number', 'search'])
})

await test('function stores nothing from the request beyond the validated fields', async () => {
  const { written, env } = fakeEnv()
  const req = post(good, { 'CF-Connecting-IP': '203.0.113.9', 'User-Agent': 'Mozilla/5.0 secret', Cookie: 'a=b', Referer: 'https://getpaddock.com/x?pot=1' })
  await onRequestPost({ request: req, env })
  const stored = JSON.stringify(written)
  for (const leaked of ['203.0.113.9', 'Mozilla', 'a=b', 'pot=1']) assert.ok(!stored.includes(leaked), leaked)
})

await test('function discards events when GPC or DNT is set', async () => {
  for (const h of [{ 'Sec-GPC': '1' }, { DNT: '1' }]) {
    const { written, env } = fakeEnv()
    const res = await onRequestPost({ request: post(good, h), env })
    assert.equal(res.status, 204)
    assert.equal(written.length, 0)
  }
})

await test('function ignores events from other origins (previews, local)', async () => {
  const { written, env } = fakeEnv()
  const res = await onRequestPost({ request: post(good, { Origin: 'https://paddock-site.pages.dev' }), env })
  assert.equal(res.status, 204)
  assert.equal(written.length, 0)
})

await test('function rejects bad payloads and oversized bodies without writing', async () => {
  const { written, env } = fakeEnv()
  assert.equal((await onRequestPost({ request: post('not json'), env })).status, 400)
  assert.equal((await onRequestPost({ request: post({ ...good, value: 1 }), env })).status, 400)
  assert.equal((await onRequestPost({ request: post({ ...good, page: 'x'.repeat(2000) }), env })).status, 413)
  assert.equal(written.length, 0)
})

await test('function is a harmless no-op before the binding exists', async () => {
  assert.equal((await onRequestPost({ request: post(good), env: {} })).status, 204)
  assert.equal((await onRequestPost({ request: post(good), env: undefined })).status, 204)
})

await test('function survives a failing binding', async () => {
  const env = { PADDOCK_EVENTS: { writeDataPoint: () => { throw new Error('boom') } } }
  assert.equal((await onRequestPost({ request: post(good), env })).status, 204)
})

await test('other methods get 405', () => {
  assert.equal(onRequest().status, 405)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
