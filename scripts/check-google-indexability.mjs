import { PUBLIC_ROUTES } from '../src/seoRoutes.js'
import {
  assert,
  canonicalOrigin,
  canonicalUrl,
  errors,
  extractCanonical,
  extractH1s,
  extractMetaDescription,
  extractTitle,
  fetchManual,
  follow,
  hasNoindex,
  isBlockedByRobots,
  parseRobots,
  parseSitemap,
  routePathFromCanonical,
  warnings,
  withServer,
} from './seo-check-lib.mjs'

function localUrlFor(baseUrl, canonical) {
  const parsed = new URL(canonical)
  return `${baseUrl}${parsed.pathname}${parsed.search}`
}

async function assertDirect200(url, label) {
  const result = await follow(url)
  assert(result.status === 200, `${label} expected 200, got ${result.status}`)
  assert(result.chain.length === 1, `${label} must not redirect, got ${result.chain.length - 1} redirect(s)`)
  return result
}

async function checkSitemap(baseUrl) {
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  await assertDirect200(sitemapUrl, 'sitemap.xml')
  const response = await fetchManual(sitemapUrl, 'GET')
  if (!response || response.status !== 200) return []

  const urls = parseSitemap(await response.text())
  const expected = PUBLIC_ROUTES.map((route) => canonicalUrl(route.path))

  assert(urls.length === expected.length, `sitemap expected ${expected.length} URLs, found ${urls.length}`)
  for (const url of expected) assert(urls.includes(url), `sitemap missing ${url}`)
  for (const url of urls) assert(expected.includes(url), `sitemap includes unexpected URL ${url}`)

  for (const url of urls) {
    const sitemapPageUrl = localUrlFor(baseUrl, url)
    await assertDirect200(sitemapPageUrl, `sitemap URL ${url}`)
  }

  return urls
}

async function checkRobots(baseUrl) {
  const robotsUrl = `${baseUrl}/robots.txt`
  await assertDirect200(robotsUrl, 'robots.txt')
  const response = await fetchManual(robotsUrl, 'GET')
  if (!response || response.status !== 200) return []

  const robotsText = await response.text()
  assert(
    robotsText.includes('Sitemap: https://getpaddock.com/sitemap.xml'),
    'robots.txt must reference https://getpaddock.com/sitemap.xml'
  )

  const disallows = parseRobots(robotsText)
  for (const route of PUBLIC_ROUTES) {
    assert(!isBlockedByRobots(route.path, disallows), `${route.path} is blocked by robots.txt`)
  }

  return disallows
}

async function checkPublicPages(baseUrl, sitemapUrls, disallows) {
  const seenTitles = new Map()
  const seenDescriptions = new Map()
  const rows = []

  for (const route of PUBLIC_ROUTES) {
    const canonical = canonicalUrl(route.path)
    const url = localUrlFor(baseUrl, canonical)
    const result = await assertDirect200(url, canonical)
    const response = await fetchManual(url, 'GET')
    if (!response || response.status !== 200) continue

    const html = await response.text()
    const pageCanonical = extractCanonical(html)
    const title = extractTitle(html)
    const description = extractMetaDescription(html)
    const h1s = extractH1s(html)

    assert(pageCanonical === canonical, `${canonical} canonical expected ${canonical}, got ${pageCanonical || 'none'}`)
    assert(!hasNoindex(html, response.headers), `${canonical} must not include noindex`)
    assert(sitemapUrls.includes(canonical), `${canonical} missing from sitemap`)
    assert(!isBlockedByRobots(route.path, disallows), `${canonical} blocked by robots.txt`)
    assert(title, `${canonical} missing title`)
    assert(description, `${canonical} missing meta description`)
    assert(h1s.length === 1, `${canonical} expected exactly one H1, found ${h1s.length}`)

    const duplicateTitle = seenTitles.get(title)
    if (duplicateTitle) errors.push(`duplicate title "${title}" on ${duplicateTitle} and ${canonical}`)
    else seenTitles.set(title, canonical)

    const duplicateDescription = seenDescriptions.get(description)
    if (duplicateDescription) {
      errors.push(`duplicate meta description on ${duplicateDescription} and ${canonical}: "${description}"`)
    } else {
      seenDescriptions.set(description, canonical)
    }

    rows.push({
      url: canonical,
      status: result.status,
      redirects: result.chain.length - 1,
      indexable: !hasNoindex(html, response.headers),
      canonical: pageCanonical,
      title,
      description,
      h1: h1s[0] || '',
    })
  }

  return rows
}

async function checkNonCanonicalVariants(baseUrl, localMode) {
  const slashChecks = PUBLIC_ROUTES.filter((route) => route.path !== '/' && route.priority).map((route) => ({
    from: `${baseUrl}${route.path}/`,
    final: `${baseUrl}${route.path}`,
    label: `${route.path}/`,
  }))

  for (const check of slashChecks) {
    const result = await follow(check.from)
    assert(result.status === 200, `${check.label} expected final 200, got ${result.status}`)
    assert(result.chain.length - 1 === 1, `${check.label} should redirect in one hop, got ${result.chain.length - 1}`)
    assert(result.finalUrl === check.final, `${check.label} expected final ${check.final}, got ${result.finalUrl}`)
  }

  if (localMode) {
    warnings.push('Skipped http/www live domain variant checks in local mode. Set SEO_BASE_URL=https://getpaddock.com after deployment.')
    return
  }

  const checks = [
    { from: canonicalOrigin, final: `${canonicalOrigin}/`, redirects: 0 },
    { from: 'https://www.getpaddock.com', final: `${canonicalOrigin}/`, redirects: 1 },
    { from: 'http://getpaddock.com', final: `${canonicalOrigin}/`, redirects: 1 },
    { from: 'http://www.getpaddock.com', final: `${canonicalOrigin}/`, redirects: 1 },
  ]

  for (const check of checks) {
    const result = await follow(check.from)
    assert(result.status === 200, `${check.from} expected final 200, got ${result.status}`)
    assert(result.chain.length - 1 === check.redirects, `${check.from} expected ${check.redirects} redirect(s), got ${result.chain.length - 1}`)
    assert(result.finalUrl === check.final, `${check.from} expected final ${check.final}, got ${result.finalUrl}`)
  }
}

await withServer(async (baseUrl, localMode) => {
  const sitemapUrls = await checkSitemap(baseUrl)
  const disallows = await checkRobots(baseUrl)
  const rows = await checkPublicPages(baseUrl, sitemapUrls, disallows)
  await checkNonCanonicalVariants(baseUrl, localMode)

  for (const url of sitemapUrls) {
    const pathname = routePathFromCanonical(url)
    assert(PUBLIC_ROUTES.some((route) => route.path === pathname), `sitemap URL has no public route: ${url}`)
  }

  for (const warning of warnings) console.log(`NOTE ${warning}`)

  if (errors.length > 0) {
    console.error(`FAIL ${errors.length} Google indexability issue(s) found:`)
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
  }

  console.log(`PASS checked ${rows.length} public canonical URLs against ${baseUrl}`)
  console.log('PASS sitemap URLs return 200 directly and match PUBLIC_ROUTES')
  console.log('PASS robots.txt allows public marketing pages and references sitemap.xml')
  console.log('PASS canonical tags, titles, descriptions, H1s and noindex checks passed')
  console.log('PASS non-canonical trailing slash variants redirect in one hop')
})
