import { HOME_FAQS } from '../homeFaqs.js'
import { gbp } from '../isaRules.js'
import { pickFaq, signed, sum } from './format.js'

export const NWT_QUICK_ANSWER =
  'A net worth tracker adds up everything you own, subtracts everything you owe, and records the result over time. Paddock is a UK net worth tracker built for ISAs, pensions, property and mortgages, using manual entry instead of bank linking.'

export const NWT_TABLE = {
  label: 'What to include',
  title: 'What goes into a UK net worth figure.',
  intro:
    'The usual items, which side of the ledger they sit on, and the number to use for each one.',
  columns: ['Item', 'Side', 'Value to use'],
  rows: [
    ['Current accounts and savings', 'Asset', 'Today’s balance.'],
    ['Cash ISA', 'Asset', 'Current balance, including interest paid.'],
    [
      'Stocks & Shares ISA and GIA',
      'Asset',
      'Current market value of the holdings, plus any cash held in the account.',
    ],
    [
      'SIPP and workplace pension (defined contribution)',
      'Asset',
      'The latest valuation from your provider.',
    ],
    ['Premium Bonds', 'Asset', `The value of the Bonds you hold (the NS&I limit is ${gbp(50000)} per person).`],
    [
      'Home',
      'Asset',
      'Your best estimate of its market value, such as a recent valuation or nearby sold prices.',
    ],
    ['Mortgage', 'Liability', 'The outstanding balance, not the monthly payment.'],
    ['Credit cards, loans and overdrafts', 'Liability', 'The outstanding balance today.'],
    [
      'Defined benefit pension, student loan',
      'Your call',
      'There is no standard treatment. Choose a rule and apply it every time.',
    ],
  ],
  note: 'Estimates are fine for items that are hard to price, such as property. Consistency matters more than precision.',
}

const assets = [
  { label: 'Current account and savings', values: [14200, 15100] },
  { label: 'Cash ISA', values: [8000, 8000] },
  { label: 'Stocks & Shares ISA', values: [46500, 47900] },
  { label: 'Workplace pension', values: [31800, 32900] },
  { label: 'SIPP', values: [22400, 23100] },
  { label: 'Premium Bonds', values: [10000, 10000] },
  { label: 'Home (estimated value)', values: [285000, 285000] },
]

const liabilities = [
  { label: 'Mortgage', values: [196400, 195600] },
  { label: 'Credit card', values: [1200, 450] },
]

const column = (rows, i) => sum(rows.map((row) => row.values[i]))
const assetTotals = [column(assets, 0), column(assets, 1)]
const liabilityTotals = [column(liabilities, 0), column(liabilities, 1)]
const netWorth = [assetTotals[0] - liabilityTotals[0], assetTotals[1] - liabilityTotals[1]]
const change = netWorth[1] - netWorth[0]
const signedChange = signed(change)
const mortgageRepaid = liabilities[0].values[0] - liabilities[0].values[1]
const cardRepaid = liabilities[1].values[0] - liabilities[1].values[1]

export const NWT_EXAMPLE = {
  title: 'A worked example: one month of change.',
  intro:
    'An illustrative UK household, recorded on two dates a month apart. The figures are made up to show the arithmetic.',
  columns: ['', '1 October', '1 November'],
  groups: [
    {
      heading: 'What you own',
      rows: assets,
      total: { label: 'Total assets', values: assetTotals },
    },
    {
      heading: 'What you owe',
      rows: liabilities,
      total: { label: 'Total liabilities', values: liabilityTotals },
    },
  ],
  summary: [
    { label: 'Net worth', values: netWorth, emphasis: true },
    { label: 'Change in the month', values: ['', signedChange] },
  ],
  note: `Net worth rose by ${gbp(change)}. That is a mix of new saving, market movement on the ISA and pensions, and debt repaid (the mortgage fell by ${gbp(mortgageRepaid)} and the card balance by ${gbp(cardRepaid)}). The line items tell you more than the total, which is why a tracker should keep them visible.`,
}

export const NWT_FAQS = [
  {
    q: 'Is Paddock a budgeting app?',
    a: 'No. Paddock is built around wealth tracking rather than day-to-day budgeting. The focus is on net worth, long-term progress and a clearer overall financial picture.',
  },
  {
    q: 'Do I need to link bank accounts?',
    a: 'No. Paddock is manual-entry by design. That keeps the experience simpler, more deliberate and more private.',
  },
  {
    q: 'Should pensions be included in net worth?',
    a: 'Many people include pensions because they are a major part of long-term wealth. What matters most is staying consistent in how you measure your position over time.',
  },
  {
    q: 'How often should I update my numbers?',
    a: 'Monthly is enough for most people. The goal is not constant checking. It is a steady view of how your wealth is changing over time.',
  },
  {
    q: 'What is the difference between net worth and savings?',
    a: 'Savings are one asset. Net worth counts everything you own, including investments, pensions and property, and then subtracts what you owe, such as a mortgage, loans and credit card balances. Two people with the same savings can have very different net worth.',
  },
  pickFaq(HOME_FAQS, 'Which account types can I track?'),
]
