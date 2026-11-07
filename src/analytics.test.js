import assert from 'node:assert/strict'
import {
  BLOB_COLUMNS, CHANNELS, EVENTS, EVENT_NAMES, LOCATIONS, PAGES, SCHEMA_VERSION, TARGETS, VARIANTS,
  parseEvent, toDataPoint,
} from './analyticsSchema.js'
import { classifyReferrer, isOptedOut, trackEvent, trackVisitorLanding, withVisitChannel } from './analytics.js'
import { onRequest, onRequestGet, onRequestPost } from '../functions/api/e.js'

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
    { event: 'visitor_landing', page: 'guide_isa_allowance_uk', channel: 'search' },
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

await test('event catalogue is the documented five', () => {
  assert.deepEqual([...EVENT_NAMES].sort(), ['calculator_completed', 'calculator_started', 'cta_clicked', 'cta_displayed', 'visitor_landing'])
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

await test('the visit channel is added to sign-up links only inside a production browser', () => {
  const link = 'https://app.getpaddock.com/auth?mode=signup&src=tools_fire_number'
  assert.equal(withVisitChannel(link), link) // no window in Node: nothing is added
  assert.equal(withVisitChannel(undefined), undefined)
})

await test('the visit channel is a closed-list value, added once, to sign-up links only', async () => {
  const saved = { window: globalThis.window, navigator: globalThis.navigator, document: globalThis.document, location: globalThis.location }
  const setEnv = (nav, referrer) => {
    globalThis.window = { location: { hostname: 'getpaddock.com' } }
    Object.defineProperty(globalThis, 'navigator', { value: nav, configurable: true })
    globalThis.document = { referrer }
    globalThis.location = { hostname: 'getpaddock.com' }
  }
  const { resetForTests } = await import('./analytics.js')
  try {
    const link = 'https://app.getpaddock.com/auth?mode=signup&src=tools_fire_number'
    resetForTests(); setEnv({}, 'https://www.google.co.uk/')
    assert.equal(withVisitChannel(link), `${link}&ch=search`)
    assert.equal(withVisitChannel(`${link}&ch=search`), `${link}&ch=search`) // never doubled
    assert.equal(withVisitChannel('https://app.getpaddock.com/auth?mode=signin'), 'https://app.getpaddock.com/auth?mode=signin')
    resetForTests(); setEnv({ globalPrivacyControl: true }, 'https://www.google.co.uk/')
    assert.equal(withVisitChannel(link), link) // opt-out: no measurement signal added to the link
    resetForTests(); setEnv({ doNotTrack: '1' }, '')
    assert.equal(withVisitChannel(link), link)
    resetForTests(); setEnv({}, 'https://example.org/post?secret=1')
    const decorated = new URL(withVisitChannel(link))
    assert.equal(decorated.searchParams.get('ch'), 'other')
    assert.ok(!decorated.toString().includes('secret')) // referrer path/query never reaches the link
    assert.ok(CHANNELS.includes(decorated.searchParams.get('ch')))
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete globalThis[k]; else Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true })
    }
    resetForTests()
  }
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

await test('function never pretends to store an event when the binding is missing', async () => {
  const logged = []
  const original = console.error
  console.error = (...args) => logged.push(args.join(' '))
  try {
    for (const env of [{}, undefined, { PADDOCK_EVENTS: {} }]) {
      const res = await onRequestPost({ request: post(good), env })
      assert.equal(res.status, 503)
      assert.equal((await res.json()).reason, 'storage_unavailable')
    }
  } finally { console.error = original }
  assert.equal(logged.length, 3)
  assert.ok(logged.every((line) => line.includes('PADDOCK_EVENTS')))
})

await test('a missing binding does not turn opt-outs or bad payloads into errors', async () => {
  assert.equal((await onRequestPost({ request: post(good, { 'Sec-GPC': '1' }), env: {} })).status, 204)
  assert.equal((await onRequestPost({ request: post(good, { Origin: 'https://paddock-site.pages.dev' }), env: {} })).status, 204)
  assert.equal((await onRequestPost({ request: post('not json'), env: {} })).status, 400)
})

await test('function reports a failing binding instead of hiding it', async () => {
  const original = console.error
  const logged = []
  console.error = (...args) => logged.push(args.join(' '))
  try {
    const env = { PADDOCK_EVENTS: { writeDataPoint: () => { throw new Error('boom') } } }
    const res = await onRequestPost({ request: post(good), env })
    assert.equal(res.status, 503)
    assert.equal((await res.json()).reason, 'write_failed')
  } finally { console.error = original }
  assert.equal(logged.length, 1)
})

await test('GET /api/e reports whether storage is configured, and nothing else', async () => {
  const missing = await onRequestGet({ env: {} })
  assert.equal(missing.status, 503)
  assert.deepEqual(await missing.json(), { ok: false, storage: 'missing', schema: SCHEMA_VERSION })
  const ok = await onRequestGet({ env: fakeEnv().env })
  assert.equal(ok.status, 200)
  assert.deepEqual(await ok.json(), { ok: true, storage: 'configured', schema: SCHEMA_VERSION })
  assert.equal(ok.headers.get('Cache-Control'), 'no-store')
})

/* ── visitor_landing ────────────────────────────────────────────────────── */
await test('a landing is accepted for any public page and carries only page and channel', () => {
  assert.equal(parseEvent({ event: 'visitor_landing', page: 'landing', channel: 'direct' }).ok, true)
  assert.equal(parseEvent({ event: 'visitor_landing', page: 'tools_hub', channel: 'search' }).ok, true)
  assert.equal(parseEvent({ event: 'visitor_landing', page: 'privacy', channel: 'social' }).ok, true)
  for (const extra of [{ referrer: 'https://google.com/?q=x' }, { url: '/tools?pot=1' }, { country: 'GB' }, { location: 'hero' }]) {
    const r = parseEvent({ event: 'visitor_landing', page: 'landing', channel: 'direct', ...extra })
    assert.equal(r.ok, false)
    assert.match(r.reason, /^unexpected_field:/)
  }
  assert.equal(parseEvent({ event: 'visitor_landing', page: '/pricing', channel: 'direct' }).ok, false)
  assert.equal(parseEvent({ event: 'visitor_landing', page: 'landing' }).ok, false) // channel required
})

await test('a landing is counted once per page load, never for internal moves, never when opted out', async () => {
  const saved = { window: globalThis.window, navigator: globalThis.navigator, document: globalThis.document, location: globalThis.location }
  const beacons = []
  const setEnv = (nav, referrer) => {
    globalThis.window = { location: { hostname: 'getpaddock.com', pathname: '/' } }
    Object.defineProperty(globalThis, 'navigator', {
      value: { sendBeacon: (url, blob) => { beacons.push({ url, blob }); return true }, ...nav }, configurable: true,
    })
    globalThis.document = { referrer }
    globalThis.location = { hostname: 'getpaddock.com' }
  }
  const { resetForTests } = await import('./analytics.js')
  try {
    // From a search engine: counted, and a repeated render does not count it twice.
    beacons.length = 0; resetForTests(); setEnv({}, 'https://www.google.co.uk/')
    assert.equal(trackVisitorLanding('landing'), true)
    assert.equal(trackVisitorLanding('landing'), false)
    assert.equal(beacons.length, 1)
    assert.equal(beacons[0].url, '/api/e')
    assert.deepEqual(JSON.parse(await beacons[0].blob.text()), { event: 'visitor_landing', channel: 'search', page: 'landing' })

    // Direct visit: counted.
    beacons.length = 0; resetForTests(); setEnv({}, '')
    assert.equal(trackVisitorLanding('tools_fire_number'), true)
    assert.equal(JSON.parse(await beacons[0].blob.text()).channel, 'direct')

    // Arrived from another page of this site: not a new visit.
    beacons.length = 0; resetForTests(); setEnv({}, 'https://getpaddock.com/tools')
    assert.equal(trackVisitorLanding('tools_fire_number'), false)
    assert.equal(beacons.length, 0)

    // The marketing site linking from the app counts as internal too.
    beacons.length = 0; resetForTests(); setEnv({}, 'https://app.getpaddock.com/home')
    assert.equal(trackVisitorLanding('landing'), false)

    // Opt-out signals: nothing is sent.
    for (const nav of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) {
      beacons.length = 0; resetForTests(); setEnv(nav, 'https://www.google.com/')
      assert.equal(trackVisitorLanding('landing'), false)
      assert.equal(beacons.length, 0)
    }

    // An unknown page is never sent.
    beacons.length = 0; resetForTests(); setEnv({}, '')
    assert.equal(trackVisitorLanding('not_a_page'), false)
    assert.equal(trackVisitorLanding(null), false)
    assert.equal(beacons.length, 0)
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete globalThis[k]; else Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true })
    }
    resetForTests()
  }
})

await test('the function stores a landing as one aggregate data point', async () => {
  const { written, env } = fakeEnv()
  const res = await onRequestPost({ request: post({ event: 'visitor_landing', page: 'landing', channel: 'direct' }), env })
  assert.equal(res.status, 204)
  assert.equal(written.length, 1)
  assert.deepEqual(written[0].blobs, ['visitor_landing', 'landing', 'direct', '', '', 'none', String(SCHEMA_VERSION)])
  assert.deepEqual(written[0].indexes, ['visitor_landing'])
})

await test('other methods get 405', () => {
  assert.equal(onRequest().status, 405)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
