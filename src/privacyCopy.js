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

/* Wording for "Deleting your account". Every statement here matches what the app
   does when DELETE /api/auth/account runs (backend/app/routers/auth.py in the app
   repo) and the scheduled backup workflow (14-day artifact retention). If either
   changes, change this and its test. */
export const BACKUP_RETENTION_DAYS = 14

export function accountDeletionCopy() {
  return [
    {
      type: 'p',
      text: 'You can delete your account yourself, at any time, on the web. Open Settings in the app, choose Delete account and type DELETE to confirm. You do not need to contact us.',
    },
    {
      type: 'p',
      text: 'Deleting your account permanently removes your sign-in and everything stored with it: your accounts, balances and payments, goals, projections, monthly closes, history, settings, the usage events linked to you, and the record of the page you first arrived from. It cannot be undone.',
    },
    {
      type: 'p',
      text: 'If you pay for Paddock Pro by card, your subscription is cancelled for you as part of deleting the account, with no refund for the current period. If you subscribed through the App Store, Apple manages that subscription: cancel it in your Apple ID settings first, because deleting your account does not cancel it.',
    },
    {
      type: 'p',
      text: 'A few copies sit outside the app and follow their own rules:',
    },
    {
      type: 'ul',
      items: [
        {
          strong: 'Payment records.',
          text: ' Stripe keeps its own records of card payments, such as invoices and the billing email, and Apple keeps its own records of App Store purchases. Deleting your Paddock account cancels a card subscription but does not remove these.',
        },
        {
          strong: 'Backups.',
          text: ` Our encrypted database backups are not edited when you delete your account. Each one is removed when it reaches the end of its retention period, and our scheduled daily backups are kept for ${BACKUP_RETENTION_DAYS} days.`,
        },
        {
          strong: 'Anonymous counts.',
          text: ' Counts that were never linked to your account cannot be tied back to you, so they are not affected.',
        },
      ],
    },
  ]
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
