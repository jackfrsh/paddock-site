/* Daily health check for the live site's measurement. Used by
   .github/workflows/analytics-health.yml and safe to run by hand:

     node scripts/check-analytics-health.mjs

   It reads two public URLs (GET /api/e and the home page). It needs no
   credentials and sends no events. Exit code 1 only when something recorded as
   verified in src/measurementStatus.js has stopped working. Decisions live in
   src/analyticsHealth.js. Output uses GitHub annotation syntax, which is also
   readable as plain text. */

import { evaluate } from '../src/analyticsHealth.js'
import { MEASUREMENT_STATUS } from '../src/measurementStatus.js'

const site = (process.env.PADDOCK_SITE_URL || 'https://getpaddock.com').replace(/\/$/, '')

async function getJson(url) {
  try {
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
    let body = null
    try { body = await res.json() } catch { /* not JSON */ }
    return { status: res.status, body }
  } catch {
    return null
  }
}

async function getText(url) {
  try {
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
    return res.ok ? await res.text() : null
  } catch {
    return null
  }
}

const [storage, homepage] = await Promise.all([getJson(`${site}/api/e`), getText(`${site}/`)])
const { findings, failed } = evaluate({ storage, homepage, status: MEASUREMENT_STATUS })

const prefix = { ok: '', notice: '::notice::', warning: '::warning::', error: '::error::' }
for (const f of findings) console.log(`${prefix[f.level]}[${f.check}] ${f.message}`)
console.log(failed ? 'Analytics health: FAILED' : 'Analytics health: ok (see warnings and notices above)')
process.exit(failed ? 1 : 0)
