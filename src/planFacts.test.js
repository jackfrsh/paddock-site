import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ANNUAL_MONTHS_FREE, ANNUAL_SAVING, FREE_FEATURES, FREE_LIMITS, PRO_FEATURES, PRO_PRICE, TRIAL,
  planSummary, priceLine, trialLine,
} from './planFacts.js'
import { SIGNIN_URL, SIGNUP_BASE_URL, authUrl, signupUrl } from './links.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

/* Golden values. If the app changes, these change deliberately, with the app. */
test('plan facts match the app', () => {
  assert.equal(FREE_LIMITS.accounts, 5)
  assert.equal(PRO_PRICE.monthly, 6)
  assert.equal(PRO_PRICE.annual, 60)
  assert.equal(TRIAL.annualDays, 30)
  assert.equal(TRIAL.monthlyDays, 0)
})

test('annual saving is two months of the monthly price', () => {
  assert.equal(ANNUAL_SAVING, 12)
  assert.equal(ANNUAL_MONTHS_FREE, 2)
})

test('copy helpers are built from the facts', () => {
  assert.equal(priceLine(), '£6 a month or £60 a year')
  assert.match(trialLine(), /30-day trial/)
  assert.match(trialLine(), /monthly has no trial/)
  assert.match(planSummary(), /up to 5 accounts/)
  assert.ok(FREE_FEATURES.includes('Up to 5 accounts'))
  assert.ok(PRO_FEATURES.includes('Unlimited accounts'))
})

test('pension tools the app lists as coming soon are not promoted as Pro features', () => {
  for (const f of PRO_FEATURES) assert.doesNotMatch(f, /pension bridge|pensions tools/i)
})

test('sign-up links carry a safe source label and nothing else', () => {
  assert.equal(signupUrl('tools_fire_number'), `${SIGNUP_BASE_URL}&src=tools_fire_number`)
  assert.equal(signupUrl(undefined), SIGNUP_BASE_URL)
  assert.equal(signupUrl('Has Spaces&x=1'), SIGNUP_BASE_URL)
  assert.equal(signupUrl('a'.repeat(41)), SIGNUP_BASE_URL)
  assert.equal(authUrl('signin', 'landing'), SIGNIN_URL)
  assert.equal(authUrl('signup', 'landing'), `${SIGNUP_BASE_URL}&src=landing`)
})

/* Guard against the old, wrong claims coming back into public copy. */
const root = fileURLToPath(new URL('..', import.meta.url))
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walk(p)
    return /\.(jsx?|md)$/.test(p) ? [p] : []
  })
}
test('public copy does not contain retired plan claims', () => {
  const banned = [
    [/up to 3 accounts/i, 'free plan is 5 accounts'],
    [/7-day (free )?trial/i, 'the annual trial is 30 days'],
    [/includes a 7-day/i, 'the annual trial is 30 days'],
  ]
  const hits = []
  for (const file of walk(join(root, 'src'))) {
    if (file.endsWith('.test.js')) continue
    const text = readFileSync(file, 'utf8')
    for (const [re, why] of banned) if (re.test(text)) hits.push(`${file.replace(root, '')}: ${why}`)
  }
  assert.deepEqual(hits, [])
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
