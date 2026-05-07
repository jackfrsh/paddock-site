import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CANONICAL_ORIGIN, PUBLIC_ROUTES } from '../src/seoRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const distDir = path.resolve(__dirname, '../dist')
export const canonicalOrigin = CANONICAL_ORIGIN.replace(/\/$/, '')
export const errors = []
export const warnings = []

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

export function canonicalUrl(routePath) {
  return `${canonicalOrigin}${routePath === '/' ? '/' : routePath}`
}

export function routePathFromCanonical(url) {
  const parsed = new URL(url, canonicalOrigin)
  return parsed.pathname
}

export function assert(condition, message) {
  if (!condition) errors.push(message)
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  return match?.[1] || null
}

export function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || ''
}

export function extractMetaDescription(html) {
  return html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1]?.replace(/\s+/g, ' ').trim() || ''
}

export function extractH1s(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

export function hasNoindex(html, headers) {
  const xRobots = headers.get('x-robots-tag') || ''
  return (
    /noindex/i.test(xRobots) ||
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
  )
}

export function extractInternalLinks(html) {
  const links = []
  for (const match of html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1]
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      continue
    }

    const parsed = new URL(href, canonicalOrigin)
    if (parsed.origin === canonicalOrigin) {
      links.push(`${parsed.pathname}${parsed.search}${parsed.hash}`)
    }
  }
  return links
}

export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

export function parseRobots(text) {
  return [...text.matchAll(/^\s*Disallow:\s*(\S+)/gim)].map((match) => match[1])
}

export function isBlockedByRobots(routePath, disallows) {
  return disallows.some((rule) => rule !== '' && routePath.startsWith(rule))
}

export async function fetchManual(url, method = 'HEAD') {
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      headers: { 'user-agent': 'paddock-google-indexability-check/1.0' },
    })
  } catch (error) {
    errors.push(`${method} ${url} failed: ${error.message}`)
    return null
  }
}

export async function follow(url, maxRedirects = 5) {
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

function findRedirect(pathname) {
  if (pathname !== '/' && pathname.endsWith('/')) {
    const canonicalPath = pathname.slice(0, -1)
    if (PUBLIC_ROUTES.some((route) => route.path === canonicalPath)) return canonicalPath
  }
  return null
}

function fileForPath(pathname) {
  if (pathname === '/') return path.join(distDir, 'index.html')
  if (pathname === '/sitemap.xml') return path.join(distDir, 'sitemap.xml')
  if (pathname === '/robots.txt') return path.join(distDir, 'robots.txt')
  if (pathname === '/_redirects') return path.join(distDir, '_redirects')

  const route = PUBLIC_ROUTES.find((item) => item.path === pathname)
  if (route) return path.join(distDir, `${pathname.replace(/^\/+/, '')}.html`)

  const assetPath = path.normalize(path.join(distDir, pathname))
  if (assetPath.startsWith(distDir) && fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    return assetPath
  }

  return null
}

export async function withServer(callback) {
  if (process.env.SEO_BASE_URL) {
    return callback(process.env.SEO_BASE_URL.replace(/\/$/, ''), false)
  }

  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run npm run build before SEO checks.')
  }

  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://127.0.0.1')
    const redirectTarget = findRedirect(requestUrl.pathname)
    if (redirectTarget) {
      response.writeHead(301, { location: redirectTarget })
      response.end()
      return
    }

    const filePath = fileForPath(requestUrl.pathname)
    if (!filePath || !fs.existsSync(filePath)) {
      const notFoundPath = path.join(distDir, '404.html')
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
      response.end(fs.existsSync(notFoundPath) ? fs.readFileSync(notFoundPath) : 'Not found')
      return
    }

    const ext = path.extname(filePath)
    response.writeHead(200, { 'content-type': mimeTypes[ext] || 'application/octet-stream' })
    if (request.method === 'HEAD') response.end()
    else response.end(fs.readFileSync(filePath))
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const baseUrl = `http://127.0.0.1:${address.port}`

  try {
    return await callback(baseUrl, true)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}
