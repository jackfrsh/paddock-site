import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGE_META } from '../src/meta.js'
import { CANONICAL_ORIGIN, PUBLIC_ROUTES, PUBLIC_ROUTE_MAP } from '../src/seoRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
const indexPath = path.join(distDir, 'index.html')

const routeMap = PUBLIC_ROUTE_MAP

// Resolve the hashed LCP hero image from the Vite build manifest so we can
// preload it on the homepage (improves Largest Contentful Paint — the image
// otherwise only starts downloading after the JS bundle executes).
function resolveHeroPreloadHref() {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(distDir, '.vite/manifest.json'), 'utf8')
    )
    const key = Object.keys(manifest).find((k) => /slides\/paddock-decisions\.webp$/.test(k))
      || Object.keys(manifest).find((k) => /paddock-decisions\.webp$/.test(k))
    if (key && manifest[key]?.file) return `/${manifest[key].file}`
  } catch {
    /* manifest absent (e.g. partial build) — skip the preload hint. */
  }
  return null
}

const heroPreloadHref = resolveHeroPreloadHref()

function injectHeroPreload(html) {
  if (!heroPreloadHref) return html
  const tag = `  <link rel="preload" as="image" href="${heroPreloadHref}" type="image/webp" fetchpriority="high" />\n</head>`
  return html.replace('</head>', tag)
}

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
      `  <script id="paddock-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`
    )
  }

  return out
}

function canonicalUrl(routePath) {
  return `${CANONICAL_ORIGIN}${routePath === '/' ? '/' : routePath}`
}

function renderSeoFallback(route, meta) {
  const links = Array.from(new Set(['/', ...(route.links || [])]))
    .filter((href) => href !== route.path)
    .map((href) => {
      const linkedRoute = PUBLIC_ROUTES.find((item) => item.path === href)
      const label = linkedRoute?.h1 || (href === '/' ? 'Paddock' : href.replaceAll('-', ' ').replaceAll('/', ' ').trim())
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
    })
    .join('')

  return `<main class="seo-fallback" data-prerendered-route="${escapeHtml(route.path)}">
    <h1>${escapeHtml(route.h1 || meta.title.replace(/\s+\|\s+Paddock.*$/, ''))}</h1>
    <p>${escapeHtml(route.intro || meta.description)}</p>
    <nav aria-label="Related Paddock pages"><ul>${links}</ul></nav>
  </main>`
}

function upsertSeoFallback(html, route, meta) {
  const fallback = renderSeoFallback(route, meta)
  return html.replace(/<div id="root">.*?<\/div>/is, `<div id="root">${fallback}</div>`)
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

const baseHtml = fs.readFileSync(indexPath, 'utf8')

let count = 0

for (const [key, routePath] of Object.entries(routeMap)) {
  const meta = PAGE_META[key]
  if (!meta) continue
  const route = PUBLIC_ROUTES.find((item) => item.key === key)
  if (!route) continue

  let html = upsertSeoFallback(upsertMeta(baseHtml, meta), route, meta)
  // Preload the LCP hero image on the homepage only.
  if (key === 'landing') html = injectHeroPreload(html)

  let targetPath
  if (routePath === '/') {
    targetPath = path.join(distDir, 'index.html')
  } else {
    const clean = routePath.replace(/^\/+/, '')
    targetPath = path.join(distDir, `${clean}.html`)
    ensureDir(path.dirname(targetPath))
  }

  fs.writeFileSync(targetPath, html, 'utf8')
  count += 1
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), renderSitemap(), 'utf8')
fs.writeFileSync(path.join(distDir, '_redirects'), renderRedirects(), 'utf8')

console.log(`prerender: ${count} routes generated`)
console.log('prerender: sitemap.xml and _redirects generated from PUBLIC_ROUTES')
