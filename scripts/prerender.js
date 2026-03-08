import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGE_META } from '../src/meta.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
const indexPath = path.join(distDir, 'index.html')

const routeMap = {
  landing: '/',
  guides_index: '/guides',
  guide_multi_currency: '/guides/multi-currency-net-worth-tracker',
  guide_long_term_projection: '/guides/long-term-wealth-projection',
  guide_inflation_adjusted: '/guides/inflation-adjusted-net-worth',
  privacy: '/privacy',
  security: '/security',
  terms: '/terms',
  net_worth_tracker: '/net-worth-tracker',
  track_isas_pensions_savings: '/track-isas-pensions-savings',
  spreadsheet_alternative: '/spreadsheet-alternative-net-worth-tracking',
  how_to_track_net_worth: '/how-to-track-your-net-worth',
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

  const html = upsertMeta(baseHtml, meta)

  let targetPath
  if (routePath === '/') {
    targetPath = path.join(distDir, 'index.html')
  } else {
    const clean = routePath.replace(/^\/+/, '')
    const dir = path.join(distDir, clean)
    ensureDir(dir)
    targetPath = path.join(dir, 'index.html')
  }

  fs.writeFileSync(targetPath, html, 'utf8')
  count += 1
}

console.log(`prerender: ${count} routes generated`)