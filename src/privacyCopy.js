/* Wording for the "This website" part of the Privacy page, chosen from the
   verified measurement status so the page matches what is really running.
   Plain data (no JSX) so a Node test can check every combination. */

import { MEASUREMENT_STATUS } from './measurementStatus.js'

const WEB_ANALYTICS = {
  strong: 'Cloudflare Web Analytics',
  text: ' counts page views, where visits came from and how quickly pages load. Cloudflare describes it as cookieless and as not tracking visitors across sites.',
}

const EVENT_COUNTER = {
  strong: 'A small counter of anonymous events',
  text: " runs on our own Cloudflare account. It records that a visit began on a page, that a calculator was used or completed, or that a sign-up or App Store link was clicked, with the page it happened on and a broad category for how the visit began (search, direct, social or other). Each event is a fixed label from a short list. It contains no figures, nothing you typed and no identifier, we do not store your IP address or browser details with it, and it is not linked to any account. Events are kept for up to three months. If your browser sends Global Privacy Control or Do Not Track, this counter records nothing.",
}

export function websiteMeasurementCopy(status = MEASUREMENT_STATUS) {
  const blocks = []

  blocks.push({
    type: 'p',
    text: 'The calculators and guides on getpaddock.com run in your browser. The figures you type into a calculator are not sent to us, stored, or placed in the page address.',
  })

  const items = []
  if (status.webAnalytics) items.push(WEB_ANALYTICS)
  if (status.eventStorage) items.push(EVENT_COUNTER)

  if (items.length === 0) {
    blocks.push({
      type: 'p',
      text: 'At the moment this website does not count visits, calculator use or link clicks. We intend to start counting in aggregate, using Cloudflare Web Analytics and a small counter of anonymous events on our own Cloudflare account. This page will be updated before that starts.',
    })
  } else {
    blocks.push({
      type: 'p',
      text: 'We count how the website is used, in aggregate, so we can see which pages help and which do not.'
        + (items.length === 2 ? ' Two things do this:' : ' This is done by:'),
    })
    blocks.push({ type: 'ul', items })
    const clauses = []
    if (status.eventStorage) clauses.push("Our own counter sets no cookies and uses none of your browser's storage")
    if (status.webAnalytics) clauses.push(status.eventStorage ? 'Cloudflare says the same of Web Analytics' : 'Cloudflare says Web Analytics sets no cookies')
    blocks.push({
      type: 'p',
      text: `${clauses.join(', and ')}. We do not use Google Analytics, advertising pixels or social media trackers on this website.`,
    })
  }

  if (items.length === 0) {
    blocks.push({ type: 'p', text: 'We do not use Google Analytics, advertising pixels or social media trackers on this website.' })
  }

  blocks.push({
    type: 'p',
    text: "The website is hosted on Cloudflare, which handles visitors' IP addresses in order to deliver pages and protect the site.",
  })

  blocks.push({
    type: 'p',
    text: status.appRecordsSource
      ? "Links from this website to the sign-up page include short labels naming the page you came from, such as the name of a calculator, and how your visit began (search, direct, social or other). They contain nothing you typed. The app holds them in your browser tab for up to 24 hours, without a cookie. When you create an account it stores the page you first arrived from and the page you came from just before signing up, once, so we can count which pages lead to accounts and subscriptions. If your browser sends Global Privacy Control or Do Not Track, the app keeps nothing. They are kept with your account record and deleted with it."
      : 'Links from this website to the sign-up page include short labels naming the page you came from, such as the name of a calculator, and how your visit began (search, direct, social or other). They contain nothing you typed. The Paddock app does not store these labels yet, and this page will say so when it does.',
  })

  return blocks
}
