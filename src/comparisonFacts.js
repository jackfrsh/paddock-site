/* Facts about other products, used by /best-net-worth-tracking-apps-uk and
   /moneyhub-alternative. Paddock publishes both pages and is one of the products
   compared, so every statement about someone else's product has to be traceable
   to a page we looked at, on a date we can show readers.

   Rules (see docs/comparison-verification.md for the evidence table):
   - Prefer the vendor's own page (App Store listing, plans page, privacy policy).
   - Where only a third party was available, the page says so.
   - A thing we could not find is described as "not found", never as "No".
   - Update COMPARISON_CHECKED_ON only when the sources below were actually
     re-read; the guard test fails if a vendor loses its sources. */

export const COMPARISON_CHECKED_ON = '2026-11-07'

/* Prices as shown on the vendors' own pages on the check date. */
export const EMMA_PRICES = Object.freeze({
  plusMonthly: 4.99,
  proMonthly: 9.99,
  proAnnual: 83.99,
  ultimateMonthly: 14.99,
})

export const WEALTHVIEW_PREMIUM_PRICE = 7.99

export const MONEYHUB_APP_END_DATE = '2026-08-14'

export const VENDOR_SOURCES = Object.freeze({
  emma: Object.freeze([
    {
      label: 'Emma on the UK App Store (plan prices, net worth feature)',
      url: 'https://apps.apple.com/gb/app/id1270062373',
    },
    { label: 'Emma privacy policy', url: 'https://emma-app.com/app-privacy' },
    { label: 'Emma Pro plan page', url: 'https://emma-app.com/plans/emma-pro' },
    {
      label: 'Money to the Masses, Emma plans compared (third party: manual accounts and export on paid plans)',
      url: 'https://moneytothemasses.com/?p=31349',
    },
  ]),
  wealthr: Object.freeze([
    { label: 'WealthR home page (free tier, no bank linking, PWA)', url: 'https://wealthr.co.uk/' },
    { label: 'WealthR press kit (Pro price, free-tier features)', url: 'https://wealthr.co.uk/press' },
    {
      label: 'WealthR comparison page (Pro price quoted differently)',
      url: 'https://wealthr.co.uk/compare/best-uk-retirement-planning-apps/',
    },
  ]),
  wealthview: Object.freeze([
    {
      label: 'WealthView on the UK App Store (free and Premium features, £7.99 one-time)',
      url: 'https://apps.apple.com/gb/app/wealthview-net-worth-tracker/id6761937882',
    },
    { label: 'WealthView website', url: 'https://www.wealthview.co.uk/' },
    {
      label: 'WealthView on Google Play (listing seen, availability not checked)',
      url: 'https://play.google.com/store/apps/details?id=com.wealthr.app',
    },
  ]),
  moneyhub: Object.freeze([
    {
      label: 'Moneyhub end-of-service announcement (14 August 2026 given as a target date)',
      url: 'https://moneyhub.com/app-end-of-service-announcement',
    },
    {
      label: 'Smart Money People (third party: lists the app as discontinued)',
      url: 'https://smartmoneypeople.com/moneyhub-reviews/product/app',
    },
  ]),
})

export const VENDOR_NAMES = Object.freeze({
  emma: 'Emma',
  wealthr: 'WealthR',
  wealthview: 'WealthView',
  moneyhub: 'Moneyhub',
})
