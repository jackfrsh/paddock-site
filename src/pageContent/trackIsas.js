import { ISA_FAQS, ISA_RULES, gbp } from '../isaRules.js'
import { sum } from './format.js'

const r = ISA_RULES

export const ISA_PAGE_QUICK_ANSWER =
  'To track ISAs, pensions and savings together, list each account with its current value, group them by type, and add them up alongside any debts. Paddock does this for UK accounts, including Cash and Stocks & Shares ISAs, Lifetime ISAs, SIPPs and workplace pensions.'

export const ISA_PAGE_TABLE = {
  label: 'Account types',
  title: 'UK account types at a glance.',
  intro:
    'The accounts most people end up tracking, how they are taxed, when you can get at the money, and whether paying in uses up your ISA allowance.',
  columns: ['Account', 'Tax treatment', 'Access', 'Uses ISA allowance?'],
  rows: [
    [
      'Cash ISA',
      'Interest is tax-free.',
      'Depends on the product: easy access or fixed term.',
      `Yes. The full ${gbp(r.overallAllowance)} can go into Cash ISAs.`,
    ],
    [
      'Stocks & Shares ISA',
      'Gains, dividends and interest are tax-free.',
      'You can usually sell and withdraw at any time, but the value can fall as well as rise.',
      'Yes.',
    ],
    [
      'Lifetime ISA',
      'Tax-free, plus a 25% government bonus on up to £4,000 a year.',
      'For a first home or from age 60. Other withdrawals face a 25% charge.',
      `Yes. The £4,000 counts towards the ${gbp(r.overallAllowance)}.`,
    ],
    [
      'SIPP or workplace pension',
      'Tax relief on contributions.',
      'From the minimum pension age: 55, rising to 57 on 6 April 2028.',
      'No. Pensions have a separate annual allowance.',
    ],
    [
      'Premium Bonds',
      'Prizes are tax-free. No interest is paid.',
      'You can withdraw at any time.',
      `No. NS&I limits holdings to ${gbp(50000)} per person.`,
    ],
    [
      'General investment account (GIA)',
      'No tax wrapper: gains, dividends and interest may be taxable.',
      'You can usually sell and withdraw at any time.',
      'No.',
    ],
  ],
}

// Illustrative paid-in amounts. The allowance figures come from isaRules.js.
const paidIn = [
  { label: 'Stocks & Shares ISA', values: [10000] },
  { label: 'Cash ISA', values: [6000] },
  { label: 'Lifetime ISA', values: [3000] },
]
const totalPaidIn = sum(paidIn.map((row) => row.values[0]))

export const ISA_PAGE_EXAMPLE = {
  title: 'A worked example: splitting the allowance.',
  intro: `The ${gbp(r.overallAllowance)} allowance is a total across all your adult ISAs. This example shows one way to split it for ${r.taxYear}. The amounts are illustrative.`,
  columns: ['', r.taxYear],
  groups: [
    {
      heading: 'Paid in during the tax year',
      rows: paidIn,
      total: { label: 'Total paid in', values: [totalPaidIn] },
    },
  ],
  summary: [
    { label: 'Allowance left', values: [r.overallAllowance - totalPaidIn], emphasis: true },
  ],
  note: `The allowance counts what you pay in, not what the accounts are worth, so growth does not use it up. The same ${gbp(r.overallAllowance)} allowance carries on from ${r.nextTaxYearStart}: the planned ${gbp(r.cancelledCashIsaLimit)} Cash ISA limit for under-65s was dropped in the Autumn Budget on ${r.cashIsaCapDroppedOn}.`,
}

export const TRACK_ISAS_FAQS = [
  {
    q: 'Can I track multiple ISAs?',
    a: 'Yes. The point is to build a complete view, not force everything into one account type. Multiple ISA balances can all contribute to the same broader wealth picture.',
  },
  {
    q: 'Should pensions be included?',
    a: 'For many people, yes. Pensions are often one of the largest parts of long-term wealth, so excluding them can make the total picture less useful.',
  },
  {
    q: 'Do I need live account syncing?',
    a: 'No. Paddock is manual by design. That keeps the workflow cleaner and lets you update on a cadence that suits long-term wealth tracking.',
  },
  {
    q: 'Is this only for investing?',
    a: 'No. It is for seeing the broader picture across cash, savings, investments and pensions, so you can understand total progress more clearly.',
  },
  ...ISA_FAQS,
  {
    q: 'Does the ISA allowance count what I pay in or what the account is worth?',
    a: `It counts what you pay in during the tax year, not the value of the account. Growth does not use up your allowance, so a Stocks and Shares ISA that has grown well still lets you pay in up to ${gbp(r.overallAllowance)} across your ISAs this tax year. Whether money you withdraw can be paid back in without using the allowance depends on whether your ISA is flexible, so check with your provider.`,
  },
]
