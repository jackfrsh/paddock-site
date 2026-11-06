import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { PAGE_META } from '../src/meta.js'
import { CANONICAL_ORIGIN, LEGACY_REDIRECTS, PUBLIC_ROUTES, PUBLIC_ROUTE_MAP } from '../src/seoRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
const indexPath = path.join(distDir, 'index.html')
const serverEntryPath = path.resolve(__dirname, '../dist-ssr/entry-server.js')

const routeMap = PUBLIC_ROUTE_MAP

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function upsertMeta(html, { title, description, canonical, ogType, jsonLd }) {
  let out = html

  out = out.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)

  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  )

  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  )

  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  )

  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  )

  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`
  )

  out = out.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(ogType || 'website')}" />`
  )

  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  )

  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  )

  out = out.replace(
    /<script[^>]*id="paddock-jsonld"[^>]*>.*?<\/script>/is,
    ''
  )

  if (jsonLd) {
    out = out.replace(
      '</head>',
      () => `  <script id="paddock-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`
    )
  }

  return out
}

function canonicalUrl(routePath) {
  return `${CANONICAL_ORIGIN}${routePath === '/' ? '/' : routePath}`
}

// A built page must carry its real content. If a route renders thin (a loading
// placeholder, an empty shell), fail the build instead of deploying a page that
// crawlers would see as empty.
const MIN_PRERENDERED_WORDS = 100

function visibleWordCount(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function assertRenderedPage(route, appHtml) {
  const h1Count = (appHtml.match(/<h1[\s>]/gi) || []).length
  if (h1Count !== 1) {
    throw new Error(`prerender: ${route.path} rendered ${h1Count} <h1> elements, expected exactly 1`)
  }
  const words = visibleWordCount(appHtml)
  if (words < MIN_PRERENDERED_WORDS) {
    throw new Error(`prerender: ${route.path} rendered only ${words} words, expected at least ${MIN_PRERENDERED_WORDS}`)
  }
  return words
}

function upsertRenderedApp(html, appHtml) {
  return html.replace(/<div id="root">[\s\S]*?<\/div>/i, () => `<div id="root">${appHtml}</div>`)
}

// Head tags a page component adds through <Helmet> (the FAQ JSON-LD on two
// calculator pages). Everything else in the head comes from PAGE_META.
function upsertHelmetTags(html, helmet) {
  const tags = helmet?.script?.toString?.() || ''
  if (!tags) return html
  return html.replace('</head>', () => `  ${tags}\n</head>`)
}

function renderSitemap() {
  const urls = PUBLIC_ROUTES.map(
    (route) => `  <url>
    <loc>${canonicalUrl(route.path)}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
  ).join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function renderRedirects() {
  const nonRootRoutes = PUBLIC_ROUTES.filter((route) => route.path !== '/')

  const slashRedirects = nonRootRoutes
    .map((route) => `${route.path}/ ${route.path} 301`)
    .join('\n')

  const htmlRedirects = nonRootRoutes
    .map((route) => `${route.path}.html ${route.path} 301`)
    .join('\n')

  const legacyRedirects = LEGACY_REDIRECTS
    .map(({ from, to }) => `${from} ${to} 301\n${from}/ ${to} 301`)
    .join('\n')

  return `# Cloudflare Pages redirects for the public marketing site.
# Canonical domain policy: HTTPS, apex domain, no trailing slash for pages.
# Note: Cloudflare Pages _redirects does not support domain-level redirects.
# Configure HTTP -> HTTPS and www -> apex in Cloudflare DNS/Bulk Redirects.

# Retired trailing-slash variants. Canonical internal URLs and sitemap entries
# point directly to the slashless paths below.
${slashRedirects}

# Redirect .html file paths to canonical pretty URLs (Cloudflare Pages serves
# both /foo and /foo.html for the same file; the .html variant must redirect
# or Google flags them as duplicates without a user-selected canonical).
${htmlRedirects}

# Legacy URLs that were never pages on this site but are known to Google.
${legacyRedirects}

# Unknown routes should not be canonicalized to the homepage.
/* /404.html 404
`
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

if (!fs.existsSync(indexPath)) {
  console.error('prerender: dist/index.html not found')
  process.exit(1)
}

if (!fs.existsSync(serverEntryPath)) {
  console.error('prerender: dist-ssr/entry-server.js not found (run the SSR build first)')
  process.exit(1)
}

const { render } = await import(pathToFileURL(serverEntryPath).href)

const baseHtml = fs.readFileSync(indexPath, 'utf8')

let count = 0

for (const [key, routePath] of Object.entries(routeMap)) {
  const meta = PAGE_META[key]
  if (!meta) continue
  const route = PUBLIC_ROUTES.find((item) => item.key === key)
  if (!route) continue

  const { html: appHtml, helmet } = await render(routePath)
  const words = assertRenderedPage(route, appHtml)

  const html = upsertHelmetTags(upsertRenderedApp(upsertMeta(baseHtml, meta), appHtml), helmet)

  let targetPath
  if (routePath === '/') {
    targetPath = path.join(distDir, 'index.html')
  } else {
    const clean = routePath.replace(/^\/+/, '')
    targetPath = path.join(distDir, `${clean}.html`)
    ensureDir(path.dirname(targetPath))
  }

  fs.writeFileSync(targetPath, html, 'utf8')
  console.log(`prerender: ${routePath} (${words} words)`)
  count += 1
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), renderSitemap(), 'utf8')
fs.writeFileSync(path.join(distDir, '_redirects'), renderRedirects(), 'utf8')

console.log(`prerender: ${count} routes generated`)
console.log('prerender: sitemap.xml and _redirects generated from PUBLIC_ROUTES')
