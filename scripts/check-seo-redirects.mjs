import { CANONICAL_ORIGIN, PUBLIC_ROUTES } from '../src/seoRoutes.js'

const baseUrl = (process.env.SEO_BASE_URL || CANONICAL_ORIGIN).replace(/\/$/, '')
const canonicalOrigin = (process.env.SEO_CANONICAL_ORIGIN || CANONICAL_ORIGIN).replace(/\/$/, '')
const isCanonicalHost = baseUrl === canonicalOrigin
const checkCanonicalTargets = process.env.CHECK_CANONICAL_TARGETS !== '0' && isCanonicalHost
const maxRedirects = 5

const errors = []
const notes = []

function canonicalUrl(path) {
  return `${canonicalOrigin}${path === '/' ? '/' : path}`
}

function urlFor(pathOrCanonicalUrl) {
  const url = new URL(pathOrCanonicalUrl, canonicalOrigin)
  return `${baseUrl}${url.pathname}${url.search}`
}

async function fetchManual(url, method = 'HEAD') {
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      headers: { 'user-agent': 'paddock-seo-redirect-check/1.0' },
    })
  } catch (error) {
    errors.push(`${method} ${url} failed: ${error.message}`)
    return null
  }
}

async function follow(url) {
  const chain = []
  let current = url

  for (let i = 0; i <= maxRedirects; i += 1) {
    const response = await fetchManual(current)
    if (!response) return { chain, finalUrl: current, status: 0 }

    chain.push({ url: current, status: response.status })

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { chain, finalUrl: current, status: response.status }
    }

    const location = response.headers.get('location')
    if (!location) {
      errors.push(`${current} returned ${response.status} without a Location header`)
      return { chain, finalUrl: current, status: response.status }
    }

    current = new URL(location, current).toString()
  }

  errors.push(`${url} exceeded ${maxRedirects} redirects`)
  return { chain, finalUrl: current, status: 0 }
}

function assert(condition, message) {
  if (!condition) errors.push(message)
}

async function assertDirect200(url, label) {
  const result = await follow(url)
  assert(result.status === 200, `${label} expected 200, got ${result.status}`)
  assert(result.chain.length === 1, `${label} should not redirect, got ${result.chain.length - 1} redirects`)
  return result
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  return match?.[1] || null
}

function hasNoindex(html, headers) {
  const xRobots = headers.get('x-robots-tag') || ''
  return (
    /noindex/i.test(xRobots) ||
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
  )
}

async function checkDomainVariants() {
  if (!isCanonicalHost) {
    notes.push('Skipped live domain variant checks because SEO_BASE_URL is not the canonical origin.')
    return
  }

  const checks = [
    { from: `${canonicalOrigin}/`, final: `${canonicalOrigin}/`, redirects: 0 },
    { from: 'https://www.getpaddock.com/', final: `${canonicalOrigin}/`, redirects: 1 },
    { from: 'http://getpaddock.com/', final: `${canonicalOrigin}/`, redirects: 1 },
    { from: 'http://www.getpaddock.com/', final: `${canonicalOrigin}/`, redirects: 1 },
  ]

  for (const check of checks) {
    const result = await follow(check.from)
    assert(result.status === 200, `${check.from} expected final 200, got ${result.status}`)
    assert(result.chain.length - 1 === check.redirects, `${check.from} expected ${check.redirects} redirect(s), got ${result.chain.length - 1}`)
    assert(result.finalUrl === check.final, `${check.from} expected final ${check.final}, got ${result.finalUrl}`)
  }
}

async function checkSitemap() {
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  await assertDirect200(sitemapUrl, 'sitemap.xml')

  const response = await fetchManual(sitemapUrl, 'GET')
  if (!response || response.status !== 200) return []

  const xml = await response.text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  const expected = PUBLIC_ROUTES.map((route) => canonicalUrl(route.path))

  assert(urls.length === expected.length, `sitemap expected ${expected.length} URLs, found ${urls.length}`)
  for (const url of expected) assert(urls.includes(url), `sitemap missing ${url}`)
  for (const url of urls) assert(expected.includes(url), `sitemap includes unexpected URL ${url}`)

  return urls
}

async function checkPublicPages(sitemapUrls) {
  for (const route of PUBLIC_ROUTES) {
    const expectedCanonical = canonicalUrl(route.path)
    const localUrl = urlFor(expectedCanonical)

    await assertDirect200(localUrl, expectedCanonical)

    const response = await fetchManual(localUrl, 'GET')
    if (!response || response.status !== 200) continue

    const html = await response.text()
    const canonical = extractCanonical(html)
    assert(canonical === expectedCanonical, `${localUrl} canonical expected ${expectedCanonical}, got ${canonical || 'none'}`)
    assert(!hasNoindex(html, response.headers), `${localUrl} must not be noindex`)

    if (checkCanonicalTargets) await assertDirect200(canonical, `canonical target ${canonical}`)
  }

  for (const sitemapUrl of sitemapUrls) {
    await assertDirect200(urlFor(sitemapUrl), `sitemap URL ${sitemapUrl}`)
  }
}

await checkDomainVariants()
const sitemapUrls = await checkSitemap()
await checkPublicPages(sitemapUrls)

for (const note of notes) console.log(`NOTE ${note}`)

if (errors.length > 0) {
  console.error(`FAIL ${errors.length} SEO redirect issue(s) found:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`PASS checked ${PUBLIC_ROUTES.length} public URLs against ${baseUrl}`)
console.log('PASS sitemap URLs are canonical and non-redirecting')
console.log('PASS canonical tags point to final canonical URLs')
if (isCanonicalHost) console.log('PASS canonical host variant policy checked')
