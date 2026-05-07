import { PUBLIC_ROUTES } from '../src/seoRoutes.js'
import {
  assert,
  canonicalUrl,
  errors,
  extractInternalLinks,
  fetchManual,
  follow,
  parseSitemap,
  warnings,
  withServer,
} from './seo-check-lib.mjs'

const publicPaths = new Set(PUBLIC_ROUTES.map((route) => route.path))
const importantPaths = new Set(PUBLIC_ROUTES.filter((route) => route.priority).map((route) => route.path))

function localUrlFor(baseUrl, routePath) {
  return `${baseUrl}${routePath === '/' ? '/' : routePath}`
}

function normalizeInternalPath(href) {
  const parsed = new URL(href, 'https://getpaddock.com')
  let pathname = parsed.pathname
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1)
  return pathname
}

async function getHtml(baseUrl, routePath) {
  const response = await fetchManual(localUrlFor(baseUrl, routePath), 'GET')
  if (!response || response.status !== 200) {
    errors.push(`${routePath} expected 200 while crawling internal links, got ${response?.status || 0}`)
    return ''
  }
  return response.text()
}

async function checkLinkedUrl(baseUrl, sourcePath, href) {
  const parsed = new URL(href, 'https://getpaddock.com')
  const normalizedPath = normalizeInternalPath(href)

  if (!publicPaths.has(normalizedPath) && !['/sitemap.xml', '/robots.txt'].includes(normalizedPath)) {
    errors.push(`${sourcePath} links to non-public or missing internal URL ${parsed.pathname}`)
    return normalizedPath
  }

  if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
    errors.push(`${sourcePath} links to trailing-slash internal URL ${parsed.pathname}`)
  }

  const result = await follow(`${baseUrl}${parsed.pathname}${parsed.search}`)
  if (result.status >= 300 && result.status < 400) {
    errors.push(`${sourcePath} links to redirected URL ${parsed.pathname}`)
  }
  if (result.chain.length > 1) {
    errors.push(`${sourcePath} links to ${parsed.pathname}, which redirects ${result.chain.length - 1} time(s)`)
  }
  if (result.status >= 400 || result.status === 0) {
    errors.push(`${sourcePath} links to ${parsed.pathname}, which returns ${result.status}`)
  }

  return normalizedPath
}

await withServer(async (baseUrl) => {
  const sitemapResponse = await fetchManual(`${baseUrl}/sitemap.xml`, 'GET')
  if (!sitemapResponse || sitemapResponse.status !== 200) {
    errors.push('sitemap.xml could not be fetched for internal-link crawl')
  } else {
    const sitemapUrls = parseSitemap(await sitemapResponse.text())
    for (const route of PUBLIC_ROUTES) {
      assert(sitemapUrls.includes(canonicalUrl(route.path)), `${route.path} missing from sitemap`)
    }
  }

  const inbound = new Map(PUBLIC_ROUTES.map((route) => [route.path, new Set()]))
  const outbound = new Map()

  for (const route of PUBLIC_ROUTES) {
    const html = await getHtml(baseUrl, route.path)
    const links = Array.from(new Set(extractInternalLinks(html)))
    outbound.set(route.path, links)

    for (const href of links) {
      const normalizedPath = await checkLinkedUrl(baseUrl, route.path, href)
      if (inbound.has(normalizedPath) && normalizedPath !== route.path) {
        inbound.get(normalizedPath).add(route.path)
      }
    }
  }

  for (const route of PUBLIC_ROUTES) {
    const incoming = inbound.get(route.path)?.size || 0
    if (route.path !== '/' && incoming === 0) {
      errors.push(`${route.path} is orphaned: no crawled internal inbound links`)
    }
    if (importantPaths.has(route.path) && route.path !== '/' && incoming < 2) {
      errors.push(`${route.path} has fewer than two internal inbound links (${incoming})`)
    }
  }

  for (const warning of warnings) console.log(`NOTE ${warning}`)

  if (errors.length > 0) {
    console.error(`FAIL ${errors.length} internal link issue(s) found:`)
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
  }

  const linkCount = [...outbound.values()].reduce((total, links) => total + links.length, 0)
  console.log(`PASS crawled ${PUBLIC_ROUTES.length} public pages and ${linkCount} unique internal links`)
  console.log('PASS internal links point directly to canonical non-redirecting URLs')
  console.log('PASS no indexable public page is orphaned')
  console.log('PASS priority pages have at least two internal inbound links')
})
