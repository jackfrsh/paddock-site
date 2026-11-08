/* Decides whether the site's measurement is healthy, from three facts:
   what the live site reports, and what a person has recorded as verified in
   src/measurementStatus.js. Pure, so it can be tested without a network.

   The rule that keeps the alert useful and honest:
   - Something is broken that we told visitors is running  -> error (fails the check)
   - Something is not set up yet, and we have not claimed it -> warning (visible, does not fail)
   - Something works but nobody has recorded it as verified  -> notice (reminder to flip the flag)

   So the daily check stays quiet-but-visible until the owner finishes
   docs/phase-3-owner-actions.md, and becomes a real alarm the moment a
   verified piece stops working. */

export const BEACON_PATTERN = /static\.cloudflareinsights\.com\/beacon/

/* storage: the parsed GET /api/e answer, e.g. { status: 200, body: { storage: 'configured' } }
   homepage: the live HTML as text, or null if it could not be fetched
   status: MEASUREMENT_STATUS */
export function evaluate({ storage, homepage, status }) {
  const findings = []
  const add = (level, check, message) => findings.push({ level, check, message })

  const storageOk = storage && storage.status === 200 && storage.body?.storage === 'configured'
  if (storageOk) {
    if (status.eventStorage) add('ok', 'event-storage', 'Event storage is configured and recorded as verified.')
    else add('notice', 'event-storage', 'Event storage is configured. Prove it with a test event and set eventStorage: true in src/measurementStatus.js (docs/phase-3-owner-actions.md, step 2 and 6).')
  } else {
    const seen = storage ? `GET /api/e answered ${storage.status}${storage.body ? ` ${JSON.stringify(storage.body)}` : ''}` : 'GET /api/e could not be reached'
    if (status.eventStorage) add('error', 'event-storage', `${seen}. Event storage is recorded as verified, so events are now being lost and the Privacy page is wrong. Check the PADDOCK_EVENTS binding and redeploy.`)
    else if (!storage) add('warning', 'event-storage', `${seen}, so whether events are stored is unknown. Retry; if it persists the site may be down.`)
    else add('warning', 'event-storage', `${seen}. Events are being discarded until the PADDOCK_EVENTS binding exists (docs/phase-3-owner-actions.md, step 2). The Privacy page does not claim it.`)
  }

  const beaconOk = typeof homepage === 'string' && BEACON_PATTERN.test(homepage)
  if (beaconOk) {
    if (status.webAnalytics) add('ok', 'web-analytics', 'Cloudflare Web Analytics beacon is in the live HTML and recorded as verified.')
    else add('notice', 'web-analytics', 'The Web Analytics beacon is in the live HTML. Set webAnalytics: true in src/measurementStatus.js (docs/phase-3-owner-actions.md, step 1 and 6).')
  } else {
    const seen = homepage === null || homepage === undefined ? 'The home page could not be fetched' : 'The Web Analytics beacon is not in the live HTML'
    if (status.webAnalytics) add('error', 'web-analytics', `${seen}. Web Analytics is recorded as verified, so the Privacy page is wrong. Re-enable it in the Pages project and redeploy.`)
    else add('warning', 'web-analytics', `${seen}. Web Analytics is not enabled yet (docs/phase-3-owner-actions.md, step 1). The Privacy page does not claim it.`)
  }

  return { findings, failed: findings.some((f) => f.level === 'error') }
}
