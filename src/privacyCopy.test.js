import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MEASUREMENT_STATUS } from './measurementStatus.js'
import { BACKUP_RETENTION_DAYS, accountDeletionCopy, websiteMeasurementCopy } from './privacyCopy.js'

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
  for (const phrase of ['Cloudflare Web Analytics', 'anonymous events', 'a visit began on a page', 'Global Privacy Control', 'page you first arrived from', 'up to 24 hours', 'deleted with it']) {
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
  for (const processor of ['Supabase', 'Google Cloud', 'Stripe', 'Apple', 'Google']) assert.ok(page.includes(processor), processor)
})

test('trust pages agree with the live setup: Stripe on the web, Apple on iOS, Google Fonts disclosed, no unsupported timing claim', () => {
  const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8')
  const security = read('./pages/Security.jsx')
  const terms = read('./pages/Terms.jsx')
  assert.match(security, /Stripe and Apple/)
  assert.doesNotMatch(security, /All billing and subscription management is processed by Stripe/)
  assert.match(terms, /Stripe on the web and by Apple/)
  assert.match(read('./pages/Privacy.jsx'), /Google Fonts/)
  // "Setup in under 2 minutes" was removed on 2026-11-07: no evidence. Reinstate only with timed evidence.
  for (const f of ['./tools/IsaGrowthCalculator.jsx', './tools/NetWorthCalculator.jsx', './tools/FireNumberCalculator.jsx', './tools/PensionDrawdownCalculator.jsx', './pages/ToolsHub.jsx']) {
    assert.doesNotMatch(read(f), /under 2 minutes/i, f)
  }
})

const deletionText = () => accountDeletionCopy()
  .flatMap((b) => (b.type === 'ul' ? b.items.map((i) => i.strong + i.text) : [b.text])).join('\n')

test('account deletion wording says how to delete, and what happens to a subscription', () => {
  const t = deletionText()
  assert.match(t, /Settings/)
  assert.match(t, /Delete account/)
  assert.match(t, /type DELETE/)
  assert.match(t, /card, your subscription is cancelled for you/)
  assert.match(t, /no refund for the current period/)
  assert.match(t, /App Store/)
  assert.match(t, /cancel it in your Apple ID settings first/)
  assert.match(t, /cannot be undone/)
})

test('account deletion wording is honest about what is kept: Stripe and Apple records, backups, anonymous counts', () => {
  const t = deletionText()
  assert.match(t, /Stripe keeps its own records/)
  assert.match(t, /Apple keeps its own records/)
  assert.match(t, /not edited when you delete your account/)
  assert.match(t, /Anonymous counts/)
  // No claim that every copy disappears at once.
  assert.doesNotMatch(t, /all (copies|traces|data) (is|are) (removed|deleted|erased)/i)
  assert.doesNotMatch(t, /immediately (removed|erased)/i)
})

test('the stated backup retention is a real whole number of days and appears in the wording', () => {
  assert.ok(Number.isInteger(BACKUP_RETENTION_DAYS) && BACKUP_RETENTION_DAYS > 0)
  assert.ok(deletionText().includes(`kept for ${BACKUP_RETENTION_DAYS} days`))
})

test('the Privacy page shows the account deletion section before the website section', () => {
  const page = readFileSync(new URL('./pages/Privacy.jsx', import.meta.url), 'utf8')
  assert.ok(page.includes('accountDeletionCopy'))
  const del = page.indexOf('<H2>Deleting your account</H2>')
  const web = page.indexOf('<H2>This website</H2>')
  assert.ok(del > -1 && web > -1 && del < web)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
