// Homepage FAQ content. Single source of truth: rendered on the homepage
// (App.jsx) and emitted as FAQPage JSON-LD (meta.js → prerender).
export const HOME_FAQS = [
  {
    q: "Why doesn't Paddock connect to my bank?",
    a: 'By design. Most finance apps need your bank credentials to exist — Paddock is built so they never enter the product. You type in balances yourself, which means there is nothing to leak, nothing to sell, and no connection to break or re-authenticate. Your bank details stay where they belong: at your bank.',
  },
  {
    q: 'Is manual entry a pain?',
    a: 'Less than you would expect. Most users update their balances once a month in under five minutes — a short, deliberate ritual, a bit like the monthly spreadsheet update but without the formulas. Long-term wealth does not move minute to minute, so a monthly rhythm is genuinely enough.',
  },
  {
    q: 'Can Paddock see my bank accounts?',
    a: 'No. Paddock has no access to your bank, your transactions, or your credentials. The only financial data in Paddock is the balances and assumptions you choose to enter.',
  },
  {
    q: 'Is Paddock financial advice?',
    a: 'No. Paddock is a tracking and planning tool. It does not provide financial advice, investment recommendations, or guaranteed outcomes. Projections are illustrative and based on assumptions you control.',
  },
  {
    q: 'Which account types can I track?',
    a: 'The full UK picture: current accounts, savings, Cash ISAs, Stocks & Shares ISAs, Lifetime ISAs, GIAs, SIPPs, workplace pensions, Premium Bonds, property, mortgages, credit cards and other liabilities — plus multi-currency accounts converted into one base-currency net worth.',
  },
  {
    q: 'Can I import from a spreadsheet?',
    a: 'Moving in is simpler than an import. Add each account once, enter its current balance, and you are tracking — most people move a full spreadsheet into Paddock in ten to fifteen minutes, then keep the old sheet as an archive.',
  },
  {
    q: 'What if I do not know my exact balances?',
    a: 'Estimates are fine. A property valuation or an old pension figure does not need to be perfect to be useful — what matters is consistency over time. Enter your best number now and refine it when a statement arrives.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep your account. Cancelling drops you back to the free plan at the end of your billing period — you lose the Pro features, not your data. Billing is handled by Stripe and can be cancelled in a couple of clicks.',
  },
  {
    q: 'Can I export my data?',
    a: 'Your data is yours. Everything you enter is visible in the product at any time, and if you want a copy of your data — or want it deleted entirely — email hello@getpaddock.com and we will sort it. No lock-in.',
  },
  {
    q: 'Is Paddock only for UK users?',
    a: 'Paddock is UK-first: ISAs, SIPPs, workplace pensions and Premium Bonds are native account types, not labels bolted on. Multi-currency support means you can also track overseas accounts, but the wrappers and planning context are built for the UK.',
  },
]
