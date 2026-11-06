import { gbp } from '../isaRules.js'
import { sum } from './format.js'

export const HOWTO_QUICK_ANSWER =
  'To track your net worth, list everything you own, list everything you owe, and subtract the second total from the first. Do it on the same day each month, use the same rules every time, and watch the direction of travel rather than any single number.'

export const HOWTO_TABLE = {
  label: 'Judgement calls',
  title: 'The awkward items, and how people usually handle them.',
  intro:
    'Most of a net worth figure is simple. These are the items where there is no single right answer, so the useful thing is to pick a rule and keep to it.',
  columns: ['Item', 'Common approach', 'Watch out for'],
  rows: [
    [
      'Main home',
      'Include it at a realistic estimate of market value, with the mortgage as a liability.',
      'Valuations are estimates, so many people refresh the figure once or twice a year rather than monthly.',
    ],
    [
      'Defined benefit (final salary) pension',
      'Leave it out, or include an estimated value from the scheme, such as a transfer value.',
      'It pays an income rather than holding a pot. A transfer value is a snapshot that can move a lot, so treat it as a rough guide.',
    ],
    [
      'State Pension',
      'Usually left out of net worth and allowed for separately in retirement planning.',
      'It is a future entitlement rather than an asset you own today.',
    ],
    [
      'Student loan',
      'Count the outstanding balance as a liability, or leave it out and track it separately.',
      'Repayments depend on your earnings and any balance left at the end of the term is written off, so it behaves differently from a normal debt.',
    ],
    [
      'Car and belongings',
      'Usually left out, or included at a cautious resale value.',
      'They tend to lose value and are not usually what you would sell to fund your future.',
    ],
    [
      'Business interests and crypto',
      'Include at a cautious value you can defend.',
      'Prices can swing and private stakes are hard to value, so use the same method each time.',
    ],
  ],
}

const start = 180200
const moves = [
  { label: 'New money saved (cash, ISA and pension contributions, including the employer’s share)', values: [2100] },
  { label: 'Mortgage and card balances repaid', values: [800] },
  { label: 'Investment and pension growth, and any valuation changes', values: [950] },
]
const totalMove = sum(moves.map((row) => row.values[0]))

export const HOWTO_EXAMPLE = {
  title: 'A worked example: reading a month’s change.',
  intro:
    'Net worth moves for three different reasons. Separating them tells you whether progress came from your own habits or from the market. The figures below are illustrative.',
  columns: ['', 'Amount'],
  groups: [
    {
      heading: 'Where you started',
      rows: [{ label: 'Net worth last month', values: [start] }],
    },
    {
      heading: 'What moved it',
      rows: moves,
      total: { label: 'Change in net worth', values: [totalMove] },
    },
  ],
  summary: [{ label: 'Net worth this month', values: [start + totalMove], emphasis: true }],
  note: `In a month when markets fall, the growth line can be negative and net worth can drop even though you saved as normal. That is why the habit of recording the change in each line is worth more than watching the total. This month the total rose by ${gbp(totalMove)}.`,
}

export const HOWTO_FAQS = [
  {
    q: 'Should I include my pension in net worth?',
    a: 'Many people do, because pensions are often one of the biggest parts of long-term wealth. The important thing is to use a consistent approach over time.',
  },
  {
    q: 'Should I include my home?',
    a: 'You can. If property is a meaningful part of your balance sheet, including it can make the picture more complete. Consistency is what matters most.',
  },
  {
    q: 'How often should I track my net worth?',
    a: 'Monthly is usually enough. That cadence is often frequent enough to stay aware without turning wealth tracking into constant checking.',
  },
  {
    q: 'Do I need automatic bank syncing?',
    a: 'No. For long-term wealth tracking, manual updates can often be enough, especially when the goal is clarity rather than live transaction monitoring.',
  },
  {
    q: 'How do I value a defined benefit (final salary) pension?',
    a: 'A defined benefit pension pays an income rather than holding a pot, so there is no balance to enter. Some people leave it out and treat it as extra security. Others include an estimated value, such as the transfer value your scheme can quote on request. A transfer value is a snapshot that can change a lot, so it is only a rough guide. Whichever you choose, apply the same rule every time.',
  },
  {
    q: 'Should my student loan count as a liability?',
    a: 'It is a judgement call. Many UK student loans are repaid as a percentage of earnings above a threshold, and any balance left at the end of the loan term is written off, so the outstanding balance may never be repaid in full. Some people count the balance as a liability, and others leave it out and track it separately. Pick one approach and stay consistent.',
  },
]
