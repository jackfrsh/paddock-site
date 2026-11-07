/* Cloudflare Pages Function: POST /api/e

   Receives the anonymous measurement events described in
   src/analyticsSchema.js and writes one aggregate data point per event to a
   Workers Analytics Engine dataset (binding name PADDOCK_EVENTS).

   Privacy properties, enforced here as well as in the browser:
   - Honours Global Privacy Control and Do Not Track: the event is discarded.
   - Only the closed-list fields in the schema are accepted; anything else is
     rejected, so free text, values and identifiers cannot be stored.
   - The visitor's IP address, user agent, cookies and full URL are never read
     into the data point. Only the validated fields are written.
   - Before the binding exists the function does nothing and answers 204, so
     the site is unaffected until the owner turns measurement on. */

import { parseEvent, toDataPoint } from '../../src/analyticsSchema.js'

const MAX_BODY_BYTES = 512
const ALLOWED_ORIGINS = ['https://getpaddock.com']

const noContent = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
const reject = (status, reason) =>
  new Response(JSON.stringify({ ok: false, reason }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export async function onRequestPost({ request, env }) {
  const headers = request.headers

  // Honour the visitor's signal. Not an error: there is simply nothing to record.
  if (headers.get('Sec-GPC') === '1' || headers.get('DNT') === '1') return noContent()

  // Only the production site records events (previews and local runs do not).
  const origin = headers.get('Origin')
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return noContent()

  const declared = Number(headers.get('Content-Length') || 0)
  if (declared > MAX_BODY_BYTES) return reject(413, 'too_large')
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return reject(413, 'too_large')

  let payload
  try { payload = JSON.parse(text) } catch { return reject(400, 'invalid_json') }

  const parsed = parseEvent(payload)
  if (!parsed.ok) return reject(400, parsed.reason)

  // Binding not configured yet: accept and discard.
  if (!env || !env.PADDOCK_EVENTS || typeof env.PADDOCK_EVENTS.writeDataPoint !== 'function') {
    return noContent()
  }

  try {
    env.PADDOCK_EVENTS.writeDataPoint(toDataPoint(parsed.event))
  } catch {
    // Measurement must never surface an error to the visitor.
  }
  return noContent()
}

export function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } })
}
