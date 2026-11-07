/* Browser side of the privacy-first measurement layer.

   What it does: sends a small, allowlisted, anonymous event to our own
   Cloudflare endpoint (functions/api/e.js) so we can count aggregate things
   such as "calculator completed" and "sign-up link clicked", per page.

   What it never does: set or read cookies, use localStorage / sessionStorage /
   IndexedDB, create or send any identifier, fingerprint the browser, or send
   anything the visitor typed. It sends nothing at all when the browser signals
   Global Privacy Control or Do Not Track, and nothing outside production.
   Values are validated against src/analyticsSchema.js before they leave. */

import { pageKeyForPath, parseEvent } from './analyticsSchema.js'

export const ENDPOINT = '/api/e'
const PRODUCTION_HOSTS = ['getpaddock.com']

const SEARCH_HOSTS = [
  'google.', 'bing.com', 'duckduckgo.com', 'ecosia.org', 'yahoo.', 'search.brave.com',
  'qwant.com', 'startpage.com', 'baidu.com', 'yandex.',
]
const SOCIAL_HOSTS = [
  'facebook.com', 'instagram.com', 'linkedin.com', 'reddit.com', 'youtube.com', 't.co',
  'twitter.com', 'x.com', 'threads.net', 'pinterest.', 'bsky.app', 'news.ycombinator.com',
]

/* Class of the referrer, from its host only. The path and query are never read. */
export function classifyReferrer(referrer, ownHost = 'getpaddock.com') {
  if (!referrer) return 'direct'
  let host
  try { host = new URL(referrer).hostname.toLowerCase() } catch { return 'other' }
  if (host === ownHost || host.endsWith(`.${ownHost}`)) return 'internal'
  if (SEARCH_HOSTS.some((h) => host.includes(h))) return 'search'
  if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`) || (h.endsWith('.') && host.includes(h)))) {
    return 'social'
  }
  return 'other'
}

/* True when the browser asks not to be measured. */
export function isOptedOut(nav) {
  if (!nav) return false
  return nav.globalPrivacyControl === true
    || nav.doNotTrack === '1'
    || nav.doNotTrack === 'yes'
    || nav.msDoNotTrack === '1'
}

/* The visit's starting channel, fixed at the first call and kept in memory only. */
let channel = null
function currentChannel() {
  if (channel) return channel
  channel = classifyReferrer(
    typeof document !== 'undefined' ? document.referrer : '',
    typeof location !== 'undefined' ? location.hostname : 'getpaddock.com',
  )
  return channel
}

function enabled() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return false
  return !isOptedOut(navigator)
}

function send(payload) {
  const body = JSON.stringify(payload)
  try {
    if (typeof navigator.sendBeacon === 'function'
      && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return
  } catch { /* fall through to fetch */ }
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      body,
      keepalive: true,
      credentials: 'omit',
      headers: { 'content-type': 'text/plain' },
    }).catch(() => {})
  } catch { /* measurement must never affect the page */ }
}

/* Send one event. Returns true if it was sent. Never throws. */
export function trackEvent(name, fields = {}) {
  try {
    if (!enabled()) return false
    const parsed = parseEvent({ event: name, channel: currentChannel(), ...fields })
    if (!parsed.ok) return false
    send(parsed.event)
    return true
  } catch {
    return false
  }
}

/* Send an event at most once per key for the life of this page view. The
   memory is a plain in-page Set, so a reload starts again and nothing persists. */
const seen = new Set()
export function trackOnce(key, name, fields) {
  if (seen.has(key)) return false
  seen.add(key)
  return trackEvent(name, fields)
}

/* Adds how this visit began (`ch`) to a sign-up link, at click time only.

   It is added when the link is used, not when the page is built, so the
   prerendered HTML is the same for everyone. Nothing is added when the browser
   signals Global Privacy Control or Do Not Track, outside production, or for any
   link that is not the app's sign-up page. The value comes from the same closed
   list as the events (search, direct, internal, social, other). */
export function withVisitChannel(url) {
  try {
    if (typeof url !== 'string' || !enabled()) return url
    const parsed = new URL(url)
    if (parsed.searchParams.get('mode') !== 'signup' || parsed.searchParams.has('ch')) return url
    parsed.searchParams.set('ch', currentChannel())
    return parsed.toString()
  } catch {
    return url
  }
}

/* The route key of the page the visitor is on, or null. */
export function currentPageKey() {
  if (typeof window === 'undefined') return null
  return pageKeyForPath(window.location.pathname)
}

/* A calculator was touched / produced a result. Each fires once per page view. */
export function trackCalculatorStarted(page = currentPageKey()) {
  if (!page) return false
  return trackOnce(`calculator_started:${page}`, 'calculator_started', { page })
}
export function trackCalculatorCompleted(page = currentPageKey()) {
  if (!page) return false
  return trackOnce(`calculator_completed:${page}`, 'calculator_completed', { page })
}

/* A call to action was shown (once per placement) or clicked (every time). */
export function trackCtaDisplayed({ page = currentPageKey(), location, target, variant = 'none' }) {
  if (!page) return false
  return trackOnce(`cta_displayed:${page}:${location}:${target}`, 'cta_displayed', { page, location, target, variant })
}
export function trackCtaClicked({ page = currentPageKey(), location, target, variant = 'none' }) {
  if (!page) return false
  return trackEvent('cta_clicked', { page, location, target, variant })
}

/* For tests. */
export function resetForTests() {
  seen.clear()
  channel = null
}
