/* The measurement contract for getpaddock.com, shared by the browser and the
   Cloudflare Pages Function so both enforce exactly the same rules.

   Principles (see docs/acquisition-reporting.md):
   - An event is a name plus a handful of fields that each come from a closed
     list defined below. There is no free-text field anywhere, so there is no
     way to send what a visitor typed, a balance, an age, a URL or an identifier.
   - Unknown fields reject the whole event rather than being dropped quietly,
     so a careless future change fails loudly in tests instead of leaking data.
   - Nothing here identifies a visitor. There is no ID, cookie or storage. */

import { PUBLIC_ROUTES } from './seoRoutes.js'

export const SCHEMA_VERSION = 1

const KEY_BY_PATH = new Map(PUBLIC_ROUTES.map((route) => [route.path, route.key]))

/* The route key for a public path, ignoring a trailing slash, or null. */
export function pageKeyForPath(path) {
  if (typeof path !== 'string') return null
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return KEY_BY_PATH.get(clean) ?? null
}

/* Route keys from the public route table, e.g. "tools_fire_number". */
export const PAGES = Object.freeze(PUBLIC_ROUTES.map((route) => route.key))

/* The calculator pages: every tools_* route except the hub. */
export const CALCULATOR_PAGES = Object.freeze(PAGES.filter((key) => key.startsWith('tools_') && key !== 'tools_hub'))

/* How the visit began, worked out from the referrer's host only. */
export const CHANNELS = Object.freeze(['search', 'direct', 'internal', 'social', 'other'])

/* Where on the page a call to action sits. */
export const LOCATIONS = Object.freeze([
  'header', 'hero', 'result', 'mid', 'bottom', 'pricing', 'footer', 'inline', 'other',
])

/* What the call to action leads to. */
export const TARGETS = Object.freeze(['signup', 'signin', 'pro_page', 'app_store'])

/* Wording variant. "none" until a wording test is switched on (src/ctaCopy.js). */
export const VARIANTS = Object.freeze(['none', 'a', 'b'])

const ENUMS = { page: PAGES, channel: CHANNELS, location: LOCATIONS, target: TARGETS, variant: VARIANTS }

/* For each event: the fields it requires. Anything else is rejected. */
export const EVENTS = Object.freeze({
  /* A visitor changed a field in a calculator. Fires once per page view. */
  calculator_started: { required: ['page', 'channel'], optional: [], calculatorOnly: true },
  /* A calculator produced a result. Fires once per page view. */
  calculator_completed: { required: ['page', 'channel'], optional: [], calculatorOnly: true },
  /* A call to action scrolled into view. Fires once per placement per page view. */
  cta_displayed: { required: ['page', 'channel', 'location', 'target'], optional: ['variant'] },
  /* A call to action was clicked. */
  cta_clicked: { required: ['page', 'channel', 'location', 'target'], optional: ['variant'] },
})

export const EVENT_NAMES = Object.freeze(Object.keys(EVENTS))

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/* Validate an untrusted payload. Returns { ok: true, event } with every value
   taken from the closed lists, or { ok: false, reason }. */
export function parseEvent(input) {
  if (!isPlainObject(input)) return { ok: false, reason: 'not_an_object' }

  const { event: name, ...fields } = input
  if (typeof name !== 'string' || !Object.hasOwn(EVENTS, name)) {
    return { ok: false, reason: 'unknown_event' }
  }
  const spec = EVENTS[name]
  const allowed = new Set([...spec.required, ...spec.optional])

  for (const key of Object.keys(fields)) {
    if (!allowed.has(key)) return { ok: false, reason: `unexpected_field:${key}` }
  }
  for (const key of spec.required) {
    if (!Object.hasOwn(fields, key)) return { ok: false, reason: `missing_field:${key}` }
  }
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || !ENUMS[key].includes(value)) {
      return { ok: false, reason: `invalid_value:${key}` }
    }
  }
  if (spec.calculatorOnly && !CALCULATOR_PAGES.includes(fields.page)) {
    return { ok: false, reason: 'not_a_calculator_page' }
  }

  return { ok: true, event: { event: name, variant: 'none', ...fields } }
}

/* Cloudflare Workers Analytics Engine data point. Column order is part of the
   contract: scripts/acquisition-report.mjs reads blob1..blob7 by position. */
export const BLOB_COLUMNS = Object.freeze([
  'event', 'page', 'channel', 'location', 'target', 'variant', 'schema_version',
])

export function toDataPoint(event) {
  return {
    indexes: [event.event],
    blobs: [
      event.event,
      event.page,
      event.channel,
      event.location ?? '',
      event.target ?? '',
      event.variant ?? 'none',
      String(SCHEMA_VERSION),
    ],
    doubles: [1],
  }
}
