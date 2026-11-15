import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

/* Guards public/_headers (claims-register finding F6). A header file is easy to
   weaken by accident and hard to notice from the page, so the important parts
   are pinned here. */

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const here = fileURLToPath(new URL('.', import.meta.url))
const raw = readFileSync(join(here, '..', 'public', '_headers'), 'utf8')

/* Parse the Cloudflare Pages format: an unindented line starts a rule, the
   indented "Name: value" lines under it are its headers. */
function parse(text) {
  const rules = []
  let current = null
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: {} }
      rules.push(current)
    } else if (current) {
      const i = line.indexOf(':')
      current.headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim()
    }
  }
  return rules
}
const rules = parse(raw)
const all = rules.find((r) => r.pattern === '/*')

console.log('▶ src/securityHeaders.test.js')

test('there is a rule for every host and path', () => {
  assert.ok(all, 'no /* rule in public/_headers')
})

test('the baseline hardening headers are present', () => {
  const h = all.headers
  assert.match(h['strict-transport-security'], /max-age=\d{7,}/)
  assert.equal(h['x-content-type-options'], 'nosniff')
  assert.equal(h['x-frame-options'], 'DENY')
  assert.ok(h['referrer-policy'])
  assert.match(h['permissions-policy'], /camera=\(\)/)
  assert.match(h['permissions-policy'], /microphone=\(\)/)
  assert.match(h['permissions-policy'], /geolocation=\(\)/)
})

test('HSTS does not cover subdomains or ask for preloading', () => {
  const v = all.headers['strict-transport-security']
  assert.ok(!/includeSubDomains/i.test(v), 'includeSubDomains would reach app.getpaddock.com and any other subdomain')
  assert.ok(!/preload/i.test(v), 'preload is very hard to undo')
})

function directives(csp) {
  return Object.fromEntries(csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
    const [name, ...values] = d.split(/\s+/)
    return [name, values]
  }))
}
const csp = directives(all.headers['content-security-policy'] ?? '')

test('the content security policy starts closed and blocks framing, plugins and base changes', () => {
  assert.deepEqual(csp['default-src'], ["'self'"])
  assert.deepEqual(csp['object-src'], ["'none'"])
  assert.deepEqual(csp['frame-ancestors'], ["'none'"])
  assert.deepEqual(csp['base-uri'], ["'self'"])
})

test('scripts cannot run inline or through eval', () => {
  const s = csp['script-src']
  assert.ok(s.includes("'self'"))
  assert.ok(!s.includes("'unsafe-inline'"), "script-src must not allow 'unsafe-inline'")
  assert.ok(!s.includes("'unsafe-eval'"), "script-src must not allow 'unsafe-eval'")
  assert.ok(!s.includes('*') && !s.includes('https:') && !s.includes('data:'), 'script-src must name hosts, not wildcards')
})

test('Cloudflare Web Analytics can load and report when it is switched on', () => {
  assert.ok(csp['script-src'].includes('https://static.cloudflareinsights.com'))
  assert.ok(csp['connect-src'].includes('https://cloudflareinsights.com'))
  assert.ok(csp['connect-src'].includes("'self'"), 'the first-party event endpoint needs connect-src self')
})

test('no analytics or ad hosts are allowed beyond Cloudflare', () => {
  const hosts = Object.values(csp).flat().filter((v) => v.startsWith('http'))
  assert.deepEqual(hosts.sort(), ['https://cloudflareinsights.com', 'https://static.cloudflareinsights.com'])
})

test('the pages.dev mirrors are still noindex and the custom domain is not', () => {
  const noindex = rules.filter((r) => r.headers['x-robots-tag'] === 'noindex').map((r) => r.pattern)
  assert.ok(noindex.includes('https://paddock-site.pages.dev/*'))
  assert.ok(noindex.includes('https://:version.paddock-site.pages.dev/*'))
  assert.ok(!all.headers['x-robots-tag'], 'the /* rule must not set X-Robots-Tag')
  assert.ok(!noindex.some((p) => p.includes('getpaddock.com')), 'getpaddock.com must never be noindex')
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
