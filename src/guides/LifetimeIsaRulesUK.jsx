import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { ISA_RULES } from '../isaRules'
import { figureOn, formatDate, gbp, lastCheckedFor, pensionAccessAge, valueOn } from '../ukFigures'

export const LISA_PUBLISHED = '2026-11-07'
export const LISA_REVIEWED = '2026-11-07'

const ALLOWANCE = valueOn('isa.overall_allowance')
const LIMIT = valueOn('isa.lifetime_isa.annual_limit')
const BONUS_RATE = valueOn('isa.lifetime_isa.bonus_rate')
const FIRST_PAYMENT_BEFORE = valueOn('isa.lifetime_isa.first_payment_before_age')
const WITHDRAWAL_AGE = valueOn('isa.lifetime_isa.withdrawal_age')
const CHARGE = valueOn('isa.lifetime_isa.unauthorised_withdrawal_charge')
const OVER_CAP_CHARGE = valueOn('isa.lifetime_isa.property_over_cap_charge')
const PRICE_CAP = valueOn('isa.lifetime_isa.property_price_cap')
const OVER_CAP_FROM = formatDate(figureOn('isa.lifetime_isa.property_price_cap', new Date()).effectiveFrom)

const BONUS = (LIMIT * BONUS_RATE) / 100
const WITH_BONUS = LIMIT + BONUS
const AFTER_CHARGE = WITH_BONUS * (1 - CHARGE / 100)

export default function LifetimeIsaRulesUK({ navigateTo, goTo }) {
  const access = pensionAccessAge()
  const sources = [
    { title: 'Lifetime ISA', org: 'GOV.UK', url: 'https://www.gov.uk/lifetime-isa' },
    { title: 'Withdrawing money from your Lifetime ISA', org: 'GOV.UK', url: 'https://www.gov.uk/lifetime-isa/withdrawing-money-from-your-lifetime-isa' },
    { title: 'Tax-free savings newsletter 24 (October 2026)', org: 'HMRC', url: ISA_RULES.hmrcNewsletterUrl },
    { title: 'Increasing normal minimum pension age', org: 'GOV.UK', url: figureOn('pension.normal_minimum_pension_age', new Date()).sourceUrl },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/lifetime-isa-rules-uk"
      heroLabel="ISAs and tax years"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">ISAs and tax years</div>
      <h1 className="guide-h1">Lifetime ISA rules in the UK: bonus, limits and charges</h1>
      <ArticleDates published={LISA_PUBLISHED} reviewed={LISA_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        A Lifetime ISA lets you pay in up to {gbp(LIMIT)} a year and adds a {BONUS_RATE}% government bonus, up to{' '}
        {gbp(BONUS)} a year. You can open one if you are 18 to {FIRST_PAYMENT_BEFORE - 1} and pay in until you are 50. The money
        can come out without a charge to buy a first home, from age {WITHDRAWAL_AGE}, or if you are terminally ill. Other
        withdrawals lose {CHARGE}% of the amount taken out, which is more than the bonus. The {gbp(LIMIT)} counts towards your
        {' '}{gbp(ALLOWANCE)} yearly ISA allowance.
      </QuickAnswerBox>

      <H2>The rules at a glance</H2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr><th>Rule</th><th>What applies in {ISA_RULES.taxYear}</th></tr>
          </thead>
          <tbody>
            <tr><td>Who can open one</td><td>Aged 18 or over and under {FIRST_PAYMENT_BEFORE}</td></tr>
            <tr><td>Payments in</td><td>Up to {gbp(LIMIT)} a year, until age 50, inside your {gbp(ALLOWANCE)} ISA allowance</td></tr>
            <tr><td>Government bonus</td><td>{BONUS_RATE}% of what you pay in, up to {gbp(BONUS)} a year. It does not use ISA allowance.</td></tr>
            <tr><td>Penalty-free withdrawals</td><td>Buying a first home (at least 12 months after your first payment, and up to the price cap), from age {WITHDRAWAL_AGE}, or if terminally ill</td></tr>
            <tr><td>Property price cap</td><td>{gbp(PRICE_CAP)}</td></tr>
            <tr><td>Charge on other withdrawals</td><td>{CHARGE}% of the amount withdrawn</td></tr>
            <tr><td>Flexible (withdraw and replace)?</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <H2>What the bonus is worth</H2>
      <Example>
        You pay in the full {gbp(LIMIT)} in a tax year. The government adds {BONUS_RATE}%, which is {gbp(BONUS)}, so{' '}
        {gbp(WITH_BONUS)} goes in before any growth. That is the bonus on one year&apos;s payments; each later year you pay in
        earns its own bonus, up to the same limit.
      </Example>

      <H2>The charge, and why it can cost more than the bonus</H2>
      <P>
        The {CHARGE}% charge applies to the whole amount you take out, including the bonus and any growth. The bonus, though,
        was only {BONUS_RATE}% of what you paid in. Charging {CHARGE}% of the larger total takes back more than the bonus
        added, so part of your own money goes too.
      </P>
      <Example>
        You pay in {gbp(LIMIT)} and receive a {gbp(BONUS)} bonus, so the account holds {gbp(WITH_BONUS)} (ignoring growth).
        You take it all out for a reason the rules do not allow. The {CHARGE}% charge is {gbp(WITH_BONUS * (CHARGE / 100))}, so
        you receive {gbp(AFTER_CHARGE)}. That is {gbp(LIMIT - AFTER_CHARGE)} less than you paid in. Growth can shrink or remove
        that gap, but it cannot be relied on.
      </Example>

      <H2>Buying a first home</H2>
      <UL>
        <li>The account must have been open for at least 12 months from your first payment.</li>
        <li>The property price must be within the cap of {gbp(PRICE_CAP)}. From {OVER_CAP_FROM} a withdrawal for a more expensive property is charged {OVER_CAP_CHARGE}% instead of {CHARGE}%. It still counts as a charged withdrawal.</li>
        <li>GOV.UK lists further conditions on the purchase, such as how it is paid for and that it is your first home. Read them before relying on the Lifetime ISA for a deposit.</li>
      </UL>

      <H2>Lifetime ISA and retirement</H2>
      <P>
        You can take the money out from age {WITHDRAWAL_AGE} without a charge, and the pension access age is currently {access.now}
        {access.next ? `, rising to ${access.next} on ${access.nextFrom}` : ''}. The gap matters if you plan to stop work early: a Lifetime
        ISA cannot fund the years before {WITHDRAWAL_AGE} without the charge, so those years need money you can reach, such
        as ordinary ISAs. The{' '}
        <a {...inlineLink(navigateTo, '/tools/retirement-bridge-calculator')}>retirement bridge calculator</a> shows how large
        that gap could be, and our guide to{' '}
        <a {...inlineLink(navigateTo, '/guides/monthly-investment-to-retire-early-uk')}>saving to retire early</a> explains the
        arithmetic. A Lifetime ISA does not replace a workplace pension, which can come with employer contributions that a
        Lifetime ISA does not.
      </P>

      <H2>What this guide leaves out</H2>
      <UL>
        <li>Whether a Lifetime ISA is right for you compared with a pension or an ordinary ISA. That depends on your tax rate, employer contributions and plans.</li>
        <li>Cash and investment versions of the account and their charges, which vary by provider.</li>
        <li>Transfers of an existing Lifetime ISA between providers, which keep the account&apos;s status but should be checked with both providers.</li>
        <li>The First Time Buyer ISA announced in the Autumn Budget 2026 for April 2029. Its details are not final, so this page covers only the rules in force now.</li>
      </UL>

      <Callout>
        This is general information, not financial advice. A charge of {CHARGE}% on a withdrawal is a real cost; read GOV.UK&apos;s
        withdrawal rules and your provider&apos;s terms, and consider free guidance from MoneyHelper, before paying in.
      </Callout>

      <P>
        For how a Lifetime ISA fits within the yearly total, see the{' '}
        <a {...inlineLink(navigateTo, '/guides/isa-allowance-uk')}>ISA allowance guide</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Track your Lifetime ISA alongside your other ISAs and pensions, so you can see how much is locked until{' '}
        age {WITHDRAWAL_AGE} and how much you can reach sooner. You enter the balances yourself.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('isa.lifetime')} formatDate={formatDate} />
    </GuideShell>
  )
}
