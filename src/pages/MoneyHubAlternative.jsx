import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export default function MoneyHubAlternative({ navigateTo, goTo }) {
  return (
    <div className="landing-shell">
      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="hero-copy">
            <div className="hero-kicker">Moneyhub is closing August 2026</div>
            <h1>
              Moneyhub is closing — here are the best alternatives for UK investors
            </h1>
            <p className="hero-sub">
              Moneyhub has confirmed it is shutting down its consumer product in August 2026.
              If you have been using it to track ISAs, pensions, savings or net worth, you need
              to find a replacement — and migrate your data — before that deadline.
              This is an honest comparison of the four strongest options.
            </p>
            <p className="hero-foot" style={{ marginTop: 16 }}>
              May 2026 · Updated as new information becomes available
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
            Moneyhub was one of the UK's longest-running open banking aggregation platforms. It
            let users connect bank accounts, pensions, investments and property in one view, and
            was used both by consumers directly and by financial advisers through its B2B
            platform. For many UK investors it was the only tool that offered a reasonably
            comprehensive picture of total wealth — ISAs, SIPPs, current accounts and mortgages
            in one place.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The closure of its consumer product reflects a broader pattern: open banking
            aggregation is expensive to maintain, bank connections break frequently, and the
            economics of consumer finance apps remain difficult. Moneyhub is concentrating on
            its institutional and adviser business. For its retail users, August 2026 is the
            cut-off. Export your data before then and give yourself enough time to settle into
            a replacement before the deadline.
          </p>
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
                  <td className="cmp-col-paddock">Free tier + subscription</td>
                  <td>Free</td>
                  <td>One-time purchase</td>
                  <td>Free tier + Pro</td>
                </tr>
                <tr>
                  <td>Privacy</td>
                  <td className="cmp-col-paddock">No bank linking, no data sold</td>
                  <td>Self-hosted option</td>
                  <td>On-device storage</td>
                  <td>Data used for product</td>
                </tr>
                <tr>
                  <td>UK tax wrappers (ISA / SIPP)</td>
                  <td className="cmp-col-paddock">Yes — built in, UK-first</td>
                  <td>Yes — with tax tools</td>
                  <td>Partial</td>
                  <td>Limited — budgeting focus</td>
                </tr>
                <tr>
                  <td>Platform</td>
                  <td className="cmp-col-paddock">Web + iOS</td>
                  <td>Web (PWA)</td>
                  <td>iOS only</td>
                  <td>iOS + Android</td>
                </tr>
                <tr>
                  <td>Bank linking</td>
                  <td className="cmp-col-paddock">No — manual entry only</td>
                  <td>No — manual entry only</td>
                  <td>No — manual entry only</td>
                  <td>Yes — open banking</td>
                </tr>
                <tr>
                  <td>Long-term projections</td>
                  <td className="cmp-col-paddock">Yes — 5–40 year outlook</td>
                  <td>Yes — FIRE tools included</td>
                  <td>Basic</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Native iOS app</td>
                  <td className="cmp-col-paddock">Yes</td>
                  <td>No — PWA only</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="cmp-note">
            Comparison reflects each product's primary positioning and public feature set at time
            of writing. Individual plans and features may vary. Not financial advice.
          </p>
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
            handled with daily FX rates built in. Long-term projections run from 5 to 40 years,
            giving a meaningful view of where your wealth is actually headed.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            Paddock works on both web and iOS, with a native iPhone app that has been well-
            reviewed for its design quality. There is a free tier to start, with a subscription
            unlocking projections and additional account capacity. The privacy model is clear:
            no bank credentials are ever shared, no data is sold, and no third-party aggregator
            sits between you and your accounts.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                Privacy-first with no bank linking and no data sold. ISA and SIPP awareness built
                in from the start. Multi-currency with daily FX rates. Long-term projections on
                web and native iOS. Closest thing to a Moneyhub replacement for wealth tracking
                rather than spending.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                Manual entry only — no automatic sync. Not designed for day-to-day spending or
                budgeting. No Android app. Full feature set requires a subscription. If automatic
                bank linking is your primary need, a different tool will suit you better.
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
            WealthR is a free, web-based wealth tracker with a strong emphasis on UK tax tools
            and FIRE (Financial Independence, Retire Early) planning. It is built as a
            progressive web app rather than a native application — it runs in the browser and
            can be added to your home screen, but it is not distributed through the App Store.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The tax calculator tools are a genuine differentiator. WealthR can model ISA
            allowance usage, capital gains estimates and pension contribution headroom in ways
            that most apps do not attempt. For users who care about FIRE numbers, the safe
            withdrawal rate and coast-FIRE tools are useful and clearly presented. The price —
            free — makes it easy to try alongside whatever else you are considering.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The main trade-off is the PWA format. On mobile it is functional, but it lacks the
            polish and reliability of a native app. There is no iOS App Store distribution, no
            Face ID, no widget support. For users who primarily work on desktop or laptop, that
            matters much less. For anyone who wants a strong mobile experience, it is a real
            limitation to weigh.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                Completely free. Strong UK tax calculator tools including ISA, CGT and pension
                allowance modelling. Good FIRE planning features. UK-aware account types.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                PWA only — no native iOS app. Mobile experience is limited compared to native
                apps. Smaller product team. No multi-currency support built in.
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
            WealthView takes a straightforward proposition: a one-time purchase price, all data
            stored on your device, no subscription. For users who are wary of recurring fees or
            cloud storage of financial data, that combination is genuinely appealing. The app is
            clean, quick to set up and well-rated on the App Store.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            The significant limitation is platform: WealthView is iOS only, with no web access
            and no Android support. If you want to check your portfolio on a laptop or share it
            across devices not on iCloud, there is no path in. Syncing is handled through
            iCloud, which works well if you are fully inside the Apple ecosystem — and is a
            friction point if you are not.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            UK tax wrapper support is partial. ISA and SIPP accounts can be set up, but the app
            does not model allowances, contribution rules or withdrawal scenarios with the same
            depth as Paddock or WealthR. It is better suited to clean, private net worth
            tracking than to active tax or retirement planning. A reasonable choice if you want
            a simple iOS ledger and never need web access.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                One-time price — no subscription. All data stays on your device. Clean, fast
                iOS experience. No account required to use.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                iOS only — no web access, no Android. iCloud sync only. Limited UK wrapper
                depth. No meaningful projections or retirement planning tools.
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
            Emma is the most Moneyhub-like option on this list in one important sense: it links
            to your bank accounts automatically via open banking. If the reason you used Moneyhub
            was the automatic sync — waking up to an updated view of everything without manual
            input — Emma is the closest like-for-like replacement on that dimension.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            It is primarily a budgeting and spending tool. Emma excels at helping you see where
            your money goes, identify subscriptions and track spending categories. Its wealth
            tracking features are less developed — the focus is on transactions and budgets, not
            long-term trajectory or ISA and pension planning. For Moneyhub users who mainly cared
            about total wealth across wrappers, Emma will feel like a step down in that regard.
          </p>
          <p className="section-copy" style={{ marginTop: 16 }}>
            A practical note: Emma's version 3 rollout received a significant volume of user
            complaints around feature removals and pricing changes. Some features from earlier
            versions were moved behind paywalls. It is worth reading recent App Store reviews
            before committing. Emma also uses financial data to improve and personalise the
            product — standard for open banking apps, but worth being clear about if privacy is
            a priority for you.
          </p>

          <div className="faq-grid" style={{ marginTop: 32 }}>
            <div className="faq-card">
              <h3>Where it wins</h3>
              <p>
                Automatic bank linking via open banking. Strong budgeting and spending tools.
                Free tier available. Works on iOS and Android. Large, active team with regular
                updates.
              </p>
            </div>
            <div className="faq-card">
              <h3>Where it falls short</h3>
              <p>
                Financial data is used for product improvement. v3 attracted significant user
                complaints around feature changes and new paywalls. Limited ISA, SIPP and
                long-term wealth planning depth. Not designed for wealth tracking.
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
            required. Free to start, setup takes under two minutes.
          </p>

          <div className="hero-actions center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goTo('signup')}
            >
              Create your free account
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigateTo('/net-worth-tracker')}
            >
              See how Paddock works
            </button>
          </div>

          <p className="hero-foot">Free to start · No credit card required · No bank linking</p>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
