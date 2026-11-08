import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ComparisonSources from '../components/ComparisonSources'
import { MONEYHUB_FAQS } from '../moneyhubFaqs'
import {
  COMPARISON_CHECKED_ON,
  EMMA_PRICES,
  MONEYHUB_APP_END_DATE,
  WEALTHVIEW_PREMIUM_PRICE,
} from '../comparisonFacts'
import { PRO_PRICE } from '../planFacts'
import { formatDate } from '../ukFigures'

const money = (n) => `£${Number.isInteger(n) ? n : n.toFixed(2)}`

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export default function MoneyHubAlternative({ navigateTo, goTo }) {
  return (
    <div className="landing-shell">
      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <main id="main-content" tabIndex={-1}>
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="hero-copy">
            <div className="hero-kicker">Moneyhub&apos;s consumer app: end of service</div>
            <h1>
              Moneyhub&apos;s consumer app was due to close in August 2026: alternatives for UK investors
            </h1>
            <p className="hero-sub">
              Moneyhub announced that it would stop offering its app to individuals and set{' '}
              {formatDate(MONEYHUB_APP_END_DATE)} as the date remaining consumer accounts would
              close. That date has passed. The review site Smart Money People now lists the app
              as discontinued, although Moneyhub&apos;s own announcement still calls it a target
              date and we found no later statement from Moneyhub. If you used it to track ISAs,
              pensions, savings or net worth, this is an honest comparison of the strongest
              options for UK investors, and what to do about your data.
            </p>
            <p className="hero-foot" style={{ marginTop: 16 }}>
              First published May 2026 · Facts rechecked {formatDate(COMPARISON_CHECKED_ON)}
            </p>
            <div className="hero-tags" style={{ marginTop: 24 }}>
              <span>ISAs &amp; SIPPs</span>
              <span>Privacy &amp; bank linking</span>
              <span>Long-term projections</span>
              <span>UK-native features</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What was Moneyhub ────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Background</SectionLabel>
          <h2>What was Moneyhub?</h2>
          <p className="section-copy">
            Moneyhub was one of the UK&apos;s longest-running open banking aggregation platforms. It
            let users connect bank accounts, pensions, investments and property in one view, and
            was used both by consumers directly and by financial advisers through its B2B
            platform. For many UK investors it was one of the few tools that gave a reasonably
            comprehensive picture of total wealth — ISAs, SIPPs, current accounts and mortgages
            in one place.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            Moneyhub said it was concentrating on the business channels where it works with
            financial institutions, so it stopped offering the app to new consumer users and
            building new features for it. Its announcement gave {formatDate(MONEYHUB_APP_END_DATE)}{' '}
            as the target date for closing all remaining accounts and said personal data would be
            deleted once the app closed. It did not recommend other providers, and said it had
            no commercial or migration arrangements with them.
          </p>
        </div>
      </section>

      {/* ── After the closure ────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>After the closure</SectionLabel>
          <h2>If you used Moneyhub: what to do now</h2>
          <div className="faq-grid" style={{ marginTop: 24 }}>
            <div className="faq-card">
              <h3>Check what you still have</h3>
              <p>
                Moneyhub said you could download your data as a CSV before closure and that
                personal data would be deleted once the app closed. If you exported in time, keep
                that file. If you did not, ask Moneyhub support what is still available.
              </p>
            </div>
            <div className="faq-card">
              <h3>You do not need the old history to start</h3>
              <p>
                For total wealth, today&apos;s balances matter most. With a manual tracker such as
                Paddock you enter your current ISA, SIPP, savings and property values, and the
                history builds from your next update onwards.
              </p>
            </div>
            <div className="faq-card">
              <h3>Decide how much automation you need</h3>
              <p>
                If you valued automatic syncing and spending categories, look at Emma. If you
                mainly used Moneyhub to see your whole position, the manual options below can
                match that without sharing bank logins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Comparison</SectionLabel>
          <h2>How the four main alternatives compare</h2>
          <p className="section-copy narrow">
            Each product takes a meaningfully different approach. The right choice depends on
            whether automatic syncing or deliberate, private tracking fits how you manage money.
          </p>

          <div className="cmp-table-wrap">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th></th>
                  <th className="cmp-col-paddock">Paddock</th>
                  <th>WealthR</th>
                  <th>WealthView</th>
                  <th>Emma</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td className="cmp-col-paddock">
                    Free plan; Pro {money(PRO_PRICE.monthly)} a month or {money(PRO_PRICE.annual)} a year
                  </td>
                  <td>Free tier; paid Pro tier</td>
                  <td>Free; {money(WEALTHVIEW_PREMIUM_PRICE)} one-time Premium unlock</td>
                  <td>Free plan; paid plans from {money(EMMA_PRICES.plusMonthly)} a month</td>
                </tr>
                <tr>
                  <td>How accounts are added</td>
                  <td className="cmp-col-paddock">Manual entry</td>
                  <td>Manual entry; site says no bank linking</td>
                  <td>Manual entry; no account or logins</td>
                  <td>Open banking; manual accounts on paid plans</td>
                </tr>
                <tr>
                  <td>Where your data lives</td>
                  <td className="cmp-col-paddock">In your Paddock account, not on your device only</td>
                  <td>In your WealthR account (not checked in detail)</td>
                  <td>On your device, per its App Store listing</td>
                  <td>Emma&apos;s servers; policy says data is used to improve the service</td>
                </tr>
                <tr>
                  <td>UK wrappers (ISA / pension)</td>
                  <td className="cmp-col-paddock">UK account types built in</td>
                  <td>ISA, SIPP and defined benefit pension tracking, plus UK tax calculators</td>
                  <td>ISA and pension allowance tracking; State Pension and UK tax rules</td>
                  <td>Balances only; no wrapper-specific tools found</td>
                </tr>
                <tr>
                  <td>Long-term projections</td>
                  <td className="cmp-col-paddock">1 year on the free plan; 5–40 years with Pro</td>
                  <td>FIRE, Monte Carlo and stress-test tools, in the free tier per its site</td>
                  <td>Retirement modeller; full controls need Premium</td>
                  <td>Not found in its plan descriptions</td>
                </tr>
                <tr>
                  <td>Platforms</td>
                  <td className="cmp-col-paddock">Web and iOS</td>
                  <td>Web app, installable on iOS and Android as a PWA</td>
                  <td>iOS (App Store); also listed on Google Play</td>
                  <td>iOS and Android</td>
                </tr>
                <tr>
                  <td>Native iOS app</td>
                  <td className="cmp-col-paddock">Yes</td>
                  <td>No — PWA</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="cmp-note">
            Paddock publishes this page and is one of the products compared. It is not
            financial advice, and none of these tools gives personal recommendations.
          </p>
          <ComparisonSources vendors={['wealthr', 'wealthview', 'emma', 'moneyhub']} />
        </div>
      </section>

      {/* ── Paddock ──────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Alternative 1</SectionLabel>
          <h2>Paddock</h2>
          <p className="section-copy">
            Paddock is a privacy-first wealth tracker built specifically for UK investors. Where
            Moneyhub relied on open banking connections to pull in your data automatically,
            Paddock takes the opposite approach: you enter your own balances — typically once a
            month — and the app handles the rest. Net worth, allocations, projections and FX
            conversion are all calculated from numbers you control.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The result is something that feels more like a deliberate financial journal than a
            live dashboard. ISAs, Stocks and Shares ISAs, SIPPs, cash savings and property all
            have first-class support — not generic asset fields. Multi-currency accounts are
            handled with daily FX rates built in. Long-term projections run from 5 to 40 years
            with Pro; the free plan shows one year ahead.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            Paddock works on both web and iOS, with a native iPhone app. There is a free plan to
            start, with a Pro subscription unlocking longer projections and unlimited accounts.
            The privacy model is simple: no bank credentials are shared, no data is sold, and no
            third-party aggregator sits between you and your accounts. Your balances are stored
            in your Paddock account, not only on your device.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                Privacy-first with no bank linking and no data sold. ISA and SIPP awareness built
                in from the start. Multi-currency with daily FX rates. Long-term projections on
                web and native iOS. Built for tracking wealth rather than spending.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                Manual entry only — no automatic sync. Not designed for day-to-day spending or
                budgeting. No Android app. Longer projections and unlimited accounts need Pro. Data
                is held in your Paddock account rather than only on your device. If automatic bank
                linking is your primary need, a different tool will suit you better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WealthR ──────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Alternative 2</SectionLabel>
          <h2>WealthR</h2>
          <p className="section-copy">
            WealthR (wealthr.co.uk) is a UK-built wealth tracker and retirement planner that runs
            in the browser and can be added to a phone&apos;s home screen as a progressive web app.
            Its site describes a free tier that includes net worth tracking, ISA and SIPP tracking
            and FIRE (Financial Independence, Retire Early) planning, with a paid Pro tier for more
            advanced planning, and says there is no bank linking. It is not the same product as
            the similarly named getwealthr.com.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The strength is UK tax and retirement modelling. WealthR offers a free UK income tax
            calculator and a range of standalone calculators, such as capital gains tax, pension
            carry forward and Bed and ISA, alongside Monte Carlo retirement simulation and a
            sequence-of-returns stress test. For people focused on FIRE numbers or drawing down
            a pension, that is a lot to get without paying.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            Two things to weigh. It is a web-first app rather than a native one, so it is not in
            the App Store. And its Pro price is quoted differently across WealthR&apos;s own pages
            (we saw monthly prices of £4.99 and £5.99, and yearly prices of £39.99 and £49.99),
            so check its pricing page for the current figure.
          </p>
          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                A permanent free tier that includes net worth tracking and FIRE tools. No bank
                linking. Strong UK tax and retirement calculators. Installable on iOS and
                Android.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                No native app. Pro pricing is inconsistent between its own pages. We did not
                assess how it handles multiple currencies or where it stores data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WealthView ───────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Alternative 3</SectionLabel>
          <h2>WealthView</h2>
          <p className="section-copy">
            WealthView is a UK-focused app for net worth tracking and retirement planning. Its App
            Store listing says all data stays on your device and no account is required. It is free
            to download, with a one-time {money(WEALTHVIEW_PREMIUM_PRICE)} Premium unlock rather than a
            subscription, which suits anyone wary of recurring fees.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The free version covers unlimited accounts, net worth history, ISA and pension
            allowance tracking, a retirement readiness score and a short retirement preview.
            Premium adds the full retirement modeller, scenario and stress-test tools, unlimited
            snapshot history and inheritance tax and capital gains tax sections, according to
            the listing. It also covers State Pension and defined benefit pensions, which many
            simple trackers leave out.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The trade-offs follow from keeping everything on the device. Its listings describe a
            phone and tablet app with data stored locally, and we did not find a web version, so
            there is nothing to open on a laptop. We have not checked how backup or moving to a
            new phone works. A Google Play listing also appeared in our searches; check that
            before assuming it is iOS only.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                One-time price rather than a subscription. Data stays on the device, with no
                account. Retirement modelling, State Pension and defined benefit pensions, and UK
                tax rules built in.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                The fuller planning tools sit behind the Premium unlock. No web version found.
                We have not assessed backup or multi-currency support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emma ─────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Alternative 4</SectionLabel>
          <h2>Emma</h2>
          <p className="section-copy">
            Emma is a budgeting and money-management app that links to UK bank accounts through
            open banking. If what you liked about Moneyhub was the automatic sync — waking up to
            an updated view of everything without typing anything in — Emma is the closest option
            here on that dimension.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            Emma does track net worth, but its plan structure puts that on the paid plans, along
            with manual accounts and data export, according to third-party reviews. On its UK App
            Store listing at our check, Plus was {money(EMMA_PRICES.plusMonthly)} a month, Pro
            {' '}{money(EMMA_PRICES.proMonthly)} a month or {money(EMMA_PRICES.proAnnual)} a year, and
            Ultimate {money(EMMA_PRICES.ultimateMonthly)} a month. Reviews report that the free plan
            allows only a small number of bank connections. In our checks we found no ISA, SIPP or
            long-term projection tools in its descriptions, so it is a spending-first app that also
            shows net worth, rather than a planning tool.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            On privacy, Emma&apos;s privacy policy says personal data is used to improve and
            customise its services, and that its credit-score features involve sharing data with
            TransUnion and with the US provider iovation. That is not unusual for an open banking
            app, but it is worth knowing if privacy is a priority.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                Automatic bank syncing through open banking. Budgeting, subscription tracking and
                spending categories. A free plan to start. iOS and Android.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                Net worth tracking and manual accounts need a paid plan. We found no wrapper-specific
                or long-term planning tools in its descriptions. Open banking is needed for
                automatic sync, and its privacy policy says data is used to improve the service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who is Paddock for ───────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Self-selection</SectionLabel>
          <h2>Who is Paddock built for?</h2>
          <p className="section-copy narrow">
            Paddock is not for everyone. If automatic bank linking or day-to-day budgeting is
            your primary need, one of the other options here will fit better. But there is a
            specific kind of investor for whom Paddock is an unusually good match.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>You track multiple UK account types</h3>
              <p>
                ISAs, a SIPP, cash savings, property, maybe a general investment account — you
                want all of it in one coherent view, not scattered across apps and spreadsheets.
              </p>
            </div>

            <div className="faq-card">
              <h3>You update your numbers deliberately</h3>
              <p>
                Once a month, after payday or at a natural checkpoint. You see that as a useful
                ritual, not a burden. Automatic sync is not something you miss.
              </p>
            </div>

            <div className="faq-card">
              <h3>Privacy matters more than convenience</h3>
              <p>
                You would rather enter your own numbers than hand over bank credentials to a
                third-party aggregator — especially for accounts with meaningful balances.
              </p>
            </div>

            <div className="faq-card">
              <h3>You think in long-term trajectory</h3>
              <p>
                Where will my net worth be in ten years? Am I on track? What happens if I
                increase my pension contribution? These are the questions you want answered,
                not this month's spending categories.
              </p>
            </div>
          </div>

          <div className="cmp-tradeoff" style={{ marginTop: 32 }}>
            <p>
              <strong>Not a good fit if:</strong> you primarily need automatic bank syncing
              across all your accounts, or if day-to-day spending visibility is your main goal.
              Paddock is a wealth tracker, not a budgeting app. If those are your priorities,
              Emma is the better choice from this list.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>FAQ</SectionLabel>
          <h2>Moneyhub questions, answered.</h2>
          <div className="faq-grid" style={{ marginTop: 24 }}>
            {MONEYHUB_FAQS.map((faq) => (
              <div className="faq-card" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related links ────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Related</SectionLabel>
          <h2>Explore Paddock more closely.</h2>
          <p className="section-copy">
            If any of these fit what you are looking for, they go deeper on specific topics.
          </p>

          <div className="use-links-grid use-links-grid-3">
            <a
              href="/why-i-track-wealth-manually-instead-of-using-open-banking-apps"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/why-i-track-wealth-manually-instead-of-using-open-banking-apps')
                }
              }}
            >
              <h3>Why we chose manual tracking</h3>
              <div className="line" />
              <p>A founder note on privacy, deliberate tracking and why Paddock does not use open banking.</p>
            </a>

            <a
              href="/track-isas-pensions-savings"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/track-isas-pensions-savings')
                }
              }}
            >
              <h3>Track ISAs, pensions and savings</h3>
              <div className="line" />
              <p>How Paddock handles UK wrappers — ISAs, SIPPs, and savings — in one long-term view.</p>
            </a>

            <a
              href="/tools/pension-drawdown-calculator"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/tools/pension-drawdown-calculator')
                }
              }}
            >
              <h3>Free pension drawdown calculator</h3>
              <div className="line" />
              <p>Estimate how long your SIPP could last across different withdrawal rates. No account needed.</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container final-cta">
          <h2>Track your wealth privately,<br />clearly, without bank linking.</h2>
          <p className="section-copy center narrow-center">
            Paddock gives you one place to see ISAs, pensions, savings, property and
            multi-currency accounts together — with long-term projections and no open banking
            required. Free to start.
          </p>

          <div className="hero-actions center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goTo('signup', 'bottom')}
            >
              Create your free account
            </button>
            <a
              href="/net-worth-tracker"
              className="btn btn-secondary"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/net-worth-tracker') } }}
            >
              See how Paddock works
            </a>
          </div>

          <p className="hero-foot">Free to start · No credit card required · No bank linking</p>
        </div>
      </section>

      </main>
      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
