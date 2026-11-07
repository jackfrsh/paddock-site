import { HOME_FAQS } from '../homeFaqs.js'
import { pickFaq } from './format.js'
import { formatDate } from '../ukFigures.js'
import {
  ANNUAL_MONTHS_FREE, FREE_LIMITS, PLAN_FACTS_VERIFIED_ON, PRO_PRICE, planSummary, priceLine, trialLine,
} from '../planFacts.js'

/* Everything this page says about plans and prices comes from planFacts.js.
   Nothing is said about features the app does not have, and no figure on the
   page is a customer result: the screenshots are a demo account. */

export const PRO_PUBLISHED = '2026-11-07'
export const PRO_REVIEWED = PLAN_FACTS_VERIFIED_ON

export const PRO_QUICK_ANSWER =
  `${planSummary()} Pro removes the account limit and adds projections of 5 to 40 years, a freedom timeline, scenario comparison and a required-contribution optimiser. You enter your balances yourself, so there is no bank login at any point.`

export const PRO_COMPARISON = {
  label: 'Free and Pro',
  title: 'What is included in each plan.',
  intro: 'The free plan is a complete net worth tracker, not a trial. Pro is for people who want to look further ahead or hold more than five accounts.',
  columns: ['', 'Free', 'Pro'],
  highlightColumn: 2,
  rows: [
    ['Net worth dashboard', 'Included', 'Included'],
    ['Accounts', `Up to ${FREE_LIMITS.accounts}`, 'Unlimited'],
    ['Projection', `${FREE_LIMITS.projectionYears} year`, '5 to 40 years, with milestones'],
    ['Freedom timeline', 'Not included', 'Included'],
    ['Scenario compare and one-off deposit modelling', 'Not included', 'Included'],
    ['Required contribution optimiser', 'Not included', 'Included'],
    ['Real-terms (inflation-adjusted) view', 'Not included', 'Included'],
    ['Cost', '£0', priceLine()],
  ],
  note: `Plan details checked against the app on ${formatDate(PLAN_FACTS_VERIFIED_ON)}. Plans and prices are shown inside the app before you subscribe.`,
}

export const PRO_FAQS = [
  {
    q: 'What is the difference between the free plan and Paddock Pro?',
    a: `The free plan is a full net worth dashboard for up to ${FREE_LIMITS.accounts} accounts, with a ${FREE_LIMITS.projectionYears}-year projection. Pro removes the account limit and adds projections of 5 to 40 years, the freedom timeline, scenario comparison and one-off deposit modelling, the required-contribution optimiser and a real-terms view.`,
  },
  {
    q: 'How much does Paddock Pro cost?',
    a: `On the web, Pro is £${PRO_PRICE.monthly} a month or £${PRO_PRICE.annual} a year, which is ${ANNUAL_MONTHS_FREE === 2 ? 'two months free' : 'cheaper than paying monthly'} on the annual plan. On iOS the subscription is bought through the App Store, and the price shown there when you subscribe is the one that applies.`,
  },
  {
    q: 'Is there a free trial?',
    a: `${trialLine()} You can use the free plan without paying.`,
  },
  {
    q: 'Do I have to connect my bank?',
    a: 'No. Paddock does not connect to your bank at all. You type in your balances yourself, most people once a month, and the only financial data in Paddock is what you choose to enter.',
  },
  pickFaq(HOME_FAQS, 'What happens if I cancel?'),
  {
    q: 'Does Paddock give financial advice?',
    a: 'No. Paddock is a tracking and planning tool, not a regulated financial adviser. Projections are estimates built from the figures and assumptions you enter, and they are not guarantees. For advice about your own circumstances, speak to a regulated adviser.',
  },
]
