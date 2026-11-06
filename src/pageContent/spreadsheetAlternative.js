import { HOME_FAQS } from '../homeFaqs.js'
import { pickFaq } from './format.js'

export const SHEET_QUICK_ANSWER =
  'A spreadsheet works for tracking net worth until the tabs, formulas and manual checks become the job. Paddock keeps the monthly-update habit but replaces the maintenance with UK account types, built-in projections and no bank logins.'

export const SHEET_PRICING_CHECKED = '6 November 2026'

export const SHEET_COMPARISON = {
  label: 'Side by side',
  title: 'Spreadsheet or Paddock: an honest comparison.',
  intro:
    'A spreadsheet is a good tool, and some rows below favour it. The question is which trade-offs suit how you actually review your wealth.',
  columns: ['', 'Spreadsheet', 'Paddock'],
  highlightColumn: 2,
  rows: [
    ['Setup', 'Build the layout and formulas yourself.', 'Add each account once and enter its balance.'],
    [
      'Monthly update',
      'Update balances, then check that formulas and charts still work.',
      'Update balances. Totals and charts follow.',
    ],
    [
      'UK accounts (ISA, SIPP, LISA, GIA)',
      'Labels you create and keep consistent.',
      'Built-in account types.',
    ],
    [
      'Projections',
      'Build and maintain your own.',
      'Built in: a 1-year projection on the free plan and 5–40 years on Pro.',
    ],
    ['Flexibility', 'Unlimited. You can model anything.', 'More structured, and less flexible by design.'],
    [
      'Where your data lives',
      'In your own file, or with your cloud provider if you use an online sheet.',
      'In your Paddock account. You enter balances, never bank credentials.',
    ],
    ['Bank logins', 'None needed.', 'None needed.'],
    ['On your phone', 'Often awkward.', 'Web and iOS app.'],
    [
      'Cost',
      'Free.',
      'A free plan for up to 3 accounts, or Pro at £6 a month or £60 a year.',
    ],
  ],
  note: `Paddock pricing as shown on getpaddock.com on ${SHEET_PRICING_CHECKED}.`,
}

export const SHEET_MAPPING = {
  label: 'Moving over',
  title: 'A worked example: your rows become accounts.',
  intro:
    'Most net worth sheets have one row per account. Each row maps to an account type in Paddock, added once with today’s balance. The row names below are examples.',
  columns: ['Spreadsheet row', 'Becomes in Paddock', 'What you enter'],
  rows: [
    ['“Cash ISA”', 'Cash ISA', 'The current balance.'],
    ['“S&S ISA”', 'Stocks & Shares ISA', 'The current value.'],
    ['“Pension (work)”', 'Workplace pension', 'The latest valuation.'],
    ['“SIPP”', 'SIPP', 'The latest valuation.'],
    ['“Premium Bonds”', 'Premium Bonds', 'The amount held.'],
    ['“House”', 'Property', 'Your estimate of its value.'],
    ['“Mortgage”', 'Mortgage', 'The outstanding balance.'],
  ],
  note: 'Keep the old sheet as an archive of your history. You do not need to rebuild it.',
}

export const SHEET_FAQS = [
  {
    q: 'Is Paddock automatic?',
    a: 'No. It is manual-entry by design. The difference is that the structure and review experience are cleaner than maintaining a spreadsheet over time.',
  },
  {
    q: 'Why not just keep using a spreadsheet?',
    a: 'You can. Paddock becomes more useful when your current sheet feels harder to maintain, less readable, or too fragmented to support a calm long-term review.',
  },
  {
    q: 'Can I still think in categories and accounts?',
    a: 'Yes. That is part of the point. Paddock keeps the structure without forcing you to build and maintain the structure yourself.',
  },
  {
    q: 'Is this for budgeting?',
    a: 'No. It is for wealth tracking. The focus is on total net worth, long-term progress and a clearer overall financial position.',
  },
  {
    q: 'Is a spreadsheet more private than a net worth app?',
    a: 'It can be. A spreadsheet saved only on your own device keeps your data with you, while an online sheet sits with your cloud provider. Paddock never asks for bank credentials or connects to your accounts, so the only financial data it holds is the balances and assumptions you choose to enter. Which is right depends on where you are comfortable keeping that data.',
  },
  pickFaq(HOME_FAQS, 'Can I import from a spreadsheet?'),
]
